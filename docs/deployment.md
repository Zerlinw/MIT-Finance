# 部署指南

## 部署模型

```text
main 分支
  → GitHub Actions: ci.yml（校验 + 构建）
  → GitHub Actions: deploy-pages.yml（校验 + 构建 + 上传 artifact）
  → GitHub Pages（托管 dist/）
```

- 站点是纯静态文件，没有服务端进程、数据库或环境变量。
- `scripts/build.mjs` 把 `src/` 与 `assets/` 归集到 `dist/`，不做压缩或转译。
- 所有页面使用相对路径，因此可部署在根域名或子路径（如 `/OpenCourseAtlas/`）。

## GitHub Pages（推荐）

### 首次配置

1. 将仓库推送到 GitHub。
2. 打开 **Settings → Pages**。
3. 在 **Build and deployment → Source** 选择 **GitHub Actions**（不要选 “Deploy from a branch”）。
4. 打开 **Actions** 标签，确认 `Deploy to GitHub Pages` 工作流存在。
5. 推送到 `main`，或在 Actions 中手动运行 `Deploy to GitHub Pages`。
6. 首次成功后，Pages 会显示站点 URL，形如：
   ```text
   https://<user>.github.io/OpenCourseAtlas/
   ```

> 如果仓库仍使用旧名称（例如 `MIT-Finance`），请先在 **Settings → General → Repository name** 重命名为 `OpenCourseAtlas`。GitHub 会保留旧 URL 的重定向，但 Pages 地址、徽章与文档链接应以新名为准。

### 工作流行为

`.github/workflows/deploy-pages.yml`：

| 步骤 | 说明 |
| --- | --- |
| Checkout | 拉取源码 |
| Setup Node | Node 20 |
| `npm run validate` | 校验失败则不部署 |
| `npm run build` | 生成 `dist/` |
| `configure-pages` | 读取 Pages 配置 |
| `upload-pages-artifact` | 上传 `dist/` |
| `deploy-pages` | 发布并输出站点 URL |

触发条件：

- 推送到 `main`，但忽略纯文档/模板变更（`docs/**`、`**/*.md`、Issue 模板、许可证）。
- 手动 `workflow_dispatch`。

并发控制为 `pages`，不会取消正在进行的部署；新的推送会排队。

### 首次部署检查

- [ ] Pages Source 已设为 GitHub Actions。
- [ ] `main` 上的 CI 通过。
- [ ] `deploy-pages` 工作流成功。
- [ ] 首页、课程页、图解页、404 页可访问。
- [ ] CSS/JS 返回 200，控制台无 404。
- [ ] 移动端布局正常。
- [ ] 自定义域名（如有）已配置 DNS 与 HTTPS。

## 自定义域名

1. 在仓库根目录添加 `CNAME` 文件，内容为域名，例如：
   ```text
   atlas.example.com
   ```
2. 在 DNS 提供商处添加记录：
   -  apex 域名：`A` 记录指向 GitHub Pages IP，或使用 `ALIAS`/`ANAME`。
   - 子域名：`CNAME` 指向 `<user>.github.io`。
3. 在 **Settings → Pages → Custom domain** 保存域名，等待 DNS 检查。
4. 开启 **Enforce HTTPS**。

`scripts/build.mjs` 会自动把根目录的 `CNAME` 复制到 `dist/`。修改后需要重新部署。

## 其它静态托管

| 平台 | 构建命令 | 发布目录 | 备注 |
| --- | --- | --- | --- |
| Netlify | `npm run build` | `dist` | 可配置 `_headers` / `_redirects` |
| Vercel | `npm run build` | `dist` | Framework Preset 选 “Other” |
| Cloudflare Pages | `npm run build` | `dist` | 构建环境需 Node 20 |
| 对象存储 / CDN | 本地上传 `dist/` | `dist` | 配置 404 指向 `404.html` |
| Nginx / Apache | 上传 `dist/` | 站点根目录 | 配置 `try_files` / `ErrorDocument` |

通用要求：

- 默认文档：`index.html`。
- 404：`404.html`。
- MIME：`.js` 使用 `text/javascript`，`.css` 使用 `text/css`，`.svg` 使用 `image/svg+xml`。
- 不要开启目录列表。

## 缓存策略

当前资源文件名**没有内容哈希**，因此：

- HTML：建议 `Cache-Control: no-cache` 或短缓存，确保内容更新及时。
- CSS/JS：可设置较短缓存（如 5–10 分钟）或使用 ETag 协商缓存。
- 发布后如发现旧资源，强制刷新或调整缓存策略。

如果未来引入文件名哈希，需要同步修改 `src/*.html` 的引用与构建脚本。

## 回滚

### 回滚代码

```bash
git switch main
git revert <bad-commit>
git push origin main
```

推送后 `deploy-pages.yml` 会自动重新部署上一个稳定状态。

### 重新部署历史版本

1. 打开 **Actions → Deploy to GitHub Pages**。
2. 选择最近一次成功的工作流运行。
3. 点击 **Re-run all jobs**（会使用该次运行的 commit）。

或在本地 checkout 目标 commit，手动构建并上传 `dist/` 到托管平台。

### 回滚发布

- 代码回滚后，按 [发布流程](release-process.md) 发一个 PATCH 版本，避免删除已发布的 tag。
- 不要强制移动公共 tag；如必须删除，先确认没有下游依赖。

## 故障排查

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| 部署失败：`Get Pages site failed` | Pages 未启用或 Source 不是 Actions | 按首次配置开启 |
| 部署成功但 404 | 发布目录不是 `dist` 或入口不是 `index.html` | 检查 artifact 内容与 Pages 设置 |
| 页面无样式 | 资源路径错误或 `assets/` 未上传 | 本地 `npm run build` 检查 `dist/assets` |
| 子路径部署后链接错误 | 使用了根绝对路径 `/...` | 改为相对路径 |
| 自定义域名 404 | `CNAME` 未复制或 DNS 未生效 | 检查 `dist/CNAME`、DNS、Pages 设置 |
| HTTPS 证书 pending | DNS 尚未传播 | 等待最长 24 小时，检查 DNS |
| 旧内容未更新 | CDN/浏览器缓存 | 强制刷新，检查缓存头 |

## 安全响应头（可选）

静态托管平台通常支持自定义响应头。建议：

```text
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

注意：页面包含内联 `style` 属性与 SVG 内联样式，`style-src` 需要 `'unsafe-inline'`；若未来移除内联样式，应收紧 CSP。

## 相关文档

- [开发指南](development.md)
- [发布流程](release-process.md)
- [仓库设置](repository-settings.md)

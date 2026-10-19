# 仓库设置

有些 GitHub 规范无法通过文件表达，需要在仓库 **Settings** 中配置。本文档记录推荐设置，便于团队交接与重建。

> 修改设置需要仓库管理员权限。建议每次调整后在本文件记录日期与原因。

## 1. 基本信息

| 设置 | 建议值 |
| --- | --- |
| Repository name | `OpenCourseAtlas` |
| Description | `专注 QS 名校公开课的图解合集平台：按学校、学科、课程三级组织，只收录图解，不包含视频。` |
| Website | `https://zerlinw.github.io/OpenCourseAtlas/` |
| Topics | `open-course`、`education`、`static-site`、`visualization`、`svg`、`github-pages`、`chinese` |
| Default branch | `main` |
| Social preview | 使用首页截图（1280×640） |

> 如果仓库仍叫 `MIT-Finance`，请先重命名。GitHub 会保留旧地址重定向，但本地 remote、徽章、文档链接需要同步：
>
> ```bash
> git remote set-url origin git@github.com:Zerlinw/OpenCourseAtlas.git
> ```

## 2. Features

| 功能 | 建议 | 说明 |
| --- | --- | --- |
| Issues | ✅ 开启 | 使用 `.github/ISSUE_TEMPLATE` 表单 |
| Discussions | ✅ 开启 | 问答、想法、展示；Issue 模板可引导到 Discussions |
| Projects | 可选 | 内容计划 / 发布看板 |
| Wiki | ❌ 关闭 | 文档统一放在 `docs/`，避免双份维护 |
| Sponsorships | 可选 | 如接受赞助 |

## 3. Pull Requests 与合并

**Settings → General → Pull Requests**：

- ✅ Allow merge commits：**关闭**（保持线性历史）
- ✅ Allow squash merging：**开启**
- ✅ Allow rebase merging：**开启**
- ✅ Default to squash merge：**开启**
- ✅ Automatically delete head branches：**开启**
- ✅ Allow auto-merge：**开启**（可选）

Squash 默认标题：

```text
Pull request title
```

不要使用 “Pull request title and description” 作为默认，避免把整段描述塞进提交标题。

## 4. 分支保护 / Rulesets

**Settings → Rules → Rulesets → New ruleset → New branch ruleset**：

| 规则 | 值 |
| --- | --- |
| Name | `protect-main` |
| Enforcement status | Active |
| Target branches | `main` |
| Restrict creations | ❌ |
| Restrict updates | ✅ |
| Restrict deletions | ✅ |
| Require linear history | ✅ |
| Require a pull request before merging | ✅ |
| Required approvals | 1 |
| Dismiss stale pull request approvals | ✅ |
| Require review from Code Owners | ✅ |
| Require conversation resolution | ✅ |
| Require status checks to pass | ✅ |
| Status checks | `CI / validate` |
| Require branches to be up to date | ✅ |
| Block force pushes | ✅ |

如有多个 CI job，把全部必需 job 加入 required checks。

### Tag 保护

**Rulesets → New tag ruleset**：

| 规则 | 值 |
| --- | --- |
| Name | `protect-release-tags` |
| Target tags | `v*` |
| Restrict updates | ✅ |
| Restrict deletions | ✅ |
| Bypass list | 仅维护者 |

## 5. Actions

**Settings → Actions → General**：

| 设置 | 建议 |
| --- | --- |
| Actions permissions | Allow all actions and reusable workflows（或仅允许 GitHub 官方 + 已审核的 action） |
| Workflow permissions | Read repository contents and packages permissions |
| Allow GitHub Actions to create and approve pull requests | ❌（除非引入自动发版机器人） |
| Fork pull request workflows | Require approval for first-time contributors |
| Artifact and log retention | 30 天（按需） |

工作流自身采用最小权限：

- `ci.yml`：`contents: read`
- `deploy-pages.yml`：`contents: read`、`pages: write`、`id-token: write`
- `release.yml`：`contents: write`

不要在 workflow 中硬编码 token 或密钥；使用 `GITHUB_TOKEN` 与 Environments。

## 6. Pages

**Settings → Pages**：

| 设置 | 值 |
| --- | --- |
| Source | GitHub Actions |
| Build and deployment | 由 `deploy-pages.yml` 控制 |
| Custom domain | 如有，填写并在根目录添加 `CNAME` |
| Enforce HTTPS | ✅ |

首次部署、域名与回滚详见 [部署指南](deployment.md)。

## 7. 安全

**Settings → Code security and analysis**：

| 功能 | 建议 |
| --- | --- |
| Dependency graph | ✅（GitHub 默认） |
| Dependabot alerts | ✅ |
| Dependabot security updates | ✅ |
| Dependabot version updates | ✅（`.github/dependabot.yml`） |
| Code scanning | 可选；当前无 CodeQL 配置 |
| Secret scanning | ✅（公开仓库默认） |
| Push protection | ✅ |
| Private vulnerability reporting | ✅ |

**Security → Advisories** 用于私密接收漏洞报告，与 [SECURITY.md](../SECURITY.md) 中的入口一致。

## 8. Issues 与标签

建议创建以下标签（名称与颜色可调整）：

| 标签 | 用途 | 颜色示例 |
| --- | --- | --- |
| `bug` | 缺陷 | `#d73a4a` |
| `enhancement` | 功能建议 | `#a2eeef` |
| `content` | 内容新增 / 修正 | `#f5c451` |
| `documentation` | 文档 | `#0075ca` |
| `good first issue` | 适合新贡献者 | `#7057ff` |
| `help wanted` | 需要协助 | `#008672` |
| `dependencies` | 依赖 / Actions 更新 | `#0366d6` |
| `ci` | CI / 自动化 | `#5319e7` |
| `release` | 发布相关 | `#0e8a16` |
| `triage` | 待分类 | `#fbca04` |

Issue 模板中引用了 `bug`、`enhancement`、`content`、`documentation` 等标签；请确保它们存在，或修改模板。

## 9. Discussions

建议分类：

- 📣 Announcements（公告）
- 💡 Ideas（想法）
- 🙏 Q&A（问答）
- 🙌 Show and tell（展示）
- 🧭 Content requests（内容请求）

在 `.github/ISSUE_TEMPLATE/config.yml` 中把“使用问题”引导到 Discussions。

## 10. 发布

**Settings → General → Releases**：

- ✅ Enable releases
- 不启用 “Automatically delete old releases”

Release 由 tag 触发 `release.yml` 自动创建；不要手动创建与 tag 同名的 Release，除非工作流失败需要补救。

## 11. 团队与权限

| 角色 | 权限 | 人员 |
| --- | --- | --- |
| Admin | 仓库设置、安全、发布 | 维护者 |
| Maintain | 合并 PR、管理 Issue | 核心维护者 |
| Write | 推送分支、开 PR | 常规贡献者 |
| Read | 只读 | 外部贡献者 / 观察者 |

`.github/CODEOWNERS` 当前指向 `@Zerlinw`；增加维护者时同步更新。

## 12. 设置检查清单

- [ ] 仓库已重命名为 `OpenCourseAtlas`，description / topics / website 已填写。
- [ ] Issues、Discussions 开启，Wiki 关闭。
- [ ] Squash merge 为默认，merge commit 关闭，自动删除分支开启。
- [ ] `main` ruleset 生效，required check 为 `CI / validate`。
- [ ] `v*` tag ruleset 生效。
- [ ] Actions 默认权限为只读，Pages / Release 工作流权限最小化。
- [ ] Pages Source 为 GitHub Actions。
- [ ] Dependabot alerts、secret scanning、private vulnerability reporting 开启。
- [ ] Issue 标签与模板一致。
- [ ] CODEOWNERS 与实际维护者一致。

## 相关文档

- [分支策略](branch-strategy.md)
- [部署指南](deployment.md)
- [发布流程](release-process.md)
- [安全策略](../SECURITY.md)

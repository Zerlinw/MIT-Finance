# 开发指南

## 环境要求

| 工具 | 版本 | 用途 |
| --- | --- | --- |
| Node.js | >= 20 | 本地预览、构建、校验、发布检查 |
| npm | 随 Node 提供 | 执行 `package.json` 脚本 |
| 现代浏览器 | 最近两个大版本 | 页面调试 |

项目**没有 npm 依赖**，因此不需要 `npm install`，也没有 `node_modules/`。

```bash
git clone git@github.com:Zerlinw/OpenCourseAtlas.git
cd OpenCourseAtlas
node -v
npm run dev
```

## 常用命令

| 命令 | 作用 | 备注 |
| --- | --- | --- |
| `npm run dev` | 构建并启动本地服务器 | 默认 `http://localhost:8899` |
| `npm run serve` | 同 `dev` | 语义化别名 |
| `npm run build` | 生成 `dist/` | 复制 `src/` 与 `assets/` |
| `npm run preview` | 托管已有 `dist/` | 不重新构建 |
| `npm run validate` | 仓库与数据校验 | 提交前必须通过 |
| `npm run test` | 同 `validate` | CI 与本地共用 |
| `npm run release:check -- v1.0.0` | 校验 tag 与版本一致 | 发布前使用 |

端口被占用时：

```bash
PORT=9000 npm run dev          # macOS / Linux
$env:PORT=9000; npm run dev    # PowerShell
```

## 脚本说明

### `scripts/build.mjs`

只做静态文件归集：

```text
src/*.html      → dist/*.html
assets/**       → dist/assets/**
CNAME / robots  → dist/（如果存在）
.nojekyll       → dist/.nojekyll
```

没有压缩、哈希、转译或打包。这样做的原因：

- 产物与源码一致，线上问题可直接对应源码行。
- 无构建插件与版本漂移。
- 任意静态托管都能直接使用。

### `scripts/serve.mjs`

- 启动时默认先构建。
- 提供 `GET`/`HEAD`，正确设置 MIME 与 `no-store`。
- 目录请求自动回退到 `index.html`；无扩展名请求尝试 `.html`。
- 自定义 404 使用 `dist/404.html`。
- 阻止路径穿越。

### `scripts/validate.mjs`

零依赖校验器，检查：

1. 仓库必需文件（README、LICENSE、模板、工作流、docs）。
2. `.gitignore` 关键规则。
3. 页面 `<title>`、`lang`、重复 id、资源引用是否存在。
4. 所有 `assets/**/*.js` 的语法。
5. 数据模型：id 唯一性、外键、章节、图解类型、`data` 形状、`deepLink`。
6. `package.json` 的 SemVer 与必需脚本。

新增数据字段或目录时，请同步扩展校验器；校验器是“文档之外的第二份约束”。

### `scripts/check-release.mjs`

确保三者一致：

```text
Git tag（vX.Y.Z） == package.json version == CHANGELOG 中的版本标题
```

## 目录与命名

| 新增内容 | 放置位置 | 命名 |
| --- | --- | --- |
| 页面 | `src/` | kebab-case，如 `compare.html` |
| 平台样式 | `assets/css/platform.css` | 复用现有变量与组件 |
| 专题样式 | `assets/css/legacy/` | 仅 legacy 页面使用 |
| 图片 / 图标 | `assets/img/` | SVG 优先，避免位图 |
| 数据 | `assets/js/data/` | `catalog-*.js` |
| 渲染库 | `assets/js/lib/` | `diagram-*.js` |
| 页面逻辑 | `assets/js/platform.js` | 或新增 `assets/js/features/*.js` 并按顺序加载 |
| 文档 | `docs/` | kebab-case，如 `release-process.md` |
| 脚本 | `scripts/` | kebab-case，`.mjs` |

## 页面开发流程

1. 从最新 `main` 创建分支：`git switch -c feat/<slug>`。
2. 在 `src/` 新建 HTML，复制现有页面的导航、页脚与脚本加载顺序。
3. 在 `<body>` 上设置唯一的 `data-page`。
4. 在 `platform.js` 中新增渲染函数，并注册到分发表：
   ```js
   const RENDERERS = { home, universities, university, courses, course, gallery, compare };
   ```
5. 如需导航入口，更新所有页面中的 `.nav-links`（保持一致性）。
6. 在 `assets/css/platform.css` 中复用现有变量；优先使用已有组件类。
7. 运行 `npm run validate`、`npm run build`，在桌面与移动宽度下检查。
8. 更新 README 的页面表与相关文档。

### 新增页面检查清单

- [ ] `<title>`、`meta description`、`lang="zh-CN"`、viewport 完整。
- [ ] 资源使用 `assets/...` 相对路径。
- [ ] 导航与页脚链接可用。
- [ ] `data-page` 与渲染函数一致。
- [ ] 无重复 `id`。
- [ ] 键盘可操作，焦点可见。
- [ ] 360px / 768px / 1440px 宽度无横向滚动。
- [ ] 控制台无报错。

## 调试技巧

### 直接打开带参数的页面

```text
http://localhost:8899/course.html?id=mit-6-0001
http://localhost:8899/gallery.html?course=mit-6-0001&fig=2
http://localhost:8899/courses.html?discipline=cs&level=beginner&sort=featured
```

### 检查数据是否加载

在 DevTools Console 中：

```js
SCHOOLS.length
COURSES.length
Object.keys(FIGURES).length
DiagramLib.render(FIGURES["mit-6-0001"][0]).slice(0, 120)
```

### 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面无样式 | 资源路径错误 | 确认 `href="assets/css/..."`，并检查 `dist/` |
| 页面空白 | JS 报错 / 脚本顺序错误 | 按 `catalog-data → catalog-figures → diagram-lib → platform` 加载 |
| 统计显示 `—` | 数据未加载或渲染函数未执行 | 检查 Console 与 `data-page` |
| 端口占用 | 已有服务在跑 | 设置 `PORT` 或停止旧进程 |
| 中文乱码 | 文件不是 UTF-8 | 用 UTF-8 重新保存；`.editorconfig` 已声明 |
| 修改后页面没变 | 浏览器缓存 / 未重新构建 | `npm run dev` 会重建；强制刷新 |
| `dist/` 被提交 | 忽略规则未生效 | 确认 `.gitignore`，不要 `git add -f dist` |

### 浏览器检查

- Chrome/Edge DevTools → Console / Network / Lighthouse。
- 键盘：Tab 遍历导航与卡片；图解页使用 `←` / `→` 切换；`Esc` 退出全屏。
- 移动端：DevTools 设备模拟，重点检查 360px 与 390px。
- 无 JavaScript 时：页面应保留基本导航与提示（渐进增强仍有改进空间）。

## 代码风格

- UTF-8、LF、2 空格缩进（`.editorconfig`）。
- 原生 HTML/CSS/JS，不使用框架语法。
- 变量与函数使用 camelCase；常量使用 UPPER_SNAKE_CASE。
- 优先 `const`，避免全局变量；平台代码包裹在 IIFE 中。
- 用户/数据文本进入 HTML 前必须转义（复用 `esc()`）。
- 不引入 `eval`、`new Function`、`document.write`。
- CSS 使用现有变量（`--bg`、`--gold`、`--teal` 等），不要硬编码主题色。
- 注释解释“为什么”，而不是复述代码。

## 依赖政策

- 生产代码：**零第三方依赖**。
- 开发脚本：仅 Node.js 内置模块。
- CI：仅官方 GitHub Actions。
- 如确需新增依赖，必须先开 Issue，说明无法用原生能力解决的原因、体积与维护成本，并在 PR 中更新本文档。

## 提交前检查

```bash
npm run validate
npm run build
npm run dev   # 手动检查受影响页面
git status    # 确认没有 dist/、IDE 配置、日志
```

更多协作规则见 [贡献指南](../CONTRIBUTING.md)。

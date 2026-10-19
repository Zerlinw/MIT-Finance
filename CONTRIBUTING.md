# 贡献指南

感谢你愿意为 **OpenCourseAtlas** 贡献内容或代码。本文档说明参与方式、开发约定与合并流程；提交前请完整阅读，并在 PR 中确认清单。

参与本项目即表示你同意遵守 [行为准则](CODE_OF_CONDUCT.md)。

## 目录

- [可以贡献什么](#可以贡献什么)
- [环境准备](#环境准备)
- [分支模型](#分支模型)
- [提交规范](#提交规范)
- [内容贡献流程](#内容贡献流程)
- [代码贡献流程](#代码贡献流程)
- [Pull Request 流程](#pull-request-流程)
- [文档与样式规范](#文档与样式规范)
- [许可与版权](#许可与版权)
- [获取帮助](#获取帮助)

## 可以贡献什么

| 类型 | 示例 | 入口 |
| --- | --- | --- |
| 内容新增 | 新增学校、课程、章节、知识点图解 | [内容更新 Issue](.github/ISSUE_TEMPLATE/content_update.yml) |
| 内容纠错 | 事实错误、错别字、失效链接、图解数据错误 | [Bug 报告](.github/ISSUE_TEMPLATE/bug_report.yml) |
| 功能建议 | 新的筛选、排序、阅读模式、无障碍改进 | [功能请求](.github/ISSUE_TEMPLATE/feature_request.yml) |
| 代码实现 | 页面交互、图解渲染器、构建/校验脚本 | 先开 Issue 讨论，再提交 PR |
| 文档改进 | README、docs/、注释、示例 | 直接提交 `docs/*` 分支 PR |
| 工程配置 | CI、Issue 模板、依赖机器人、发布流程 | 先开 Issue 说明动机 |

> **不收录视频**。本项目只整理图文与图解；请勿提交视频、录屏或受版权保护的整段教材内容。

## 环境准备

- **Node.js >= 20**（本地预览、构建、校验）
- 任意现代浏览器（Chrome / Edge / Firefox / Safari）
- 不需要安装任何 npm 依赖

```bash
git clone git@github.com:Zerlinw/OpenCourseAtlas.git
cd OpenCourseAtlas
npm run dev        # http://localhost:8899
npm run validate   # 提交前必须通过
```

## 分支模型

项目采用 **主干开发（trunk-based）**：`main` 始终处于可发布状态，所有改动通过短生命周期分支 + Pull Request 合入。

| 分支 | 用途 | 示例 |
| --- | --- | --- |
| `main` | 稳定主分支，受保护，自动部署 | — |
| `feat/<slug>` | 新功能、新页面、新交互 | `feat/course-compare` |
| `fix/<slug>` | 缺陷修复 | `fix/gallery-keyboard-boundary` |
| `content/<slug>` | 学校 / 课程 / 图解内容更新 | `content/cambridge-math` |
| `docs/<slug>` | 文档、注释、README | `docs/branch-strategy` |
| `chore/<slug>` | 工具、CI、仓库维护 | `chore/repo-standards` |
| `hotfix/<slug>` | 线上紧急修复，从发布 tag 拉出 | `hotfix/broken-asset-path` |

约定：

- 分支名使用小写 kebab-case，可附带 Issue 号：`feat/42-school-filter`。
- 分支生命周期尽量不超过 3 天；每天 rebase `main`，避免大冲突。
- 合并后删除远端分支。
- 不直接向 `main` 推送（维护者紧急修复也建议走 PR）。
- 详细的保护规则、合并策略与热修复流程见 [分支策略](docs/branch-strategy.md)。

## 提交规范

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

常用类型：

| type | 用途 |
| --- | --- |
| `feat` | 新功能、新页面、新内容能力 |
| `fix` | 缺陷修复 |
| `content` | 学校 / 课程 / 图解数据更新 |
| `docs` | 文档变更 |
| `style` | 样式、格式（不改变逻辑） |
| `refactor` | 重构（不改变行为） |
| `perf` | 性能优化 |
| `test` | 测试或校验脚本 |
| `ci` | CI / 工作流 |
| `chore` | 构建、工具、仓库维护 |
| `revert` | 回滚提交 |

常用 scope：`site`、`data`、`figures`、`ui`、`docs`、`ci`、`release`、`deps`。

示例：

```text
feat(data): 新增剑桥大学数学课程与 6 张图解
fix(gallery): 修复最后一张图继续切换时的越界
content(mit): 修正 18.06 第三章章节摘要
docs(repo): 补充分支保护与发布流程
ci(pages): 仅在站点文件变更时触发部署
chore(release): 1.1.0
```

要求：

- subject 使用祈使句，不超过 50 个字符，结尾不加句号。
- 一次提交只做一件事；不要把格式化、移动文件与逻辑修改混在一起。
- 破坏性变更使用 `!` 或 footer：`BREAKING CHANGE: ...`。
- 关联 Issue 使用 `Closes #123`。
- 合并 PR 时使用 **Squash and merge**，squash 后的标题必须符合上述格式。

完整规则与更多示例见 [提交规范](docs/commit-convention.md)。

## 内容贡献流程

### 1. 先确认内容边界

- 只收录 **QS 知名高校** 的公开课程与公开讲义。
- 只做 **图解与结构化整理**，不收录视频。
- 引用外部资料时注明来源；不要整段复制受版权保护的教材。
- 事实性内容（排名、年份、人名、公式）必须可核对。

### 2. 修改数据文件

| 目标 | 文件 | 操作 |
| --- | --- | --- |
| 新增学科 | `assets/js/data/catalog-data.js` | 向 `DISCIPLINES` 追加 |
| 新增学校 | 同上 | 向 `SCHOOLS` 追加，`qs` 使用可核对排名 |
| 新增课程 | 同上 | 向 `COURSES` 追加，至少 3 个章节 |
| 新增图解 | `assets/js/data/catalog-figures.js` | 按课程 id 追加数组项 |
| 新增图解类型 | `assets/js/lib/diagram-lib.js` | 在 `R` 中注册渲染函数 |

ID 约定：

- 学校：`mit`、`oxford`、`eth`。
- 课程：`<学校>-<课程号>`，如 `mit-6-0001`、`stanford-cs229`。
- 章节：课程内 `c1`、`c2`、`c3`……
- 图解：课程内 `f01`、`f02`……（只需在课程内唯一）。

### 3. 本地验证

```bash
npm run validate   # 页面引用 / 数据关系 / JS 语法
npm run build      # 确认可发布
npm run dev        # 浏览器逐页检查
```

至少检查：

- 首页统计数字正确。
- 新课程能在列表、学校详情、学科筛选中出现。
- 图解能打开、切换、缩放、全屏，移动端不溢出。
- 控制台无报错。

### 4. 提交 PR

使用 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)，说明内容来源、变更范围与自检结果。新增或修改内容时附上可核对的来源链接。

## 代码贡献流程

1. **先讨论**：非小型修复请先开 Issue，说明问题、方案与影响范围。
2. **保持零依赖**：不引入前端框架、打包器或运行时 npm 依赖；如确有必要，先在 Issue 中讨论。
3. **保持内容与代码分离**：数据结构变化必须同步更新 `docs/data-model.md` 与校验脚本。
4. **保持可访问性**：交互控件使用语义化标签、键盘可达、提供 `aria-label`；图解 SVG 需有可读标题或说明。
5. **保持相对路径**：页面内资源使用相对路径，确保站点可部署在子路径（如 GitHub Pages 项目页）。
6. **不要提交构建产物**：`dist/`、IDE 配置、调试日志均在忽略列表中。

## Pull Request 流程

提交前确认：

- [ ] 分支名符合约定，且基于最新 `main`。
- [ ] 提交信息符合 Conventional Commits；已 rebase 整理提交。
- [ ] `npm run validate` 通过。
- [ ] `npm run build` 通过。
- [ ] 改动涉及页面时，已在桌面与移动宽度下检查。
- [ ] 改动涉及数据时，已更新相关文档或统计数字。
- [ ] 没有提交视频、密钥、个人信息或 `dist/` 等产物。
- [ ] PR 描述包含变更动机、范围、验证方式与截图（如适用）。
- [ ] 已阅读并遵守 [行为准则](CODE_OF_CONDUCT.md)。

评审与合并：

- 至少 1 名维护者 approve，CI 通过后可合并。
- 默认使用 **Squash and merge**；合并后删除分支。
- 维护者可能要求拆分过大的 PR，或补充测试/文档。
- 紧急安全修复见 [安全策略](SECURITY.md)。

## 文档与样式规范

- Markdown 使用中文全角标点；代码、路径、命令使用反引号。
- 文档中的相对链接必须在仓库内可解析。
- HTML/CSS/JS 使用 2 空格缩进、UTF-8、LF；由 `.editorconfig` 约束。
- 新增文件遵循现有目录：页面进 `src/`，样式/脚本进 `assets/`，文档进 `docs/`，脚本进 `scripts/`。
- 不提交个人 IDE 配置；共享编辑器配置请通过 `.editorconfig` 或 `.vscode/extensions.json` 提交。

## 许可与版权

- 代码贡献按 [MIT](LICENSE) 许可。
- 原创文档、图解与数据整理按 [CC BY-NC-SA 4.0](LICENSE-CONTENT) 许可。
- 提交即表示你有权提供该内容，并同意以上许可；第三方内容必须保留原权利声明。
- 本项目不收取 CLA（贡献者许可协议）。

## 获取帮助

- 使用问题：开 [Discussion](https://github.com/Zerlinw/OpenCourseAtlas/discussions) 或 Issue。
- 安全问题：不要公开提交，按 [安全策略](SECURITY.md) 私密报告。
- 行为准则问题：联系维护者 `623035054@qq.com`。

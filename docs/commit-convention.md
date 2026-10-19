# 提交规范

项目采用 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/zh-hans/) 作为提交信息格式。它让历史可读、便于生成 Release Notes，并减少“这个提交到底改了什么”的沟通成本。

## 基本格式

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- `type`、`scope`、`subject` 为必需；`scope` 可省略。
- 标题与正文之间空一行；正文与 footer 之间空一行。
- 标题不超过 **50 个字符**（中文按字符计），结尾不加句号。
- 正文每行建议不超过 **72 个字符**。

## type

| type | 用途 | 是否影响版本 |
| --- | --- | --- |
| `feat` | 新功能、新页面、新交互 | MINOR |
| `fix` | 缺陷修复 | PATCH |
| `content` | 学校 / 课程 / 图解数据更新（项目自定义） | MINOR（新增）/ PATCH（纠错） |
| `docs` | 文档、注释、README | PATCH |
| `style` | 样式、格式，不改变逻辑 | PATCH |
| `refactor` | 重构，不改变外部行为 | PATCH |
| `perf` | 性能优化 | PATCH |
| `test` | 测试、校验脚本 | PATCH |
| `build` | 构建脚本、发布产物 | PATCH |
| `ci` | CI / 工作流 / 自动化 | PATCH |
| `chore` | 维护性工作、依赖、仓库配置 | PATCH |
| `revert` | 回滚提交 | 视被回滚内容 |

> `content` 不是 Conventional Commits 官方类型，是本项目为内容变更定义的类型。若你更倾向标准类型，也可以用 `feat(data)` 表示新增内容、`fix(data)` 表示内容纠错。

## scope

scope 表示影响范围，使用小写 kebab-case：

| scope | 范围 |
| --- | --- |
| `site` | 页面结构、导航、整体站点 |
| `data` | `catalog-data.js` |
| `figures` | `catalog-figures.js` |
| `ui` | 样式、组件、响应式 |
| `gallery` | 图解浏览页 |
| `docs` | 文档 |
| `ci` | 工作流 |
| `release` | 版本与发布 |
| `deps` | 依赖 / Actions 升级 |
| `repo` | 仓库结构、忽略规则、模板 |

scope 可以更具体，如 `mit`、`cs229`，但不要滥用。

## subject

- 使用祈使句，描述“这个提交做了什么”，而不是“我做了什么”。
- 首字母小写（英文），中文直接写。
- 不加句号、不写“update”、“fix bug”这类无信息量的词。
- 说明结果，而不是过程。

好的示例：

```text
feat(data): 新增剑桥大学数学课程与 6 张图解
fix(gallery): 修复最后一张图继续切换时的越界
content(mit): 修正 18.06 第三章章节摘要
docs(repo): 补充分支保护与发布流程
ci(pages): 仅在站点文件变更时触发部署
chore(release): 1.1.0
```

不好的示例：

```text
update
fix bug
修改了一些东西
feat: 新增课程。
WIP
```

## body

正文用于解释 **为什么** 和 **影响范围**，而不是复述 diff：

```text
fix(gallery): 修复最后一张图继续切换时的越界

上一张/下一张按钮在边界处仍会更新 URL，导致画面与地址不一致。
现在到达首尾时禁用对应按钮，并保留当前索引。

Closes #42
```

适合写进正文的内容：

- 问题背景与复现条件。
- 方案取舍与替代方案。
- 数据迁移、兼容性影响。
- 需要 Reviewer 特别注意的点。

## footer

常用 footer：

```text
Closes #123
Refs #456
BREAKING CHANGE: COURSES 的 minutes 字段改为必填
Co-authored-by: Name <email@example.com>
Signed-off-by: Name <email@example.com>
```

- 关联 Issue 使用 `Closes` / `Fixes` / `Refs`。
- 破坏性变更必须写 `BREAKING CHANGE:`，说明迁移方式。
- 也可以使用 `!` 标记：`feat(data)!: ...`，但仍建议在 footer 写细节。

## 破坏性变更

```text
refactor(data)!: 统一课程时长为分钟

BREAKING CHANGE: COURSES.minutes 现在统一表示分钟，原先按小时填写的数据
需要乘以 60。受影响课程：mit-6-0001、stanford-cs229。
```

要求：

- 在标题或 footer 中明确标记。
- 说明受影响的数据 / 页面 / 调用方。
- 提供迁移步骤。
- 对应 MAJOR 版本（见 [版本管理](versioning.md)）。

## 原子提交

一个提交应该：

- 只解决一个问题。
- 可以独立通过 `npm run validate`（理想情况下）。
- 不混合“移动文件 + 修改逻辑 + 格式化”。

推荐拆分：

```text
refactor(site): 将页面迁移到 src/
fix(site): 修正迁移后的资源路径
docs(repo): 更新目录结构说明
```

不推荐：

```text
refactor: 重构整个项目
```

如果一次 PR 包含多个逻辑提交，合并时使用 Squash，最终只保留一个语义化提交；若希望保留历史，则使用 Rebase merge，并确保每个提交都通过校验。

## 提交前检查

```bash
git diff --check          # 检查空白错误
npm run validate
git status                # 确认没有 dist/、IDE 配置、日志
git log --oneline -5      # 检查历史是否清晰
```

## 签名与 DCO

- 维护者建议配置 GPG 或 SSH 提交签名，GitHub 会显示 Verified。
- 项目不强制 DCO，但欢迎使用 `git commit -s` 添加 `Signed-off-by`。
- 不要求 CLA。

## 回滚提交

```text
revert: feat(data): 新增剑桥大学数学课程

This reverts commit 1a2b3c4d.
Reason: 课程来源链接失效，等待核实后重新提交。
```

回滚使用 `git revert`，不要重写已推送的历史。

## 与自动化的关系

- PR 标题在 Squash 合并时会成为 `main` 的提交标题，因此 **PR 标题也必须符合本规范**。
- Release Notes 由 GitHub 根据 PR / commit 生成；清晰的标题与标签能显著提升可读性。
- 校验脚本不强制检查提交信息（本地 hook 可自行配置），但维护者会在评审中把关。

## 相关文档

- [分支策略](branch-strategy.md)
- [版本管理](versioning.md)
- [发布流程](release-process.md)
- [贡献指南](../CONTRIBUTING.md)

# OpenCourseAtlas 文档

本目录保存项目架构、内容生产、开发协作与发布维护的长期文档。README 面向首次访问者，`docs/` 面向贡献者与维护者。

## 阅读路径

| 你的目标 | 建议顺序 |
| --- | --- |
| 第一次参与 | [贡献指南](../CONTRIBUTING.md) → [开发指南](development.md) → [架构说明](architecture.md) |
| 新增学校 / 课程 / 图解 | [内容指南](content-guide.md) → [数据模型](data-model.md) → [开发指南](development.md) |
| 修改页面或渲染器 | [架构说明](architecture.md) → [开发指南](development.md) → [数据模型](data-model.md) |
| 维护仓库 / 发版 | [分支策略](branch-strategy.md) → [版本管理](versioning.md) → [发布流程](release-process.md) → [仓库设置](repository-settings.md) |
| 处理安全报告 | [安全策略](../SECURITY.md) → [仓库设置](repository-settings.md) |

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [architecture.md](architecture.md) | 站点分层、页面渲染链路、脚本加载顺序、扩展点与非目标 |
| [data-model.md](data-model.md) | 学校 / 学科 / 课程 / 章节 / 图解的字段、关系、类型与校验规则 |
| [content-guide.md](content-guide.md) | 新增与修订内容的标准流程、命名、质量标准与审核清单 |
| [development.md](development.md) | 本地环境、npm 脚本、目录约定、调试与验证 |
| [deployment.md](deployment.md) | GitHub Pages、其它静态托管、自定义域名、回滚 |
| [branch-strategy.md](branch-strategy.md) | 主干开发、分支命名、保护规则、合并策略、热修复 |
| [versioning.md](versioning.md) | SemVer 映射、版本来源、兼容性承诺、预发布 |
| [commit-convention.md](commit-convention.md) | Conventional Commits、type/scope、示例、破坏性变更 |
| [release-process.md](release-process.md) | 发布前检查、打 tag、Release 工作流、热修复与回滚 |
| [repository-settings.md](repository-settings.md) | 无法用文件表达的 GitHub 平台配置：分支保护、Pages、Actions 等 |

## 文档维护约定

- **随代码更新**：修改数据字段、脚本命令、目录结构或发布流程时，在同一个 PR 中更新对应文档。
- **单一事实来源**：版本号只在 `package.json` 维护；分支/发布规则以本目录文档为准；README 只做摘要并链接到这里。
- **相对链接**：文档之间使用相对路径链接，确保在 GitHub 与本地编辑器都能打开。
- **可执行示例**：命令使用代码块，路径使用反引号，避免依赖个人机器上的绝对路径。
- **中文优先**：项目文档以中文为主；代码标识符、命令、文件名保持英文。
- **日期格式**：使用 `YYYY-MM-DD`；版本使用 `vX.Y.Z`。

## 文档变更流程

1. 从最新 `main` 创建 `docs/<slug>` 分支。
2. 修改或新增文档，必要时同步 README 的索引。
3. 本地检查相对链接与命令是否可执行。
4. 提交 PR，使用 `docs(<scope>): ...` 作为标题。
5. 至少 1 名维护者审核；涉及流程变更时，同步更新相关模板与工作流。

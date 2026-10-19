# Changelog

本文件记录 OpenCourseAtlas 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Planned

- 补充 UCL、Caltech 的课程内容。
- 增加课程搜索的键盘导航与无障碍标签。
- 为图解浏览页增加分享链接与深链复制。

## [1.0.0] - 2026-10-20

首个按照 GitHub 仓库规范完成结构化的版本。

### Added

- 建立 `src/`、`assets/`、`docs/`、`scripts/`、`.github/` 分层目录。
- 新增仓库级文档：README、CONTRIBUTING、CODE_OF_CONDUCT、SECURITY、CHANGELOG。
- 新增代码许可（MIT）与原创内容许可（CC BY-NC-SA 4.0）。
- 新增 `docs/`：架构、数据模型、内容指南、开发、部署、分支、版本、提交、发布、仓库设置。
- 新增零依赖脚本：`build.mjs`、`serve.mjs`、`validate.mjs`、`check-release.mjs`。
- 新增 CI、GitHub Pages 部署与 Release 自动化工作流。
- 新增 Issue 表单、PR 模板、CODEOWNERS 与 Dependabot 配置。
- 新增 `src/404.html` 自定义错误页。
- 新增站点图标 `assets/img/favicon.svg`。
- 新增 `.editorconfig`、`.gitattributes`、`.gitignore`。

### Changed

- 页面从仓库根目录迁移至 `src/`。
- 样式与脚本统一归档到 `assets/css/`、`assets/js/`；数据层与渲染库分别归入 `data/`、`lib/`。
- 修复页面中因资源迁移导致的 `css/`、`js/` 失效引用。
- 重写 README，补充快速开始、目录结构、数据模型、协作规范与部署说明。
- 统一 UTF-8 编码、LF 换行与 2 空格缩进约定。

### Removed

- 从版本控制中移除 `.idea/` 等 IDE 个人配置。
- 从版本控制与工作区移除 `.playwright-cli/` 调试产物。
- 移除旧的根目录 `css/`、`js/` 路径引用。

### Fixed

- 修复静态资源路径与 HTML 实际目录不一致导致的样式、脚本加载失败。
- 修复课程详情页头部信息被章节折叠样式 `.ch-body` 隐藏的问题。
- 校正 MIT 15.401 的学习时长（0 → 85 分钟），使数据校验通过。

[Unreleased]: https://github.com/Zerlinw/OpenCourseAtlas/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Zerlinw/OpenCourseAtlas/releases/tag/v1.0.0

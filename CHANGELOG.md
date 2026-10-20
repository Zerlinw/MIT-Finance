# Changelog

本文件记录 OpenCourseAtlas 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Planned

- 补充 UCL、Caltech 的课程内容。
- 增加课程搜索的键盘导航与无障碍标签。
- 首页 P1/P2 迭代：学科卡深度分布徽章、最近上图筛选 chips、教师维度页、学习进度本地记忆。

## [2.0.0] - 2026-10-20

「深度专题」独立模块整体并入「金融理论 I」课程，首页完成信息架构升级。

### Removed

- 移除独立「深度专题」页 `src/mit-finance.html`（内容已全部并入金融理论课程）。
- 移除 `assets/js/legacy/` 六个脚本与 `assets/css/legacy/style.css`。
- 移除全站 8 个页面顶部导航中的「深度专题」入口。
- 移除 `COURSES.deepLink` 字段及对应校验（按 Schema 演进策略的破坏性变更，升 MAJOR）。

### Added

- 金融理论 I 新增章节 c4「投资认知框架」与 c5「实战与延伸」，课程图解 6 → 15 张（七大认知模块图解体 + 行动清单 + 延伸学习地图，共 45 个新标记点）。
- 新增 `assets/js/finance-lab.js`：金融课程交互实验室自包含模块（复利引擎、凯利公式计算器、认知自检、行动清单、延伸学习弹窗、滚雪球动画），由课程可选字段 `lab:"finance"` 按需加载。
- 首页新增「三步读懂本站」引导模块与「特色深度体验」位（lab 字段数据驱动，跳转 `course.html?id=mit-15-401#fin-lab`）。
- 首页 hero 统计由 4 项增至 6 项（新增交互标记点数、3D 心智模型数），硬编码学科磁贴替换为数据驱动的「平台能力」磁贴。
- `COURSES.lab` 可选字段与 `validate.mjs` 白名单校验。
- 新增英文版说明 `README.en.md`，与中文 `README.md` 顶部互链。

### Changed

- 金融理论 I 课程结构重组：3 章 → 5 章，概述、学习要点、受众与深度递进路径同步更新；原深度专题的七大模块正文、金句、公式与行动建议全部落入对应图解的 explain/detail/points。
- 全站 7 个页面页脚浏览链接由 `mit-finance.html` 改指 `course.html?id=mit-15-401`。
- `platform.js`：`renderCourse` 按 `lab` 字段渲染实验室区块并动态加载脚本；CTA 与课程导学卡增加「⚗️ 实战实验室」页内锚点；侧栏统计增加「交互实验室」行。
- 文档同步：数据模型（deepLink → lab）、架构（页面表/目录职责/脚本顺序/扩展点）、内容指南、开发指南、README。

### Fixed

- 图解浏览 `?mark=k` 深链失效：`render()` 的 URL 同步早于参数读取，改为先取参数再渲染。
- 页内锚点（`#fin-lab`、`#g3d` 等）被吸顶导航遮挡：`html` 增加 `scroll-padding-top`；实验室异步挂载后补一次锚点定位，首页 CTA 与首屏深链均可准确落位。
- 资源详情弹窗遮罩层级低于顶部导航（80 → 200），避免导航拦截遮罩点击。
- 画廊首尾「上一张 / 下一张」在禁用状态仍输出 `fig=-1` / `fig=length` 无效链接，改为移除 `href`。
- 首页英雄统计 6 项改为 3×2 栅格；平台能力磁贴为奇数时末项通栏，消除孤立换行。

## [1.1.0] - 2026-10-20

面向有基础学生的深度学习体验升级：图解从「一张图 + 一段解读」升级为
「导读 + 知识点 + 可点击标记点 + 关联 3D 场景」的复合知识单元。

### Added

- 新增 `assets/js/data/catalog-models.js`：14 个课程级 3D 心智模型场景（数据化原语拼装）。
- 新增 `assets/js/lib/scene3d-lib.js`：零依赖软件渲染 3D 引擎（Canvas 2D + 透视投影 + 画家算法），
  支持拖拽旋转（带惯性）、滚轮缩放、自动旋转、重置视角、部件与锚点拾取。
- 图解新增可选 `detail` 字段：导读、3–5 条带深度标签的知识点、常见误区、进阶提示、3D 机位与聚焦关联。
- 图解新增可选 `marks` 字段：253 个交互标记点（SVG 内叠加编号圆点层，随缩放/平移变换），
  点击 / 键盘弹出详情卡，侧栏列表联动，支持 `?mark=k` URL 深链。
- 课程新增可选 `audience`（受众定位）与 `deepPath`（L1–L4 深度递进路径）。
- 四级知识深度体系：L1 概念 / L2 机制 / L3 关系与定量 / L4 系统与前沿，贯穿图解、知识点、标记点与课程页。
- gallery 页新增：3D 心智模型舞台（与当前图解机位/聚焦联动）、深度筛选、进阶模式（L3/L4 标注开关）、
  标记点面板与详情卡。
- course 页新增：课程导学卡片、知识深度递进路径图、课程级 3D 模型区（含 3D 锚点列表）。
- 课程卡片新增标记点数量、3D 徽章与知识深度展示。
- 校验脚本新增 `detail` / `marks` / `MODELS` / `audience` / `deepPath` 规则（坐标范围、深度枚举、模型与部件引用）。

### Changed

- `diagram-lib.js` 的 `render()` 支持 `opts.marks` 开关，并在 SVG 内叠加 mark 标记点层（含脉冲动画与键盘可达性）。
- 脚本加载顺序扩展为 `catalog-data → catalog-figures → catalog-models → diagram-lib → scene3d-lib → platform.js`，
  无 3D 需求的页面可安全省略后两个文件。
- 首页图解缩略图关闭 mark 叠加，避免信息过载。

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

[Unreleased]: https://github.com/Zerlinw/OpenCourseAtlas/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Zerlinw/OpenCourseAtlas/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/Zerlinw/OpenCourseAtlas/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Zerlinw/OpenCourseAtlas/releases/tag/v1.0.0

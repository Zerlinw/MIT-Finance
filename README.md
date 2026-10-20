# OpenCourseAtlas · 全球名校公开课图解库

[English](README.en.md) · 中文

[![CI](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/ci.yml)
[![Deploy](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/github/package-json/v/Zerlinw/OpenCourseAtlas?label=version)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Content: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE-CONTENT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

专注于 **QS 知名高校公开课** 的图解合集平台：按 **学校 → 学科 → 课程** 三级组织内容，每门课程以 **课程概述 + 知识点图解 + 章节结构** 呈现。**只收录图解内容，明确排除视频。**

项目是纯静态站点：**零运行时依赖、零打包、零转译**，可直接部署到 GitHub Pages 或任意静态托管。

## 特性

- **三级内容体系**：学校、学科、课程互相索引，支持筛选、搜索、排序与相关推荐。
- **内容与代码分离**：新增课程、章节、图解只需扩展数据文件，不改渲染逻辑。
- **14 种 SVG 图解**：概念图、流程、对比、分层、金字塔、时间轴、循环、矩阵、折线、树、标尺、条形、韦恩、卡片。
- **结构化课程描述**：每张图解配导读、3–5 条带深度标签的知识点、常见误区与进阶提示。
- **交互标记点**：图解上叠加编号 mark 点，点击/键盘弹出详情卡，支持 `?mark=k` 深链分享。
- **3D 心智模型**：每门课程一个可旋转缩放的 3D 场景（自研零依赖软件渲染引擎），与图解机位联动。
- **四级深度递进**：L1 概念 → L2 机制 → L3 关系与定量 → L4 系统与前沿，课程页与图解页全程导航。
- **课程级交互实验室**：金融理论 I 配备复利引擎、凯利公式计算器、认知自检与行动清单（`lab` 字段数据驱动）。
- **完整阅读体验**：图解支持放大、平移、键盘切换、全屏与阅读进度。
- **零构建依赖**：没有框架、没有 npm 运行时依赖；`dist/` 仅由静态文件归集生成。
- **仓库级工程规范**：CI 校验、Issue/PR 模板、语义化版本、自动化发布与 Pages 部署。

## 快速开始

环境要求：**Node.js >= 20**（仅用于本地预览与校验，站点本身不需要 Node）。

```bash
# 启动本地预览（自动构建到 dist/，默认 http://localhost:8899）
npm run dev

# 只构建发布目录
npm run build

# 预览已有 dist/
npm run preview

# 运行仓库校验（页面引用、数据模型、JS 语法、必需文件）
npm run validate
```

> 不需要执行 `npm install`：本项目没有第三方依赖。
> 也可以 `npm run build` 后，用任意静态服务器托管 `dist/`，例如
> `cd dist && python -m http.server 8899`。

## 目录结构

```text
OpenCourseAtlas/
├── .github/                     # Issue / PR 模板、CODEOWNERS、CI 与发布工作流
├── assets/                      # 静态资源
│   ├── css/
│   │   └── platform.css         # 平台主题与组件（含实验室等课程级组件）
│   ├── img/
│   │   └── favicon.svg          # 站点图标
│   └── js/
│       ├── data/                # 数据层：学校 / 学科 / 课程 / 图解 / 3D 模型
│       ├── lib/                 # 图解渲染库（SVG）与 3D 引擎（Canvas 软件渲染）
│       ├── finance-lab.js       # 金融课程交互实验室（lab 字段按需加载）
│       └── platform.js          # 平台页面渲染与交互
├── docs/                        # 架构、数据、内容、开发、协作与发布文档
├── scripts/                     # 零依赖开发脚本：构建 / 预览 / 校验 / 发布检查
├── src/                         # 页面源码（发布时复制到站点根目录）
│   ├── index.html               # 首页
│   ├── universities.html        # 学校列表
│   ├── university.html          # 学校详情（?id=学校 id）
│   ├── courses.html             # 课程列表
│   ├── course.html              # 课程详情（?id=课程 id）
│   ├── gallery.html             # 图解浏览（?course=课程 id&fig=序号）
│   └── 404.html                 # 自定义 404
├── .editorconfig                # 统一编码 / 缩进 / 换行
├── .gitattributes               # 统一文本换行与二进制标记
├── .gitignore                   # 忽略 IDE、dist/、依赖与日志
├── CHANGELOG.md                 # 版本变更记录
├── CODE_OF_CONDUCT.md           # 社区行为准则
├── CONTRIBUTING.md              # 贡献指南
├── LICENSE                      # 代码许可（MIT）
├── LICENSE-CONTENT              # 原创内容许可（CC BY-NC-SA 4.0）
├── README.md                    # 中文说明（默认）
├── README.en.md                 # English README
├── SECURITY.md                  # 安全策略
└── package.json                 # 项目元数据、版本与脚本
```

> `dist/` 是 `npm run build` 生成的发布目录，已加入 `.gitignore`，不提交到仓库。

## 页面构成

| 页面 | 路径 | 内容与交互 |
| --- | --- | --- |
| 首页 | `index.html` | 数据统计、三步引导、学科入口、编辑推荐、特色深度体验、名校巡礼、最新图解 |
| 学校列表 | `universities.html` | 关键词 / 学科 / 国家筛选，学校卡片（QS 排名、课程数、图解体数） |
| 学校详情 | `university.html?id=<school>` | 学校概况、按学科筛选课程、课程卡片网格 |
| 课程列表 | `courses.html` | 学校 / 学科 / 难度筛选 + 搜索 + 排序，筛选状态同步 URL |
| 课程详情 | `course.html?id=<course>` | 课程导学、知识深度递进路径、3D 心智模型、章节结构、图解清单、实战实验室（lab 课程）、相关课程 |
| 图解浏览 | `gallery.html?course=<id>&fig=<n>` | 放大 / 缩小 / 重置、拖动平移、键盘切换、全屏、阅读进度、mark 标记点、3D 舞台、深度筛选与进阶模式 |

平台页面的脚本加载顺序固定为：

```text
data/catalog-data.js → data/catalog-figures.js → data/catalog-models.js
  → lib/diagram-lib.js → lib/scene3d-lib.js → platform.js
```

> 仅 `gallery.html` 与 `course.html` 需要 3D 相关脚本；其余页面省略后由 platform.js 安全降级。

## 数据模型

```text
SCHOOLS      学校   { id, name, en, short, qs, country, city, founded, color, intro }
DISCIPLINES  学科   { id, name, icon, color }
LEVELS       难度   { id, name, desc }
COURSES      课程   { id, school, discipline, code, title, en, instructor,
                     level, levelKey, tags, source, minutes, updated,
                     overview, takeaways, prereq, chapters[],
                     audience?, deepPath?, featured?, lab? }
FIGURES      图解   { 课程 id: [{ id, ch, title, type, caption, explain, data,
                                  detail?, marks? }] }
MODELS       3D     { 课程 id: { title, camera, parts[], marks[] } }
```

课程通过 `school` / `discipline` 关联学校与学科；图解通过 `ch` 归属章节；每张图解可携带结构化描述 `detail`（导读 + 知识点 + 误区 + 进阶 + 3D 机位关联）与交互标记点 `marks`；每门课程配置一个 3D 心智模型 `MODELS`。字段约束、关系与图解类型详见 [数据模型](docs/data-model.md)。

当前收录：**10 所学校、14 门课程、93 张图解、280 个交互标记点、14 个 3D 心智模型、8 个学科方向、14 种图解类型**。

## 如何扩充内容

- **新增学校**：向 `assets/js/data/catalog-data.js` 的 `SCHOOLS` 追加一条。
- **新增课程**：向 `COURSES` 追加课程（含 `chapters`），再向 `catalog-figures.js` 的 `FIGURES` 追加该课程的图解数组。
- **新增图解**：向对应课程数组追加一条数据，选择一种已注册的 `type`，无需修改渲染代码。
- **增强图解**：补充 `detail`（导读 / 知识点 / 误区 / 进阶）与 `marks`（交互标记点），并配置 `detail.model` / `view` / `focus` 关联 3D 场景。
- **新增 3D 模型**：在 `assets/js/data/catalog-models.js` 的 `MODELS` 中追加场景（原语拼装），图解通过 `detail.focus` 高亮部件。
- **新增图解类型**：在 `assets/js/lib/diagram-lib.js` 的 `R` 渲染器表中注册渲染函数，并在 `docs/data-model.md` 补充数据形状。

完整的字段说明、命名约定、质量标准和审核清单见 [内容指南](docs/content-guide.md)。

## 开发与校验

```bash
npm run dev        # 构建并启动本地服务器
npm run validate   # 校验页面引用、数据关系、JS 语法与仓库文件
npm run build      # 生成 dist/ 发布目录
npm run preview    # 托管已有 dist/
```

CI 在每次推送 `main` 与每个 Pull Request 上执行 `npm run validate` 和 `npm run build`。开发约定、调试方式与目录说明见 [开发指南](docs/development.md)。

## 协作规范

- **分支模型**：主干开发（trunk-based），`main` 始终可发布；功能分支短生命周期，通过 PR 合入。
- **提交信息**：遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，例如 `feat(data): 新增剑桥数学课程`。
- **版本管理**：遵循 [SemVer](https://semver.org/lang/zh-CN/)，`package.json` 为版本唯一事实来源，Git tag 形如 `v1.2.0`。
- **发布流程**：更新 CHANGELOG → 合并版本 PR → 打 tag → GitHub Actions 自动创建 Release。

完整变更记录见 [CHANGELOG.md](CHANGELOG.md)。

| 文档 | 说明 |
| --- | --- |
| [贡献指南](CONTRIBUTING.md) | 环境准备、分支命名、提交规范、PR 清单 |
| [分支策略](docs/branch-strategy.md) | 分支类型、保护规则、合并方式、热修复 |
| [提交规范](docs/commit-convention.md) | 类型、scope、示例与破坏性变更 |
| [版本管理](docs/versioning.md) | SemVer 映射、兼容性承诺、预发布 |
| [发布流程](docs/release-process.md) | 版本发布、热修复、回滚与检查清单 |
| [仓库设置](docs/repository-settings.md) | 分支保护、标签保护、Pages、Actions 等平台配置 |
| [架构说明](docs/architecture.md) | 分层、渲染链路、扩展点与非目标 |
| [数据模型](docs/data-model.md) | 字段、关系、图解类型与校验规则 |
| [内容指南](docs/content-guide.md) | 新增学校 / 课程 / 图解的标准流程 |
| [开发指南](docs/development.md) | 本地开发、脚本、调试与验证 |
| [部署指南](docs/deployment.md) | GitHub Pages 与其它静态托管 |
| [文档索引](docs/README.md) | 全部文档与阅读路径 |

## 部署

推荐使用仓库内置的 GitHub Actions 工作流：

1. 在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
2. 推送到 `main` 后，`deploy-pages.yml` 会自动校验、构建并发布 `dist/`。
3. 自定义域名可放置根目录 `CNAME`，构建时会自动复制到 `dist/`。

也支持 Netlify、Vercel、Cloudflare Pages 等平台：构建命令 `npm run build`，发布目录 `dist`。详见 [部署指南](docs/deployment.md)。

## 许可证

- **代码**（HTML 结构、CSS、JavaScript、构建与校验脚本）：[MIT](LICENSE)。
- **项目原创内容**（文档、图解、数据整理）：[CC BY-NC-SA 4.0](LICENSE-CONTENT)。

第三方课程名称、课程大纲、商标与教材内容归各原权利人所有；本项目仅做学习交流用途的知识整理与可视化，不构成任何投资或专业建议。如权利人认为内容不当，请通过 Issue 或邮件联系删除。

## 致谢

感谢 MIT OpenCourseWare、Harvard CS50、Stanford Online、Oxford、Cambridge、ETH Zürich、NUS 等高校公开课程与讲义，为本项目提供了知识来源与结构参考。

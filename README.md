# OpenCourseAtlas · 全球名校公开课图解库

专注于 **QS 知名高校公开课** 的图解合集平台：按 **学校 → 学科 → 课程** 三级组织内容，每门课程以 **课程概述 + 知识点图解 + 章节结构** 呈现。**只收录图解内容，明确排除视频。**

纯静态、零依赖、无构建，可直接部署到任意静态托管。

## 在线预览

```bash
# Python
python -m http.server 8899

# 或 Node
npx serve .
```

访问 <http://localhost:8899>

## 目录结构

```
OpenCourseAtlas/
├── index.html              # 平台首页（推荐与分类入口）
├── universities.html       # 学校列表（按学科/国家/关键词筛选）
├── university.html         # 学校详情页（?id=学校id）
├── courses.html            # 课程列表（学校/学科/难度筛选 + 搜索 + 排序）
├── course.html             # 课程详情页（?id=课程id：概述/章节/图解清单）
├── gallery.html            # 图解浏览页（?course=课程id&fig=序号：放大/切换/平移/全屏）
├── mit-finance.html        # 深度专题：MIT 金融课七大模块（原站点首页，保留）
├── css/
│   ├── style.css           # 原专题页样式（mit-finance.html 使用）
│   └── platform.css        # 平台样式（深色主题 + 组件 + 响应式）
├── js/
│   ├── catalog-data.js     # 平台数据层：学科 / 学校 / 课程 / 章节
│   ├── catalog-figures.js  # 图解数据层：各课程的知识点图解（仅数据）
│   ├── diagram-lib.js      # 图解渲染库：14 种通用 SVG 图解类型 + 课程封面生成
│   └── platform.js         # 平台逻辑：六个页面的渲染与交互
├── js/（data.js / diagrams.js / roadmap.js / lab.js / quiz.js / main.js）
│                           # 原专题页脚本（mit-finance.html 使用）
└── README.md
```

平台页面脚本按依赖顺序加载：`catalog-data.js → catalog-figures.js → diagram-lib.js → platform.js`。

## 页面构成

| 页面 | 内容与交互 |
| --- | --- |
| 首页 | 数据统计、学科分类入口、编辑推荐、QS 名校巡礼、最近上图 |
| 学校列表 | 关键词 / 学科 / 国家筛选，学校卡片（QS 排名、课程数、图解体数） |
| 学校详情 | 学校概况、按学科筛选课程 Tab、课程卡片网格 |
| 课程列表 | 学校 / 学科 / 难度筛选 + 关键词搜索 + 四种排序，筛选状态同步 URL |
| 课程详情 | 课程概述、学习要点、章节结构（手风琴）、图解清单、相关课程 |
| 图解浏览 | 大图查看、放大/缩小/重置、拖动平移、Ctrl+滚轮缩放、键盘切换、全屏、章节目录、阅读进度 |

## 数据模型

```
SCHOOLS      学校   { id, name, en, short, qs, country, city, founded, color, intro }
DISCIPLINES  学科   { id, name, icon, color }
LEVELS       难度   { id, name, desc }
COURSES      课程   { id, school, discipline, code, title, en, instructor,
                     level, levelKey, tags, source, minutes, updated,
                     overview, takeaways, prereq, chapters[], deepLink? }
FIGURES      图解   { 课程id: [{ id, ch, title, type, caption, explain, data }] }
```

课程通过 `school` / `discipline` 字段关联学校与学科；图解通过 `ch` 字段归属章节，浏览时按章节顺序自动展平。

## 如何扩充内容

- **新增学校**：向 `js/catalog-data.js` 的 `SCHOOLS` 追加一条。
- **新增课程**：向 `COURSES` 追加一条课程（含 `chapters`），再向 `js/catalog-figures.js` 的 `FIGURES` 追加该课程的图解数组。
- **新增图解**：向对应课程的数组追加一条数据，选择一种 `type`（`concept-map` / `flow` / `compare` / `layers` / `hierarchy` / `timeline` / `cycle` / `matrix` / `plot` / `tree` / `scale` / `bars` / `venn` / `cards`），无需改任何代码。
- **新增图解类型**：在 `js/diagram-lib.js` 的 `RENDERERS` 中注册渲染函数。

统计数字、筛选选项、封面、目录均自动从数据生成，内容规模增长时结构保持清晰。

## 当前收录

- **10 所学校**（QS 2025 前十）：MIT、帝国理工、牛津、哈佛、剑桥、斯坦福、ETH、NUS、UCL、加州理工（后两所课程整理中，用于演示扩展）
- **14 门课程**、**84 张知识点图解**、**8 个学科方向**

## 免责声明

本站为公开课程内容的知识整理与可视化，版权归原学校及授课教师所有，仅用于学习交流；不构成任何投资或专业建议。

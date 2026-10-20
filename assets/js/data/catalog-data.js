/* ============================================================
 * 平台数据层：学科 / 学校 / 课程 / 章节
 * 文件：assets/js/data/catalog-data.js
 *
 * 数据模型（三级组织：学校 → 学科 → 课程）：
 *   DISCIPLINES  学科（分类维度）
 *   SCHOOLS      学校（QS 排名、国家、简介）
 *   COURSES      课程（归属 school + discipline，含章节）
 *   FIGURES      图解（见 catalog-figures.js，按课程 id 聚合）
 *
 * 扩充方式：新增学校只需向 SCHOOLS 追加一条；
 *           新增课程只需向 COURSES 追加一条 + FIGURES 追加图解。
 * ============================================================ */

/* ---------- 学科 ---------- */
const DISCIPLINES = [
  { id:"cs",         name:"计算机科学",   icon:"💻", color:"#60a5fa" },
  { id:"math",       name:"数学",         icon:"📐", color:"#a78bfa" },
  { id:"physics",    name:"物理",         icon:"⚛️", color:"#2dd4bf" },
  { id:"economics",  name:"经济与金融",   icon:"📈", color:"#fbbf24" },
  { id:"engineering",name:"工程",         icon:"⚙️", color:"#f5c451" },
  { id:"biology",    name:"生物与医学",   icon:"🧬", color:"#34d399" },
  { id:"psychology", name:"心理学",       icon:"🧠", color:"#fb923c" },
  { id:"philosophy", name:"哲学与人文",   icon:"🏛", color:"#f87171" }
];

/* ---------- 学校（QS 2025 世界大学排名） ---------- */
const SCHOOLS = [
  { id:"mit", name:"麻省理工学院", en:"Massachusetts Institute of Technology", short:"MIT",
    qs:1, country:"美国", city:"剑桥市", founded:1861, color:"#f5c451",
    intro:"以理工与科研立校的世界第一学府，OpenCourseWare（OCW）将数千门课程讲义、习题与考试题免费开放，是本平台绝大多数课程的源头。" },
  { id:"imperial", name:"帝国理工学院", en:"Imperial College London", short:"IC",
    qs:2, country:"英国", city:"伦敦", founded:1907, color:"#60a5fa",
    intro:"专注科学、工程、医学与商科的英国研究型重镇，以跨学科训练和产业联系著称。" },
  { id:"oxford", name:"牛津大学", en:"University of Oxford", short:"Oxford",
    qs:3, country:"英国", city:"牛津", founded:1096, color:"#a78bfa",
    intro:"英语世界最古老的大学，导师制（Tutorial）与人文社科传统深厚，哲学、PPE 与数学均为王牌。" },
  { id:"harvard", name:"哈佛大学", en:"Harvard University", short:"Harvard",
    qs:4, country:"美国", city:"剑桥市", founded:1636, color:"#f87171",
    intro:"美国历史最悠久的高等学府，CS50 是全球最受欢迎的编程入门课，积极心理学公开课影响千万人。" },
  { id:"cambridge", name:"剑桥大学", en:"University of Cambridge", short:"Cambridge",
    qs:5, country:"英国", city:"剑桥", founded:1209, color:"#34d399",
    intro:"与牛津齐名的英国双璧，自然科学 Tripos 体系以广度与深度并重闻名，牛顿、图灵曾在此求学。" },
  { id:"stanford", name:"斯坦福大学", en:"Stanford University", short:"Stanford",
    qs:6, country:"美国", city:"斯坦福", founded:1885, color:"#fb923c",
    intro:"硅谷的智力引擎，CS229 机器学习公开课是无数算法工程师的启蒙，创业文化浓厚。" },
  { id:"eth", name:"苏黎世联邦理工学院", en:"ETH Zürich", short:"ETH",
    qs:7, country:"瑞士", city:"苏黎世", founded:1855, color:"#2dd4bf",
    intro:"欧洲大陆理工科排名第一的高校，爱因斯坦的母校，以严谨的物理与数学训练著称。" },
  { id:"nus", name:"新加坡国立大学", en:"National University of Singapore", short:"NUS",
    qs:8, country:"新加坡", city:"新加坡", founded:1905, color:"#f472b6",
    intro:"亚洲排名第一的综合性大学，数据科学与计算机课程对全球学习者高度开放。" },
  { id:"ucl", name:"伦敦大学学院", en:"University College London", short:"UCL",
    qs:9, country:"英国", city:"伦敦", founded:1826, color:"#38bdf8",
    intro:"神经科学与心理学的学术重镇，UCL 神经科学公开课以严谨和可视化解剖图谱闻名。" },
  { id:"caltech", name:"加州理工学院", en:"California Institute of Technology", short:"Caltech",
    qs:10, country:"美国", city:"帕萨迪纳", founded:1891, color:"#fbbf24",
    intro:"规模精小而科研密度极高的理工院校，费曼《物理学讲义》源于此，是物理图解学习的圣地。" }
];

/* ---------- 难度 ---------- */
const LEVELS = [
  { id:"beginner",     name:"入门", desc:"无需先修基础" },
  { id:"intermediate", name:"进阶", desc:"需要一门基础课" },
  { id:"advanced",     name:"高阶", desc:"需要数学/编程基础" }
];

/* ---------- 课程 ---------- */
const COURSES = [
{
  id:"mit-6-0001", school:"mit", discipline:"cs", code:"6.0001",
  title:"计算机科学导论与 Python 编程",
  en:"Introduction to Computer Science and Programming in Python",
  instructor:"Ana Bell · Eric Grimson · John Guttag",
  level:"入门", levelKey:"beginner", featured:true,
  tags:["Python","计算思维","算法","编程入门"],
  source:"MIT OpenCourseWare",
  minutes:150, updated:"2026-08",
  overview:"MIT 最受欢迎的编程入门课。课程不教你某一种语言的语法细节，而是教你「像计算机科学家一样思考」：把现实问题抽象为计算问题，用算法描述解法，再用代码实现并验证。Python 只是表达思想的工具。",
  takeaways:[
    "理解计算机的本质：一台可编程的信息变换机器",
    "掌握计算思维四支柱：分解、模式识别、抽象、算法",
    "建立对算法复杂度与程序结构的直觉",
    "形成「编写 → 运行 → 调试」的工程习惯"
  ],
  prereq:"无需编程基础",
  audience:"适合已接触过任意一门编程语言、想系统补齐「计算思维」框架的学习者；零基础也可顺畅阅读。",
  deepPath:[
    { level:"L1", label:"概念", desc:"计算的五个角色与抽象阶梯：先建立整机视野" },
    { level:"L2", label:"机制", desc:"程序结构、函数与模块的组织方式" },
    { level:"L3", label:"关系与定量", desc:"复杂度量级与调试循环的成本结构" },
    { level:"L4", label:"系统与前沿", desc:"从「会写代码」到像计算机科学家一样拆解问题" }
  ],
  chapters:[
    { id:"c1", title:"计算的本质", summary:"从信息变换的角度理解计算机：输入、处理、输出与存储。" },
    { id:"c2", title:"计算思维", summary:"把大问题变小、把重复变模式、把细节变抽象的思维框架。" },
    { id:"c3", title:"程序的结构", summary:"语句、函数、模块——代码如何组织成可维护的程序。" },
    { id:"c4", title:"算法与调试", summary:"算法的效率量级，以及让程序变正确的科学方法。" }
  ]
},
{
  id:"mit-18-06", school:"mit", discipline:"math", code:"18.06",
  title:"线性代数",
  en:"Linear Algebra",
  instructor:"Gilbert Strang",
  level:"入门", levelKey:"beginner", featured:true,
  tags:["矩阵","向量空间","特征值","SVD"],
  source:"MIT OpenCourseWare",
  minutes:160, updated:"2026-07",
  overview:"Gilbert Strang 教授的线性代数被全球数百万人学习。课程的核心洞见是：矩阵不是数字表格，而是「空间的变换」。理解了这一点，解方程、降维、数据压缩都会变成几何直觉。",
  takeaways:[
    "用「列空间的视角」重新理解矩阵乘法与 Ax=b",
    "掌握四大基本子空间及其正交关系",
    "理解特征值/特征向量与五大矩阵分解",
    "看到 SVD 如何统一压缩、降维与推荐系统"
  ],
  prereq:"高中数学 + 愿意画图思考",
  audience:"适合学过矩阵运算但未建立几何直觉的学习者——本合集把 Strang 的「列空间视角」补全。",
  deepPath:[
    { level:"L1", label:"概念", desc:"矩阵即变换：把数字表格读成空间动作" },
    { level:"L2", label:"机制", desc:"四大基本子空间与投影正交的工作方式" },
    { level:"L3", label:"关系与定量", desc:"五大矩阵分解各自的适用条件与精度" },
    { level:"L4", label:"系统与前沿", desc:"SVD 如何统一压缩、降维与推荐系统" }
  ],
  chapters:[
    { id:"c1", title:"矩阵即变换", summary:"向量、线性组合与矩阵乘法的几何意义。" },
    { id:"c2", title:"四大子空间", summary:"列空间、零空间、行空间、左零空间。" },
    { id:"c3", title:"五大分解", summary:"LU、QR、特征分解、SVD、Cholesky 的用途地图。" }
  ]
},
{
  id:"mit-8-01", school:"mit", discipline:"physics", code:"8.01",
  title:"经典力学",
  en:"Classical Mechanics",
  instructor:"Walter Lewin 等",
  level:"入门", levelKey:"beginner",
  tags:["牛顿定律","能量","动量","振动"],
  source:"MIT OpenCourseWare",
  minutes:140, updated:"2026-06",
  overview:"从苹果落地到行星轨道，经典力学用寥寥数条定律统一了天上与地下的运动。课程强调物理直觉：先画图、再找守恒量、最后才动笔算。",
  takeaways:[
    "用牛顿三定律分析任意质点的运动",
    "掌握功—能定理与机械能守恒",
    "用动量守恒处理碰撞与爆炸问题",
    "理解简谐运动如何统一弹簧、单摆与轨道"
  ],
  prereq:"高中数学 + 基础微积分",
  audience:"适合高中物理过一遍、希望把牛顿力学串成「守恒量优先」分析框架的学习者。",
  deepPath:[
    { level:"L1", label:"概念", desc:"描述运动的语言：位移、速度、加速度" },
    { level:"L2", label:"机制", desc:"牛顿三定律与简谐运动的统一图景" },
    { level:"L3", label:"关系与定量", desc:"功—能定理与动量守恒的互换与选择" },
    { level:"L4", label:"系统与前沿", desc:"用守恒量预判复杂系统的演化方向" }
  ],
  chapters:[
    { id:"c1", title:"运动与力", summary:"描述运动的语言与牛顿三定律。" },
    { id:"c2", title:"能量", summary:"功、动能、势能与守恒律。" },
    { id:"c3", title:"动量与振动", summary:"碰撞中的动量守恒，以及无处不在的简谐运动。" }
  ]
},
{
  id:"mit-14-01", school:"mit", discipline:"economics", code:"14.01",
  title:"微观经济学原理",
  en:"Principles of Microeconomics",
  instructor:"Jonathan Gruber",
  level:"入门", levelKey:"beginner",
  tags:["供给需求","弹性","市场结构","福利"],
  source:"MIT OpenCourseWare",
  minutes:130, updated:"2026-05",
  overview:"一门课建立「经济学家视角」：激励如何改变行为、价格如何协调千万人的决策、市场何时有效何时失灵。供需曲线是理解整个课程的两把钥匙。",
  takeaways:[
    "用供需模型解释价格与数量的决定",
    "用弹性预判价格变化的连锁反应",
    "区分完全竞争、垄断与寡头的市场行为",
    "用消费者/生产者剩余衡量市场福利"
  ],
  prereq:"无",
  audience:"适合看过供需曲线但说不清「为什么」的学习者——本合集补齐曲线背后的激励逻辑。",
  deepPath:[
    { level:"L1", label:"概念", desc:"供需语言：把激励翻译成曲线" },
    { level:"L2", label:"机制", desc:"价格机制如何协调分散决策" },
    { level:"L3", label:"关系与定量", desc:"弹性传导、税收归宿与福利的面积度量" },
    { level:"L4", label:"系统与前沿", desc:"市场失灵与政策设计的边界" }
  ],
  chapters:[
    { id:"c1", title:"供需语言", summary:"需求曲线、供给曲线与市场均衡。" },
    { id:"c2", title:"弹性与政策", summary:"价格弹性、税收归宿与价格管制。" },
    { id:"c3", title:"市场结构", summary:"从完全竞争到垄断的效率比较。" }
  ]
},
{
  id:"mit-15-401", school:"mit", discipline:"economics", code:"15.401",
  title:"金融理论 I",
  en:"Finance Theory I",
  instructor:"Andrew Lo",
  level:"进阶", levelKey:"intermediate", featured:true,
  tags:["现值","债券","组合","期权"],
  source:"MIT OpenCourseWare",
  minutes:85, updated:"2026-10",
  lab:"finance",
  overview:"MIT 斯隆王牌金融课，「Mathematics + $$ = Finance」是它的注脚。课程主线：现值关系 → 固定收益 → 股权 → 投资组合 → 期权定价。在此之上，本课程还配有「投资认知框架」七大模块与实战实验室（复利引擎、凯利公式计算器、认知自检、行动清单），把估值数学延伸为一套可操作的科学决策框架。",
  takeaways:[
    "用现值（PV）统一比较不同时点的现金流",
    "理解债券定价与利率期限结构",
    "掌握风险—收益权衡与分散化数学",
    "初识期权定价的复制与对冲思想",
    "用七大认知模块建立「投资 ≠ 赌博」的科学决策框架",
    "在实战实验室中亲手验证复利与凯利公式"
  ],
  prereq:"概率论基础",
  audience:"适合学过基础概率、希望把「现值」变成直觉的学习者；期权部分只需定性理解。课程附实战实验室与认知自检，可直接上手验证。",
  deepPath:[
    { level:"L1", label:"概念", desc:"货币的时间价值：一切资产的共同尺度" },
    { level:"L2", label:"机制", desc:"贴现因子、收益率曲线与利率的传导" },
    { level:"L3", label:"关系与定量", desc:"风险—收益象限、凯利仓位与期权非线性的结构" },
    { level:"L4", label:"系统与前沿", desc:"复制与对冲的无套利思想，以及行为纪律的系统视角" }
  ],
  chapters:[
    { id:"c1", title:"现值关系", summary:"贴现、复利与利率的时间价值。" },
    { id:"c2", title:"固定收益与股权", summary:"债券定价与股权估值框架。" },
    { id:"c3", title:"组合与期权", summary:"分散化的数学与期权定价直觉。" },
    { id:"c4", title:"投资认知框架", summary:"七大认知模块：从认知觉醒到行为纪律的完整投资思维。" },
    { id:"c5", title:"实战与延伸", summary:"行动清单、延伸学习与交互实验室入口。" }
  ]
},
{
  id:"stanford-cs229", school:"stanford", discipline:"cs", code:"CS229",
  title:"机器学习",
  en:"Machine Learning",
  instructor:"Andrew Ng · Tengyu Ma",
  level:"高阶", levelKey:"advanced", featured:true,
  tags:["监督学习","梯度下降","正则化","泛化"],
  source:"Stanford Online / CS229 公开课",
  minutes:180, updated:"2026-09",
  overview:"无数算法工程师的启蒙课。课程用统一的数学语言串起所有模型：定义模型 → 定义损失 → 优化求解 → 评估泛化。学完后你看到的不是一堆算法，而是一张方法论地图。",
  takeaways:[
    "掌握「模型—损失—优化」三件套框架",
    "理解线性/逻辑回归与梯度下降的推导",
    "诊断过拟合并正确使用正则化",
    "用偏差—方差与交叉验证评估泛化能力"
  ],
  prereq:"线性代数 + 概率统计 + 编程",
  audience:"适合跑过 sklearn 但未亲手推导过模型的学习者——本合集重建「模型—损失—优化」框架。",
  deepPath:[
    { level:"L1", label:"概念", desc:"学习范式地图：监督 / 无监督 / 强化" },
    { level:"L2", label:"机制", desc:"监督学习流水线与梯度下降的工作方式" },
    { level:"L3", label:"关系与定量", desc:"过拟合诊断与偏差—方差权衡的度量" },
    { level:"L4", label:"系统与前沿", desc:"正则化作为归纳偏置的主动设计" }
  ],
  chapters:[
    { id:"c1", title:"学习范式全景", summary:"监督、无监督与强化学习的地图。" },
    { id:"c2", title:"监督学习流水线", summary:"从数据到模型的六个环节。" },
    { id:"c3", title:"优化与泛化", summary:"梯度下降的工作方式与过拟合的诊断。" }
  ]
},
{
  id:"stanford-cs101", school:"stanford", discipline:"cs", code:"CS101",
  title:"计算机科学导论",
  en:"Computer Science 101",
  instructor:"Nick Parlante",
  level:"入门", levelKey:"beginner",
  tags:["二进制","算法","数据结构","计算机系统"],
  source:"Stanford Online",
  minutes:120, updated:"2026-04",
  overview:"为零基础设计的大师课：从「一个比特如何表示世界」讲到排序、查找与内存。课程节奏轻快，图示极佳，是理解计算机系统全貌的最佳入口之一。",
  takeaways:[
    "理解二进制如何编码数字、文本与图像",
    "直观掌握常见排序算法的差异",
    "建立数组、链表、哈希表的结构直觉",
    "了解 CPU、内存与程序的协作方式"
  ],
  prereq:"无",
  audience:"适合会用电脑但不了解内部原理的学习者；学过编程者可将本合集当作系统观补全。",
  deepPath:[
    { level:"L1", label:"概念", desc:"比特如何编码数字、文本与图像" },
    { level:"L2", label:"机制", desc:"排序与搜索两类基本算法的差异" },
    { level:"L3", label:"关系与定量", desc:"数据结构与内存层次的代价地图" },
    { level:"L4", label:"系统与前沿", desc:"CPU、内存与程序的协作全景" }
  ],
  chapters:[
    { id:"c1", title:"比特的世界", summary:"二进制、编码与信息的度量。" },
    { id:"c2", title:"算法入门", summary:"搜索、排序与复杂度直觉。" },
    { id:"c3", title:"数据与系统", summary:"数据结构全景与计算机硬件协作。" }
  ]
},
{
  id:"harvard-cs50", school:"harvard", discipline:"cs", code:"CS50",
  title:"计算机科学导论 CS50",
  en:"CS50: Introduction to Computer Science",
  instructor:"David J. Malan",
  level:"入门", levelKey:"beginner", featured:true,
  tags:["C","Python","SQL","Web","算法"],
  source:"Harvard OpenCourseWare / edX",
  minutes:170, updated:"2026-09",
  overview:"全球最受欢迎的编程入门课，以电影级的制作水准讲解计算机科学全景。课程语言横跨 C、Python 与 SQL，最终落到 Web 应用，让学习者在「造东西」中掌握全部核心概念。",
  takeaways:[
    "用 C 语言理解内存、指针与底层工作原理",
    "掌握从 Scratch 到 Python 的抽象阶梯",
    "学会用 SQL 查询关系型数据库",
    "独立完成一个完整的 Web 项目"
  ],
  prereq:"无",
  audience:"适合完成过一门入门课、想横跨 C/Python/SQL/Web 建立完整系统观的学习者。",
  deepPath:[
    { level:"L1", label:"概念", desc:"从 Scratch 到 C 的抽象阶梯" },
    { level:"L2", label:"机制", desc:"内存布局与数据结构的时间代价" },
    { level:"L3", label:"关系与定量", desc:"哈希、查询与网络协议的工作方式" },
    { level:"L4", label:"系统与前沿", desc:"独立完成一个完整的 Web 项目" }
  ],
  chapters:[
    { id:"c1", title:"从 Scratch 到 C", summary:"计算思维与底层内存模型。" },
    { id:"c2", title:"数据结构", summary:"数组、链表、树、哈希表与它们的代价。" },
    { id:"c3", title:"Python 与 Web", summary:"高级语言、数据库与互联网工作原理。" }
  ]
},
{
  id:"harvard-psy1504", school:"harvard", discipline:"psychology", code:"Psychology 1504",
  title:"积极心理学",
  en:"Positive Psychology",
  instructor:"Tal Ben-Shahar",
  level:"入门", levelKey:"beginner", featured:true,
  tags:["幸福感","优势","心流","人际关系"],
  source:"Harvard 公开课",
  minutes:110, updated:"2026-03",
  overview:"「这堂课教你们如何幸福」——它把心理学从「修复疾病」转向「建设繁荣」。课程基于实证研究，给出可操作的幸福框架：意义、快乐、投入与关系的平衡。",
  takeaways:[
    "理解幸福的可塑性与基准线理论",
    "识别并运用个人核心优势",
    "进入心流状态的条件与设计",
    "用「健康 perfectionism」替代病态苛求"
  ],
  prereq:"无",
  audience:"适合读过零散心理学科普、希望用实证框架整理幸福认知的学习者。",
  deepPath:[
    { level:"L1", label:"概念", desc:"积极心理学的五个前提与幸福基准线" },
    { level:"L2", label:"机制", desc:"心流通道与性格优势的运用条件" },
    { level:"L3", label:"关系与定量", desc:"基准线理论与完美主义光谱的位置" },
    { level:"L4", label:"系统与前沿", desc:"关系与意义的长期建设路径" }
  ],
  chapters:[
    { id:"c1", title:"幸福是什么", summary:"积极心理学的五个前提与幸福基准线。" },
    { id:"c2", title:"优势与心流", summary:"VIA 性格优势与心流通道。" },
    { id:"c3", title:"关系与意义", summary:"感恩、宽恕与自我和谐的追求。" }
  ]
},
{
  id:"oxford-philosophy", school:"oxford", discipline:"philosophy", code:"Philosophy 导论",
  title:"哲学导论：从柏拉图到现代",
  en:"Introduction to Philosophy",
  instructor:"牛津哲学系公开讲座整理",
  level:"入门", levelKey:"beginner",
  tags:["知识论","伦理学","形而上学","论证"],
  source:"牛津大学公开讲座整理",
  minutes:120, updated:"2026-02",
  overview:"哲学从苏格拉底的「未经省察的人生不值得过」开始，教人用论证代替意见。合集沿三条主线展开：我们能知道什么（知识论）、我们应当如何行动（伦理学）、世界是什么（形而上学）。",
  takeaways:[
    "识别并评估哲学论证的结构",
    "理解柏拉图的理念论与亚里士多德的德性论",
    "掌握知识论中「确证」的核心问题",
    "建立伦理学三大流派的判断框架"
  ],
  prereq:"无",
  audience:"适合能读懂论证但缺少形式训练的学习者；本合集把哲学史还原为「论证结构」练习。",
  deepPath:[
    { level:"L1", label:"概念", desc:"前提—结论—有效性的逻辑骨架" },
    { level:"L2", label:"机制", desc:"知识论中「确证」的核心问题" },
    { level:"L3", label:"关系与定量", desc:"三大伦理流派各自的判断框架" },
    { level:"L4", label:"系统与前沿", desc:"从意见到论证的思维习惯转换" }
  ],
  chapters:[
    { id:"c1", title:"论证的艺术", summary:"前提、结论与有效性的逻辑基础。" },
    { id:"c2", title:"知识论", summary:"什么是知识：确证的真信念及其挑战。" },
    { id:"c3", title:"伦理学", summary:"后果论、义务论与德性论的地图。" }
  ]
},
{
  id:"cambridge-math", school:"cambridge", discipline:"math", code:"自然科学 Tripos 数学",
  title:"数学的三大支柱：代数、分析与几何",
  en:"The Three Pillars of Mathematics",
  instructor:"剑桥数学系公开课程整理",
  level:"入门", levelKey:"beginner",
  tags:["代数","分析","几何","统一性"],
  source:"剑桥大学公开课程整理",
  minutes:130, updated:"2026-01",
  overview:"剑桥自然科学 Tripos 以广度著称：先用一年建立代数、分析与几何三大支柱，再谈应用。本合集按同一思路，展示三大分支如何从不同侧面描述同一个数学实在。",
  takeaways:[
    "理解代数研究「结构」、分析研究「变化」、几何研究「形状」",
    "看到向量、群与线性空间作为统一语言",
    "掌握极限思想如何架起离散与连续的桥梁",
    "体会不同数学语言描述同一对象的等价性"
  ],
  prereq:"高中数学",
  audience:"适合分科学过代数、几何但未见其统一性的学习者；本合集展示三大分支的共通语言。",
  deepPath:[
    { level:"L1", label:"概念", desc:"三大分支各自的问题意识地图" },
    { level:"L2", label:"机制", desc:"向量与线性空间作为统一语言" },
    { level:"L3", label:"关系与定量", desc:"极限思想架起离散与连续之桥" },
    { level:"L4", label:"系统与前沿", desc:"不同数学语言描述同一对象的等价性" }
  ],
  chapters:[
    { id:"c1", title:"三大分支地图", summary:"代数、分析、几何各自的问题意识。" },
    { id:"c2", title:"统一语言", summary:"向量与线性空间如何沟通三大分支。" },
    { id:"c3", title:"极限之桥", summary:"从离散到连续的分析思想。" }
  ]
},
{
  id:"imperial-design", school:"imperial", discipline:"engineering", code:"工程设计导论",
  title:"工程设计思维：从需求到原型",
  en:"Engineering Design Thinking",
  instructor:"帝国理工工程系公开课程整理",
  level:"入门", levelKey:"beginner",
  tags:["设计思维","系统","原型","迭代"],
  source:"帝国理工公开课程整理",
  minutes:100, updated:"2026-04",
  overview:"工程设计不是「把零件拼起来」，而是在约束下做权衡的艺术。合集沿「需求 → 概念 → 原型 → 测试 → 迭代」的设计循环，讲解工程师如何把模糊问题变成可运行的方案。",
  takeaways:[
    "把用户需求转译为可验证的工程指标",
    "用功能分解与系统边界组织复杂设计",
    "理解原型在降低风险中的核心作用",
    "建立「失败—学习—再设计」的迭代心智"
  ],
  prereq:"无",
  audience:"适合做过课程项目但缺少方法论的学习者；本合集把设计经验整理为可复用循环。",
  deepPath:[
    { level:"L1", label:"概念", desc:"设计循环五步：需求到迭代" },
    { level:"L2", label:"机制", desc:"需求转译与系统边界分解" },
    { level:"L3", label:"关系与定量", desc:"权衡矩阵与原型风险排序" },
    { level:"L4", label:"系统与前沿", desc:"「失败—学习—再设计」的迭代心智" }
  ],
  chapters:[
    { id:"c1", title:"设计循环", summary:"工程设计的五步闭环与迭代本质。" },
    { id:"c2", title:"需求与系统", summary:"从用户故事到系统分解的方法。" },
    { id:"c3", title:"原型与权衡", summary:"快速原型与工程决策中的权衡矩阵。" }
  ]
},
{
  id:"eth-quantum", school:"eth", discipline:"physics", code:"量子力学导论",
  title:"量子力学导论",
  en:"Introduction to Quantum Mechanics",
  instructor:"ETH 物理系公开课程整理",
  level:"高阶", levelKey:"advanced", featured:true,
  tags:["波函数","叠加态","不确定性","自旋"],
  source:"ETH Zürich 公开课程整理",
  minutes:150, updated:"2026-09",
  overview:"量子力学是二十世纪最反直觉也最成功的物理理论。合集从「光是波还是粒子」的历史悖论出发，建立波函数语言，理解叠加、测量与不确定性，并窥见量子如何成为现代技术的基石。",
  takeaways:[
    "理解波粒二象性与双缝实验的深层含义",
    "掌握波函数、概率幅与测量公设",
    "理解不确定性原理的物理根源",
    "初识自旋、纠缠与量子技术前景"
  ],
  prereq:"微积分 + 基础物理",
  audience:"适合科普层面了解量子、希望理解波函数语言的学习者；数学推导以定性为主。",
  deepPath:[
    { level:"L1", label:"概念", desc:"从经典物理的危机到波粒二象性" },
    { level:"L2", label:"机制", desc:"波函数、概率幅与测量公设" },
    { level:"L3", label:"关系与定量", desc:"不确定性原理的物理根源" },
    { level:"L4", label:"系统与前沿", desc:"自旋、纠缠与量子技术前景" }
  ],
  chapters:[
    { id:"c1", title:"波粒二象性", summary:"从经典物理的危机到量子假设。" },
    { id:"c2", title:"波函数与测量", summary:"概率幅语言与测量的坍缩公设。" },
    { id:"c3", title:"不确定性及应用", summary:"不确定性原理、自旋与量子技术。" }
  ]
},
{
  id:"nus-ds", school:"nus", discipline:"cs", code:"数据科学导论",
  title:"数据科学导论",
  en:"Introduction to Data Science",
  instructor:"NUS 计算学院公开课程整理",
  level:"入门", levelKey:"beginner",
  tags:["数据分析","统计","可视化","Python"],
  source:"NUS 公开课程整理",
  minutes:120, updated:"2026-06",
  overview:"数据科学是统计、编程与领域知识的交叉点。合集按「提问 → 获取 → 清洗 → 探索 → 建模 → 沟通」的数据分析流程组织，强调用图表讲数据故事的能力。",
  takeaways:[
    "区分描述性、诊断性、预测性与规范性分析",
    "用均值/方差等统计量建立数据直觉",
    "掌握常见可视化图表的选择原则",
    "完成一次完整的端到端数据分析"
  ],
  prereq:"无",
  audience:"适合会 pandas 但缺少分析流程观的学习者；本合集补齐「提问—沟通」两端的闭环。",
  deepPath:[
    { level:"L1", label:"概念", desc:"分析流程与四种分析类型" },
    { level:"L2", label:"机制", desc:"统计三特征与分布形状的读法" },
    { level:"L3", label:"关系与定量", desc:"图表选择矩阵与数据讲故事" },
    { level:"L4", label:"系统与前沿", desc:"完成端到端的数据分析闭环" }
  ],
  chapters:[
    { id:"c1", title:"数据科学生态", summary:"数据科学的定位与分析流程。" },
    { id:"c2", title:"统计直觉", summary:"集中趋势、离散程度与分布形状。" },
    { id:"c3", title:"可视化沟通", summary:"图表选择原则与数据讲故事。" }
  ]
}
];

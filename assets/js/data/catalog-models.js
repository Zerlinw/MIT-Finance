/* ============================================================
 * 3D 模型数据层：每门课程一个「核心心智模型」场景（仅模型，无视频）
 * 文件：assets/js/data/catalog-models.js
 *
 * 结构：MODELS = { 课程id: Scene }
 * Scene 字段：
 *   title    场景标题
 *   hint     操作提示（可选）
 *   camera   初始机位 { yaw, pitch, dist }
 *   parts    部件数组（原语拼装，见 scene3d-lib.js 支持的类型）
 *   marks    3D 锚点 [{ id, at:[x,y,z], title, body, depth? }]
 *
 * 部件字段：{ id, type, pos:[x,y,z], rot:[rx,ry,rz], size:[...],
 *             color, opacity?, label? }
 * 坐标系：y 轴向上，地面为 y=0 的 XZ 平面。
 *
 * 图解通过 catalog-figures.js 的 detail.model / detail.view /
 * detail.focus 关联到本注册表：view 指定机位，focus 指定高亮部件。
 * ============================================================ */

const MODELS = {

/* ================= MIT 6.0001 计算机科学导论与 Python ================= */
"mit-6-0001": {
  title:"计算系统的层级栈",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.72, pitch:0.42, dist:9.5 },
  parts:[
    { id:"part-app",  type:"box", pos:[0,2.75,0],   size:[3.4,0.62,2.2], color:"#60a5fa", label:"应用软件 App" },
    { id:"part-lang", type:"box", pos:[0,2.02,0],   size:[3.0,0.62,2.0], color:"#2dd4bf", label:"高级语言 Python" },
    { id:"part-os",   type:"box", pos:[0,1.29,0],   size:[2.6,0.62,1.8], color:"#f5c451", label:"操作系统 OS" },
    { id:"part-hw",   type:"box", pos:[0,0.52,0],   size:[3.9,0.55,2.7], color:"#f472b6", label:"硬件 CPU · 内存" },
    { id:"part-in",   type:"box", pos:[-2.85,1.29,0], size:[0.55,0.55,1.3], color:"#34d399", label:"输入" },
    { id:"part-out",  type:"box", pos:[2.85,1.29,0],  size:[0.55,0.55,1.3], color:"#34d399", label:"输出" },
    { id:"part-flow", type:"arc", pos:[-2.85,1.62,0], to:[2.85,1.62,0], height:0.9, color:"#f5c451", width:2 },
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,5], n:8, color:"#223050" }
  ],
  marks:[
    { id:"m1", at:[0,2.75,0], title:"应用软件", body:"你最常接触的一层：把真实需求变成可执行的任务，但不关心底层如何实现。", depth:"L1" },
    { id:"m2", at:[0,2.02,0], title:"高级语言", body:"Python 把内存管理、类型检查等细节封装起来，用可读的语句表达算法，代价是运行速度。", depth:"L2" },
    { id:"m3", at:[0,1.29,0], title:"操作系统", body:"调度 CPU 时间、管理文件与驱动，是多道程序共享硬件的「资源大管家」。", depth:"L2" },
    { id:"m4", at:[0,0.52,0], title:"硬件层", body:"数十亿晶体管按布尔逻辑开关，构成全部计算的物理基底——上层每封装一次，就离它更远一步。", depth:"L3" }
  ]
},

/* ================= MIT 18.06 线性代数 ================= */
"mit-18-06": {
  title:"矩阵即空间变换",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.65, pitch:0.32, dist:8.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[8,8], n:8, color:"#223050" },
    { id:"part-ax",   type:"line", pos:[0,0,0], to:[3.4,0,0], color:"#f5c451", width:2.4 },
    { id:"part-ay",   type:"line", pos:[0,0,0], to:[0,3.4,0], color:"#2dd4bf", width:2.4 },
    { id:"part-az",   type:"line", pos:[0,0,0], to:[0,0,3.4], color:"#60a5fa", width:2.4 },
    { id:"part-vec-i", type:"sphere", pos:[3.4,0,0], size:[0.2], color:"#f5c451", label:"基向量 i" },
    { id:"part-vec-j", type:"sphere", pos:[0,3.4,0], size:[0.2], color:"#2dd4bf", label:"基向量 j" },
    { id:"part-plane", type:"plane", pos:[1.5,1.7,0.4], size:[3.2,3.2], rot:[0,0.55,0.3], color:"#60a5fa", opacity:0.4, label:"变换后的空间" },
    { id:"part-matrix", type:"box", pos:[0,3.9,0], size:[1.5,1.1,0.25], color:"#f5c451", opacity:0.9, label:"矩阵 A" }
  ],
  marks:[
    { id:"m1", at:[3.4,0,0], title:"基向量", body:"矩阵的每一列就是一个基向量被变换后的位置——矩阵的全部信息都写在这两列里。", depth:"L1" },
    { id:"m2", at:[1.5,1.7,0.4], title:"空间的变换", body:"平面被剪切、旋转、缩放：矩阵不是数字表格，而是一台把每个向量搬到新位置的「变换机器」。", depth:"L2" },
    { id:"m3", at:[0,3.9,0], title:"矩阵 A", body:"乘法 AB 就是「先 B 后 A」的变换复合；解 Ax=b 等价于寻找把 b 变回 x 的逆变换。", depth:"L3" }
  ]
},

/* ================= MIT 8.01 经典力学 ================= */
"mit-8-01": {
  title:"斜面 · 抛体 · 能量守恒",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.52, pitch:0.4, dist:10.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[10,6], n:8, color:"#223050" },
    { id:"part-slope", type:"box", pos:[1.1,0.35,0], size:[6.2,0.16,2.6], rot:[0,0,0.34], color:"#8b98ad", opacity:0.55, label:"斜面" },
    { id:"part-ball", type:"sphere", pos:[1.6,1.15,0], size:[0.32], color:"#f5c451", label:"小球" },
    { id:"part-arc", type:"arc", pos:[3.4,0.05,0], to:[5.6,0.05,0], height:1.7, color:"#2dd4bf", width:2.4 },
    { id:"part-ep", type:"box", pos:[-3.3,1.1,0],  size:[0.55,2.2,0.55], color:"#f472b6", label:"势能" },
    { id:"part-ek", type:"box", pos:[-2.35,0.7,0], size:[0.55,1.4,0.55], color:"#f5c451", label:"动能" },
    { id:"part-em", type:"box", pos:[-1.4,1.05,0], size:[0.55,2.1,0.55], color:"#2dd4bf", label:"机械能" }
  ],
  marks:[
    { id:"m1", at:[1.6,1.15,0], title:"受力分解", body:"重力沿斜面的分量 mg·sinθ 提供加速度——把力沿运动方向分解，是牛顿定律的第一步。", depth:"L2" },
    { id:"m2", at:[4.5,1.1,0], title:"抛体运动", body:"水平匀速、竖直匀加速，两条直线运动叠加成抛物线——运动的独立性原理。", depth:"L2" },
    { id:"m3", at:[-2.35,1.4,0], title:"能量守恒", body:"势能与动能此消彼长，总和不变：守恒量让「算不动的题」变成「看能量就行」。", depth:"L3" }
  ]
},

/* ================= MIT 14.01 微观经济学原理 ================= */
"mit-14-01": {
  title:"供需曲面与市场均衡",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.62, pitch:0.26, dist:9.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,6], n:8, color:"#223050" },
    { id:"part-pp", type:"line", pos:[0,0,0], to:[0,4.2,0], color:"#f5c451", width:2.4 },
    { id:"part-pq", type:"line", pos:[0,0,0], to:[4.4,0,0], color:"#2dd4bf", width:2.4 },
    { id:"part-d", type:"plane", pos:[1.7,1.7,0], size:[3.6,3.2], rot:[1.5708,0,-0.5], color:"#60a5fa", opacity:0.42, label:"需求 D" },
    { id:"part-s", type:"plane", pos:[1.7,1.7,0], size:[3.6,3.2], rot:[1.5708,0,0.5],  color:"#f87171", opacity:0.42, label:"供给 S" },
    { id:"part-eq", type:"sphere", pos:[1.7,1.7,0], size:[0.26], color:"#f5c451", label:"均衡 E" }
  ],
  marks:[
    { id:"m1", at:[0.4,2.6,0], title:"需求定律", body:"价格越高需求量越低——需求曲线向下倾斜，刻画的是边际效用递减下的人的权衡。", depth:"L1" },
    { id:"m2", at:[3.0,2.6,0], title:"供给曲线", body:"价格越高供给量越多——向上倾斜反映边际成本递增：多生产一件，代价越来越大。", depth:"L1" },
    { id:"m3", at:[1.7,1.7,0], title:"市场均衡", body:"两条曲线的交点即均衡价与均衡量：价格机制像一只「看不见的手」协调千万人的分散决策。", depth:"L2" }
  ]
},

/* ================= MIT 15.401 金融理论 I ================= */
"mit-15-401": {
  title:"货币的时间价值",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.55, pitch:0.36, dist:10 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,5], n:8, color:"#223050" },
    { id:"part-tt", type:"line", pos:[0,0,0], to:[5.2,0,0], color:"#2dd4bf", width:2.4 },
    { id:"part-pv", type:"box", pos:[0,0.35,0], size:[0.6,0.7,0.6], color:"#60a5fa", label:"现值 PV" },
    { id:"part-c1", type:"box", pos:[1.2,0.5,0],  size:[0.55,1.0,0.55], color:"#2dd4bf", label:"t₁" },
    { id:"part-c2", type:"box", pos:[2.3,0.68,0], size:[0.55,1.36,0.55], color:"#34d399", label:"t₂" },
    { id:"part-c3", type:"box", pos:[3.4,0.9,0],  size:[0.55,1.8,0.55], color:"#f5c451", label:"t₃" },
    { id:"part-c4", type:"box", pos:[4.5,1.15,0], size:[0.55,2.3,0.55], color:"#fb923c", label:"t₄" },
    { id:"part-fv", type:"box", pos:[4.5,2.7,0], size:[0.6,0.7,0.6], color:"#f5c451", label:"终值 FV" },
    { id:"part-arc", type:"arc", pos:[0,0.7,0], to:[4.5,2.3,0], height:0.6, color:"#f5c451", width:2 }
  ],
  marks:[
    { id:"m1", at:[0,0.7,0], title:"现值 PV", body:"未来的一块钱不等于今天的一块钱：贴现率把不同时点的现金流拉到同一尺度上比较。", depth:"L1" },
    { id:"m2", at:[2.3,1.36,0], title:"复利增长", body:"利息再生息，终值呈指数增长——「时间 + 利率」是金融里最强大的两个变量。", depth:"L2" },
    { id:"m3", at:[4.5,2.7,0], title:"终值 FV", body:"所有现金流的现值之和即为资产价格：债券、股票、项目的估值都遵循同一条现值关系。", depth:"L3" }
  ]
},

/* ================= Stanford CS229 机器学习 ================= */
"stanford-cs229": {
  title:"损失曲面与梯度下降",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.62, pitch:0.46, dist:8.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[8,8], n:8, color:"#223050" },
    { id:"part-bowl", type:"bowl", pos:[0,0,0], size:[2.7,1.5], color:"#f5c451", opacity:0.5 },
    { id:"part-ball", type:"sphere", pos:[0.75,0.16,0.4], size:[0.2], color:"#2dd4bf", label:"当前参数 θ" },
    { id:"part-path", type:"arc", pos:[1.7,0.6,1.2], to:[0,0.05,0], height:-0.55, color:"#2dd4bf", width:2.4 },
    { id:"part-start", type:"sphere", pos:[1.7,0.62,1.2], size:[0.14], color:"#f472b6", label:"随机初始化" }
  ],
  marks:[
    { id:"m1", at:[0,1.5,0], title:"损失函数", body:"碗状曲面度量模型误差：训练学习算法，就是在参数空间里找这个碗的最低点。", depth:"L2" },
    { id:"m2", at:[0.75,0.16,0.4], title:"梯度下降", body:"沿负梯度方向一步步下滑：步长太大跨过谷底，太小则收敛缓慢——学习率是第一个要调的超参。", depth:"L2" },
    { id:"m3", at:[1.7,0.62,1.2], title:"优化轨迹", body:"从随机初始化出发，每一步都由损失对参数的偏导决定：所有监督学习共享这同一条下山路径。", depth:"L3" }
  ]
},

/* ================= Stanford CS101 计算机科学导论 ================= */
"stanford-cs101": {
  title:"比特的层级阶梯",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.6, pitch:0.4, dist:9.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,5], n:8, color:"#223050" },
    { id:"part-b1", type:"box", pos:[-1.8,0.32,0], size:[1.3,0.64,1.3], color:"#f472b6", label:"比特 Bit" },
    { id:"part-b2", type:"box", pos:[-0.9,0.96,0], size:[1.5,0.64,1.5], color:"#fb923c", label:"字节 Byte" },
    { id:"part-b3", type:"box", pos:[0,1.6,0],     size:[1.7,0.64,1.7], color:"#f5c451", label:"编码 Encoding" },
    { id:"part-b4", type:"box", pos:[0.9,2.24,0],  size:[1.9,0.64,1.9], color:"#2dd4bf", label:"结构 Structure" },
    { id:"part-b5", type:"box", pos:[1.8,2.88,0],  size:[2.1,0.64,2.1], color:"#60a5fa", label:"系统 System" }
  ],
  marks:[
    { id:"m1", at:[-1.8,0.64,0], title:"二进制", body:"一个比特只有 0/1 两种状态——正是这种极简，让电路开关得以表示整个世界。", depth:"L1" },
    { id:"m2", at:[0,1.92,0], title:"编码", body:"ASCII、RGB、采样率：约定让二进制串获得「颜色」「文字」「声音」的含义。", depth:"L2" },
    { id:"m3", at:[1.8,3.2,0], title:"系统协作", body:"CPU、内存、操作系统层层协作，把比特组织成你眼前可交互的程序。", depth:"L3" }
  ]
},

/* ================= Harvard CS50 ================= */
"harvard-cs50": {
  title:"从 Scratch 到 Web 的抽象阶梯",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.5, pitch:0.36, dist:10.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,6], n:8, color:"#223050" },
    { id:"part-s1", type:"box", pos:[-2.2,0.34,0], size:[1.2,0.68,1.2], color:"#f472b6", label:"Scratch" },
    { id:"part-s2", type:"box", pos:[-1.1,1.02,0], size:[1.2,0.68,1.2], color:"#60a5fa", label:"C" },
    { id:"part-s3", type:"box", pos:[0,1.7,0],     size:[1.2,0.68,1.2], color:"#f5c451", label:"Python" },
    { id:"part-s4", type:"box", pos:[1.1,2.38,0],  size:[1.2,0.68,1.2], color:"#2dd4bf", label:"SQL" },
    { id:"part-s5", type:"box", pos:[2.2,3.06,0],  size:[1.2,0.68,1.2], color:"#34d399", label:"Web" },
    { id:"part-arc", type:"arc", pos:[-2.2,0.68,0], to:[2.2,3.06,0], height:0.5, color:"#f5c451", width:2 }
  ],
  marks:[
    { id:"m1", at:[-2.2,0.68,0], title:"积木式编程", body:"Scratch 用拼图屏蔽语法错误，让你先理解「序列、循环、事件」这些计算思维骨架。", depth:"L1" },
    { id:"m2", at:[-1.1,1.36,0], title:"C 与内存", body:"指针与手动内存管理迫使你直面计算机的真实工作方式——底层理解在此建立。", depth:"L2" },
    { id:"m3", at:[2.2,3.4,0], title:"Web 项目", body:"HTML/CSS/JS + SQL 组合成完整应用：课程终点是能独立「造出东西」的工程能力。", depth:"L4" }
  ]
},

/* ================= Harvard 积极心理学 ================= */
"harvard-psy1504": {
  title:"幸福四要素",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.7, pitch:0.38, dist:9 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[8,8], n:8, color:"#223050" },
    { id:"part-core", type:"sphere", pos:[0,1.75,0], size:[0.55], color:"#f5c451", opacity:0.85, label:"幸福 PERMA" },
    { id:"part-p1", type:"box", pos:[1.75,0.55,0],  size:[1.15,1.1,1.15], color:"#a78bfa", label:"意义" },
    { id:"part-p2", type:"box", pos:[-1.75,0.55,0], size:[1.15,1.1,1.15], color:"#f472b6", label:"快乐" },
    { id:"part-p3", type:"box", pos:[0,0.55,1.75],  size:[1.15,1.1,1.15], color:"#2dd4bf", label:"投入" },
    { id:"part-p4", type:"box", pos:[0,0.55,-1.75], size:[1.15,1.1,1.15], color:"#34d399", label:"关系" },
    { id:"part-l1", type:"line", pos:[1.75,1.1,0], to:[0.3,1.75,0], color:"#f5c451", width:1.6 },
    { id:"part-l2", type:"line", pos:[-1.75,1.1,0], to:[-0.3,1.75,0], color:"#f5c451", width:1.6 },
    { id:"part-l3", type:"line", pos:[0,1.1,1.75], to:[0,1.75,0.3], color:"#f5c451", width:1.6 },
    { id:"part-l4", type:"line", pos:[0,1.1,-1.75], to:[0,1.75,-0.3], color:"#f5c451", width:1.6 }
  ],
  marks:[
    { id:"m1", at:[0,1.75,0], title:"幸福基准线", body:"幸福有相当比例由基因设定，但仍有可塑空间——积极心理学训练的正是这块「可塑区」。", depth:"L2" },
    { id:"m2", at:[0,1.1,1.75], title:"投入与心流", body:"挑战与能力匹配时进入心流：全神贯注、自我意识消失、时间感扭曲。", depth:"L2" },
    { id:"m3", at:[1.75,1.1,0], title:"意义与关系", body:"追求超越自身的目标、经营高质量关系，是长期幸福感最稳健的两个预测因子。", depth:"L3" }
  ]
},

/* ================= Oxford 哲学导论 ================= */
"oxford-philosophy": {
  title:"论证的结构",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.62, pitch:0.3, dist:9.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,6], n:8, color:"#223050" },
    { id:"part-premise", type:"box", pos:[-1.6,0.62,1.1], size:[2.8,0.75,1.0], color:"#60a5fa", label:"前提 Premises" },
    { id:"part-rule", type:"line", pos:[-1.6,1.0,1.1], to:[-0.4,2.15,0], color:"#f5c451", width:2.4 },
    { id:"part-concl", type:"box", pos:[0.7,2.5,0], size:[2.4,0.75,1.0], color:"#f5c451", label:"结论 Conclusion" },
    { id:"part-ep", type:"box", pos:[-2.9,1.5,0], size:[0.9,2.4,0.9], color:"#a78bfa", opacity:0.8, label:"知识论" },
    { id:"part-eth", type:"box", pos:[2.9,1.5,0], size:[0.9,2.4,0.9], color:"#34d399", opacity:0.8, label:"伦理学" },
    { id:"part-met", type:"box", pos:[0,1.5,-2.4], size:[0.9,2.4,0.9], color:"#f472b6", opacity:0.8, label:"形而上学" }
  ],
  marks:[
    { id:"m1", at:[-1.6,1.0,0], title:"前提", body:"论证从被接受或待检验的前提出发——哲学训练的第一步是审查前提而非结论。", depth:"L1" },
    { id:"m2", at:[-0.7,1.7,0], title:"推理与有效性", body:"有效推理保证「前提真则结论必真」；日常说服中最常见的谬误就藏在推理环节。", depth:"L2" },
    { id:"m3", at:[2.9,2.7,0], title:"三大分支", body:"知识论问「能知道什么」，伦理学问「应当如何行动」，形而上学问「世界是什么」。", depth:"L3" }
  ]
},

/* ================= Cambridge 数学三大支柱 ================= */
"cambridge-math": {
  title:"代数 · 分析 · 几何",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.55, pitch:0.3, dist:10 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[9,6], n:8, color:"#223050" },
    { id:"part-base", type:"box", pos:[0,0.3,0], size:[5.0,0.6,2.6], color:"#8b98ad", opacity:0.55, label:"统一语言：向量与线性空间" },
    { id:"part-alg", type:"box", pos:[-1.7,1.85,0], size:[1.15,2.9,1.15], color:"#60a5fa", label:"代数" },
    { id:"part-ana", type:"box", pos:[0,1.85,0],    size:[1.15,2.9,1.15], color:"#2dd4bf", label:"分析" },
    { id:"part-geo", type:"box", pos:[1.7,1.85,0],  size:[1.15,2.9,1.15], color:"#f5c451", label:"几何" },
    { id:"part-l1", type:"line", pos:[-1.7,3.3,0], to:[0,3.3,0], color:"#f5c451", width:1.6 },
    { id:"part-l2", type:"line", pos:[0,3.3,0], to:[1.7,3.3,0], color:"#f5c451", width:1.6 }
  ],
  marks:[
    { id:"m1", at:[-1.7,3.3,0], title:"代数：研究结构", body:"群、环、域刻画运算规则本身——解方程只是结构思想最浅的一处应用。", depth:"L2" },
    { id:"m2", at:[0,3.3,0], title:"分析：研究变化", body:"极限把离散的求和变成连续的积分，微积分成为描述一切变化的语言。", depth:"L2" },
    { id:"m3", at:[0,0.6,0], title:"统一语言", body:"向量空间同时承载代数结构与几何直观：三大支柱在底层说的是同一件事。", depth:"L3" }
  ]
},

/* ================= Imperial 工程设计思维 ================= */
"imperial-design": {
  title:"设计循环",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.6, pitch:0.44, dist:8.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[8,8], n:8, color:"#223050" },
    { id:"part-ring", type:"ring", pos:[0,0.95,0], size:[1.75,0.16], color:"#f5c451", opacity:0.85 },
    { id:"part-d1", type:"box", pos:[0,0.95,1.75],    size:[1.0,0.9,1.0], color:"#60a5fa", label:"需求" },
    { id:"part-d2", type:"box", pos:[1.67,0.95,0.53],  size:[1.0,0.9,1.0], color:"#2dd4bf", label:"概念" },
    { id:"part-d3", type:"box", pos:[1.03,0.95,-1.42], size:[1.0,0.9,1.0], color:"#34d399", label:"原型" },
    { id:"part-d4", type:"box", pos:[-1.03,0.95,-1.42], size:[1.0,0.9,1.0], color:"#f5c451", label:"测试" },
    { id:"part-d5", type:"box", pos:[-1.67,0.95,0.53], size:[1.0,0.9,1.0], color:"#f472b6", label:"迭代" }
  ],
  marks:[
    { id:"m1", at:[0,1.85,1.75], title:"需求", body:"把模糊的用户诉求转译为可验证的工程指标——约束条件在这一步被显式列出。", depth:"L1" },
    { id:"m2", at:[1.03,1.85,-1.42], title:"原型", body:"用最低成本做出可测试的实体：原型的使命是尽早暴露风险，而不是表现完美。", depth:"L2" },
    { id:"m3", at:[0,0.95,0], title:"迭代循环", body:"工程不是线性流程而是闭环：每一次「失败—学习—再设计」都让方案更接近可行。", depth:"L3" }
  ]
},

/* ================= ETH 量子力学导论 ================= */
"eth-quantum": {
  title:"双缝实验",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.32, pitch:0.24, dist:10.5 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[10,6], n:8, color:"#223050" },
    { id:"part-src", type:"box", pos:[-3.6,1.4,0], size:[0.55,0.55,0.55], color:"#f5c451", label:"粒子源" },
    { id:"part-bar-up", type:"box", pos:[-1.1,2.15,0], size:[0.18,1.3,3.0], color:"#8b98ad", opacity:0.85 },
    { id:"part-bar-dn", type:"box", pos:[-1.1,0.32,0], size:[0.18,0.64,3.0], color:"#8b98ad", opacity:0.85 },
    { id:"part-arc1", type:"arc", pos:[-3.6,1.4,0], to:[1.9,1.75,0], height:0.55, color:"#2dd4bf", width:2.2 },
    { id:"part-arc2", type:"arc", pos:[-3.6,1.4,0], to:[1.9,1.05,0], height:-0.5, color:"#2dd4bf", width:2.2 },
    { id:"part-screen", type:"box", pos:[2.1,1.4,0], size:[0.14,2.8,3.0], color:"#60a5fa", opacity:0.45, label:"探测屏" },
    { id:"part-fringe1", type:"sphere", pos:[2.2,1.4,0], size:[0.1], color:"#f5c451" },
    { id:"part-fringe2", type:"sphere", pos:[2.2,1.95,0], size:[0.08], color:"#f5c451" },
    { id:"part-fringe3", type:"sphere", pos:[2.2,0.85,0], size:[0.08], color:"#f5c451" },
    { id:"part-fringe4", type:"sphere", pos:[2.2,2.35,0], size:[0.05], color:"#f5c451" },
    { id:"part-fringe5", type:"sphere", pos:[2.2,0.45,0], size:[0.05], color:"#f5c451" }
  ],
  marks:[
    { id:"m1", at:[-3.6,1.95,0], title:"波粒二象性", body:"单个光子也表现出波动性——「是粒子还是波」问错了问题：量子客体没有经典对应物。", depth:"L2" },
    { id:"m2", at:[-1.1,1.4,0], title:"双缝", body:"两条狭缝让概率幅分两路传播并相互叠加——开一条缝时干涉条纹消失，观测本身改变结果。", depth:"L2" },
    { id:"m3", at:[2.2,1.4,0], title:"概率分布", body:"屏上明暗相间的条纹是概率幅的干涉图样：|ψ|² 给出粒子落点的概率，而非确定轨道。", depth:"L3" }
  ]
},

/* ================= NUS 数据科学导论 ================= */
"nus-ds": {
  title:"端到端数据管道",
  hint:"拖动旋转 · 滚轮缩放 · 点击金色标记点",
  camera:{ yaw:0.5, pitch:0.36, dist:10 },
  parts:[
    { id:"part-grid", type:"grid", pos:[0,0,0], size:[10,5], n:8, color:"#223050" },
    { id:"part-p1", type:"box", pos:[-3.1,0.55,0],  size:[0.95,1.1,0.95], color:"#60a5fa", label:"提问" },
    { id:"part-p2", type:"box", pos:[-1.85,0.85,0], size:[0.95,1.1,0.95], color:"#2dd4bf", label:"获取" },
    { id:"part-p3", type:"box", pos:[-0.6,0.55,0],  size:[0.95,1.1,0.95], color:"#34d399", label:"清洗" },
    { id:"part-p4", type:"box", pos:[0.65,0.85,0],  size:[0.95,1.1,0.95], color:"#f5c451", label:"探索" },
    { id:"part-p5", type:"box", pos:[1.9,0.55,0],   size:[0.95,1.1,0.95], color:"#fb923c", label:"建模" },
    { id:"part-p6", type:"box", pos:[3.15,0.85,0],  size:[0.95,1.1,0.95], color:"#f472b6", label:"沟通" },
    { id:"part-a1", type:"arc", pos:[-2.6,1.1,0], to:[-1.2,1.1,0], height:0.35, color:"#f5c451", width:1.8 },
    { id:"part-a2", type:"arc", pos:[-1.35,1.1,0], to:[-0.1,1.1,0], height:0.35, color:"#f5c451", width:1.8 },
    { id:"part-a3", type:"arc", pos:[-0.1,1.1,0], to:[1.15,1.1,0], height:0.35, color:"#f5c451", width:1.8 },
    { id:"part-a4", type:"arc", pos:[1.15,1.1,0], to:[2.4,1.1,0], height:0.35, color:"#f5c451", width:1.8 },
    { id:"part-a5", type:"arc", pos:[2.4,1.1,0], to:[3.65,1.1,0], height:0.35, color:"#f5c451", width:1.8 }
  ],
  marks:[
    { id:"m1", at:[-3.1,1.1,0], title:"提问", body:"从业务问题出发而非数据出发——好问题是整个管道方向的第一个决策点。", depth:"L1" },
    { id:"m2", at:[-0.6,1.1,0], title:"清洗", body:"缺失、异常、重复：数据质量决定分析上限，这一步通常占据 60% 以上的项目时间。", depth:"L2" },
    { id:"m3", at:[3.15,1.1,0], title:"沟通", body:"用图表讲数据故事，让决策者理解并行动——不能驱动决策的分析等于没有完成。", depth:"L4" }
  ]
}

};

/* ============================================================
 * 金融课程交互实验室（自包含模块）
 * 文件：assets/js/finance-lab.js
 *
 * 由 platform.js 在 course.lab === "finance" 时按需加载并调用：
 *   FinanceLab.mount(root, { courseId })
 *   FinanceLab.dispose()
 *
 * 内容来源：原「深度专题」页（mit-finance.html）的 legacy 脚本，
 * 已合并为单一自包含模块：复利引擎、凯利公式计算器、
 * 认知自检、行动清单、延伸学习弹窗、滚雪球动画。
 * ============================================================ */

const FinanceLab = (() => {

  /* ============================================================
   * 数据层（自包含，不依赖平台数据文件）
   * ============================================================ */

  /* ---------- 延伸学习资源 ---------- */
  const RESOURCES = [
  {
    id:"e1", num:"E1", icon:"🎓", title:"MIT OCW · Finance Theory I",
    author:"Prof. Andrew Lo · MIT Sloan 公开课",
    brief:"本页知识框架的源头：现值、债券、股权、组合、期权，一堂免费的世界级金融第一课。",
    tagline:"「七大认知模块」的地基，全部出自这套课程体系",
    body:`15.401 是 MIT 斯隆管理学院的王牌课程，由对冲基金 AlphaSimplex 创始人 <b>Andrew Lo</b> 主讲。开篇那句著名的 <b>"Mathematics + $$ = Finance"</b> 就是整堂课的注脚：现代金融不是故事会，而是数学。<br>课程主线：<b>现值关系 → 固定收益证券 → 股权 → 投资组合理论 → 期权定价</b>。本课程模块 02（复利）、04（风险）、05（组合）均出自这套体系。全部讲座视频与讲义在 MIT OpenCourseWare 官网免费开放，无需注册。`,
    quote:"“如果你只能上一门金融课，就上这门。” —— 课程在华尔街从业者中的口碑",
    diagram:"course",
    formula:`课程主线：PV 现值 → Bonds 债券 → Equities 股权 → Portfolio 组合 → Options 期权`,
    action:`访问 ocw.mit.edu 搜索 "15.401 Finance Theory I"，从「Present Value Relations」讲座开始看——那正是复利模块的出处。`
  },
  {
    id:"e2", num:"E2", icon:"📗", title:"《战胜一切市场》",
    author:"Edward Thorp · 凯利公式实战",
    brief:"从 MIT 算牌少年到量化投资之父：如何发现微弱优势，并用数学把它变成三十年复利。",
    tagline:"概率思维与仓位管理两个模块的现实版注脚",
    body:`Edward Thorp 是 MIT 数学教授，也是把<b>凯利公式</b>从赌场带进华尔街的人：他用算牌术横扫拉斯维加斯与大西洋城，又用量化策略管理对冲基金 Newport，二十年跑赢市场。<br>全书核心只有一句话：<b>发现优势 → 用凯利公式定量下注 → 长期重复</b>。他还示范了如何识别"几乎不可见的微弱正期望"——这正是普通投资者最该学习的思维。`,
    quote:"“你不需要每次都赢，你只需要在优势明显时下对注。”",
    diagram:"thorp",
    formula:`财富公式 = 优势(edge) × 凯利仓位 × 重复次数 − 破产概率`,
    action:`读原书第 2 章（21点）与第 9 章（对冲基金）；重点看他如何"量化一个赌场自以为不存在的优势"。`
  },
  {
    id:"e3", num:"E3", icon:"📘", title:"现代投资组合理论 MPT",
    author:"Harry Markowitz · 1990 年诺贝尔经济学奖",
    brief:"“分散是唯一的免费午餐”的数学出处：有效前沿、相关系数与均值-方差分析。",
    tagline:"分散投资模块整张图解的理论地基",
    body:`1952 年，25 岁的马科维茨发表 9 页论文《Portfolio Selection》，开创了现代金融：他用<b>均值-方差</b>框架证明——组合的风险不仅取决于单个资产的波动，更取决于资产间的<b>相关系数 ρ</b>。<br>由此诞生「有效前沿」：在给定风险下收益最高、或给定收益下风险最低的那条边界。他的结论反直觉却影响至今：<b>风险是组合的属性，不是单个股票的属性。</b>`,
    quote:"“分散化是投资中唯一的免费午餐。” —— 马科维茨",
    diagram:"frontier",
    formula:`σ<sub>p</sub>² = Σ<sub>i</sub>Σ<sub>j</sub> w<sub>i</sub>w<sub>j</sub>σ<sub>i</sub>σ<sub>j</sub>ρ<sub>ij</sub>`,
    action:`画一张自己持仓的"资产相关性矩阵"，检查是否所有资产其实都在同涨同跌——那叫伪分散。`
  },
  {
    id:"e4", num:"E4", icon:"📙", title:"《思考，快与慢》",
    author:"Daniel Kahneman · 行为金融学",
    brief:"为什么懂了所有理论，你还是会在山顶追高、在山脚割肉——因为你的系统 1 劫持了系统 2。",
    tagline:"行为纪律模块情绪周期图背后的学术源头",
    body:`诺贝尔奖得主卡尼曼证明：人脑中<b>系统 1</b>（直觉、快）经常劫持<b>系统 2</b>（理性、慢）。他与 Tversky 共同提出的<b>前景理论</b>直接改写了金融学——<br>价值函数是 S 形的：亏损区的陡峭程度约为盈利区的 <b>2 倍</b>（损失厌恶），这解释了为何散户总是"死扛亏损、早卖盈利"。认识偏差不能消除，只能用<b>规则与清单</b>对冲。`,
    quote:"“没有什么比承认自己会系统性犯错更能保护你。”",
    diagram:"prospect",
    formula:`前景理论：v(x) 为 S 形函数，λ ≈ 2.25（损失厌恶系数）`,
    action:`下次想追涨/杀跌时，先写下三条"如果我是错的"的证据——强制启动系统 2 再决策。`
  }];

  /* ---------- 认知自检题目 ---------- */
  const QUIZ = [
  {
    q:"赌场能够长期稳定盈利的根本原因是？",
    opts:["赌场老板运气特别好","每一局都有微弱正期望，靠大数定律海量重复","赌徒普遍不够聪明"],
    a:1,
    why:"赌场的商业模式是数学，不是运气：轮盘赌约 5.3% 的微弱优势 × 每天上万次投注 = 确定性利润。反过来，这也是投资者应该复制的结构。"
  },
  {
    q:"年化收益 8%，按 72 法则大约多少年本金翻一倍？",
    opts:["约 9 年","约 12 年","约 7.2 年"],
    a:0,
    why:"72 ÷ 8 = 9。翻倍速度只取决于收益率：年化 12% 约 6 年，年化 6% 约 12 年。复利对收益率极其敏感，所以控制回撤、保证“不中断”比追逐高收益更重要。"
  },
  {
    q:"当你发现一个正期望的投资机会时，凯利公式建议你怎么做？",
    opts:["全部押上，趁热打铁","按胜率与赔率计算最优仓位，并留足安全边际","正期望不存在，不投资"],
    a:1,
    why:"正期望只保证“长期有利”，不保证“单次不死”。仓位超过 f* 后，长期增长率反而下降，一次连败就可能出局。实战用半凯利、给估计打八折、设单笔上限。"
  }];

  /* ---------- 行动清单 ---------- */
  const CHECKS = [
    "算清自己的「正期望」来自哪里（企业成长 / 股息 / 利差）",
    "设置一笔自动定投——发薪日先投资、后消费",
    "为最大的一笔投资写下「最坏情况剧本」",
    "建立股债（或跨资产）组合，设定每年再平衡日",
    "卸载短线行情 App，把看盘频率降到每周一次",
    "把投资原则打印出来，贴在每天看得见的地方"
  ];

  /* ============================================================
   * 资源图解（SVG 生成器，自包含）
   * ============================================================ */
  function svgWrap(inner, vb="0 0 720 300"){
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif" style="width:100%;height:auto;display:block">
    <style>
      .t{fill:#dbe4f0;font-size:13px}.ts{fill:#8b98ad;font-size:11px}
      .g{fill:#34d399;font-size:12px;font-weight:700}.r{fill:#f87171;font-size:12px;font-weight:700}
      .go{fill:#f5c451;font-size:12px;font-weight:700}
    </style>${inner}</svg>`;
  }

  const DIAGRAMS = {

    /* ---------- E1：MIT 课程主线 ---------- */
    course: () => svgWrap(`
      <defs><marker id="fl-ar4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5c451"/></marker></defs>
      <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">15.401 Finance Theory I · 课程主线</text>
      ${[
        {x:90,n:"1",t:"现值关系",s:"PV · 时间价值"},
        {x:230,n:"2",t:"固定收益",s:"Bonds · 利率"},
        {x:370,n:"3",t:"股权",s:"Equities · 估值"},
        {x:510,n:"4",t:"投资组合",s:"Portfolio · MPT"},
        {x:650,n:"5",t:"期权",s:"Options · BSM"}
      ].map((d,i)=>`
        <rect x="${d.x-62}" y="80" width="124" height="86" rx="12" fill="rgba(245,196,81,.07)" stroke="#f5c451" stroke-width="1.5"/>
        <text x="${d.x}" y="108" text-anchor="middle" style="fill:#f5c451;font-size:18px;font-weight:800">${d.n}</text>
        <text x="${d.x}" y="132" text-anchor="middle" class="t" style="font-weight:700">${d.t}</text>
        <text x="${d.x}" y="150" text-anchor="middle" class="ts">${d.s}</text>
        ${i<4?`<path d="M${d.x+64} 123 H ${d.x+78}" stroke="#f5c451" stroke-width="2" marker-end="url(#fl-ar4)"/>`:""}
      `).join("")}
      <text x="360" y="208" text-anchor="middle" class="ts">每一讲都是下一讲的地基：现值 → 资产定价 → 组合 → 衍生品</text>
      <rect x="190" y="228" width="340" height="52" rx="10" fill="rgba(255,255,255,.04)" stroke="#2a3550"/>
      <text x="360" y="250" text-anchor="middle" style="fill:#f5c451;font-size:15px;font-weight:800;font-family:Georgia,serif">"Mathematics + $$ = Finance"</text>
      <text x="360" y="270" text-anchor="middle" class="ts">—— Andrew Lo 的开篇第一页幻灯片</text>`),

    /* ---------- E2：Thorp 时间线 ---------- */
    thorp: () => svgWrap(`
      <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">Edward Thorp：从赌场到华尔街</text>
      <line x1="80" y1="160" x2="640" y2="160" stroke="#f5c451" stroke-width="2.5"/>
      <defs><marker id="fl-ar5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5c451"/></marker></defs>
      ${[
        {x:120,t:"1959-61",s:"MIT 算牌",d:"横扫拉斯维加斯",c:"#f87171"},
        {x:300,t:"1967",s:"《战胜市场》",d:"Beat the Dealer",c:"#60a5fa"},
        {x:480,t:"1969-88",s:"Newport 基金",d:"量化策略常年跑赢",c:"#34d399"},
        {x:640,t:"至今",s:"统计套利之父",d:"量化投资启蒙者",c:"#f5c451"}
      ].map((d,i)=>`
        <circle cx="${d.x}" cy="160" r="8" fill="${d.c}"/>
        <text x="${d.x}" y="128" text-anchor="middle" style="fill:${d.c};font-size:13px;font-weight:800">${d.t}</text>
        <text x="${d.x}" y="192" text-anchor="middle" class="t" style="font-weight:700">${d.s}</text>
        <text x="${d.x}" y="210" text-anchor="middle" class="ts">${d.d}</text>
        ${i<3?`<path d="M${d.x+12} 160 H ${d.x+76}" stroke="#f5c451" stroke-width="2" marker-end="url(#fl-ar5)"/>`:""}
      `).join("")}
      <text x="360" y="256" text-anchor="middle" class="ts">同一条线索贯穿始终：发现优势 → 凯利定量下注 → 长期重复</text>
      <text x="360" y="282" text-anchor="middle" class="go">赌场视他为不受欢迎的人，市场视他为先驱——他只是在解同一道数学题</text>`),

    /* ---------- E3：有效前沿 + CML ---------- */
    frontier: () => svgWrap(`
      <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">均值-方差平面：马科维茨的画布</text>
      <line x1="70" y1="260" x2="690" y2="260" stroke="#2a3550"/>
      <line x1="70" y1="40" x2="70" y2="260" stroke="#2a3550"/>
      <text x="380" y="288" text-anchor="middle" class="ts">风险 σ →</text>
      <text x="46" y="150" class="ts" transform="rotate(-90 46 150)">收益 →</text>
      <circle cx="100" cy="235" r="6" fill="#60a5fa"/>
      <text x="112" y="239" class="ts">无风险利率 Rf</text>
      <path d="M100 235 L 660 55" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="6 5"/>
      <text x="520" y="105" style="fill:#2dd4bf;font-size:12px;font-weight:700">资本市场线 CML</text>
      <path d="M120 250 Q 320 70 660 45" fill="none" stroke="#f5c451" stroke-width="3"/>
      <text x="560" y="40" class="go">有效前沿 EF</text>
      ${[
        {x:150,y:225,n:"国债",c:"#60a5fa"},
        {x:230,y:200,n:"蓝筹股",c:"#2dd4bf"},
        {x:270,y:100,n:"科技股",c:"#34d399"},
        {x:390,y:215,n:"垃圾债",c:"#f87171"},
        {x:430,y:150,n:"加密资产",c:"#f87171"},
        {x:330,y:120,n:"最优组合",c:"#f5c451"}
      ].map(d=>`<circle cx="${d.x}" cy="${d.y}" r="5" fill="${d.c}"/><text x="${d.x+9}" y="${d.y+4}" class="t">${d.n}</text>`).join("")}
      <text x="360" y="272" text-anchor="middle" class="ts">1952 年，25 岁的马科维茨用 9 页论文开创了现代金融</text>`),

    /* ---------- E4：前景理论价值函数 ---------- */
    prospect: () => svgWrap(`
      <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">前景理论价值函数：S 形曲线</text>
      <line x1="40" y1="160" x2="680" y2="160" stroke="#2a3550" stroke-dasharray="4 5"/>
      <line x1="360" y1="50" x2="360" y2="270" stroke="#2a3550" stroke-dasharray="4 5"/>
      <text x="640" y="180" class="ts">收益 →</text>
      <text x="80" y="180" class="ts">← 亏损</text>
      <text x="352" y="44" text-anchor="end" class="go">参考点</text>
      <path d="M40 288 C 140 240, 250 195, 360 158 C 470 132, 560 112, 680 92" fill="none" stroke="#f5c451" stroke-width="3.5"/>
      <rect x="40" y="170" width="320" height="100" fill="rgba(248,113,113,.06)"/>
      <rect x="360" y="60" width="320" height="100" fill="rgba(52,211,153,.05)"/>
      <text x="200" y="200" text-anchor="middle" class="r">亏损区：陡峭（λ ≈ 2.25）</text>
      <text x="200" y="220" text-anchor="middle" class="ts">亏 100 的痛 > 赚 100 的爽</text>
      <text x="520" y="90" text-anchor="middle" class="g">盈利区：平缓且 concave</text>
      <text x="520" y="110" text-anchor="middle" class="ts">赚得越多，爽感增量越小</text>
      <text x="360" y="292" text-anchor="middle" class="ts">Kahneman & Tversky, 1979 —— 这就是"死扛亏损、早卖盈利"的数学根源</text>`)
  };

  /* ============================================================
   * 工具
   * ============================================================ */
  const $ = id => document.getElementById(id);
  const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  function fmtWan(v){
    if (v >= 10000) return (v/10000).toFixed(v >= 1000000 ? 0 : 1) + " 万";
    return Math.round(v).toLocaleString();
  }
  function fillRange(el){
    const pct = (el.value - el.min) / (el.max - el.min) * 100;
    el.style.setProperty("--fill", pct + "%");
  }

  /* ============================================================
   * 计算器：复利引擎
   * ============================================================ */
  function drawCompound(){
    const P=+$("flInP").value, M=+$("flInM").value, R=+$("flInR").value, N=+$("flInN").value, I=+$("flInI").value;
    $("flVP").textContent = P.toLocaleString() + " 元";
    $("flVM").textContent = M.toLocaleString() + " 元";
    $("flVR").textContent = R + "%";
    $("flVN").textContent = N + " 年";
    $("flVI").textContent = I.toFixed(1) + "%";
    ["flInP","flInM","flInR","flInN","flInI"].forEach(x => fillRange($(x)));

    const r = R/100/12, months = N*12;
    const bal=[], real=[], inv=[];
    let b = P;
    for (let m=0; m<=months; m++){
      bal.push(b);
      real.push(b / Math.pow(1 + I/100, m/12));
      inv.push(P + M*m);
      b = b*(1+r) + M;
    }
    const W=720, H=340, L=70, Rr=20, T=30, B=52;
    const iw = W-L-Rr, ih = H-T-B;
    const maxV = Math.max(bal[months], inv[months], 1);
    const sx = i => L + iw*i/months;
    const sy = v => T + ih*(1 - v/maxV);
    const pts = arr => arr.map((v,i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" ");

    let grid = "";
    for (let g=0; g<=4; g++){
      const v = maxV*g/4, y = sy(v);
      grid += `<line x1="${L}" y1="${y}" x2="${W-Rr}" y2="${y}" stroke="rgba(255,255,255,.07)"/>
               <text x="${L-8}" y="${y+4}" text-anchor="end" style="fill:#8b98ad;font-size:11px">${fmtWan(v)}</text>`;
    }
    let xlab = "";
    const step = N > 20 ? 5 : 2;
    for (let y=0; y<=N; y+=step){
      xlab += `<text x="${sx(y*12)}" y="${H-28}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">${y}年</text>`;
    }
    const areaPath = `M${sx(0)},${sy(bal[0])} ` + bal.map((v,i) => `L${sx(i)},${sy(v)}`).join(" ") + ` L${sx(months)},${T+ih} L${sx(0)},${T+ih} Z`;

    $("flCompoundSvg").innerHTML = `
      <defs><linearGradient id="fl-ag" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(245,196,81,.28)"/><stop offset="1" stop-color="rgba(245,196,81,0)"/>
      </linearGradient></defs>
      ${grid}
      <path d="${areaPath}" fill="url(#fl-ag)"/>
      <polyline points="${pts(inv)}" fill="none" stroke="#5b6b85" stroke-width="2"/>
      <polyline points="${pts(real)}" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="6 5"/>
      <polyline points="${pts(bal)}" fill="none" stroke="#f5c451" stroke-width="3.5"/>
      <circle cx="${sx(months)}" cy="${sy(bal[months])}" r="5" fill="#f5c451" stroke="#0b1120" stroke-width="2"/>
      <text x="${sx(months)-6}" y="${sy(bal[months])-12}" text-anchor="end" style="fill:#f5c451;font-size:13px;font-weight:800">${fmtWan(bal[months])}</text>
      ${xlab}
      <line x1="${L}" y1="${T+ih}" x2="${W-Rr}" y2="${T+ih}" stroke="rgba(255,255,255,.15)"/>`;

    const invested = P + M*months, profit = bal[months] - invested;
    $("flRFinal").textContent = fmtWan(bal[months]);
    $("flRInvested").textContent = fmtWan(invested);
    $("flRProfit").textContent = fmtWan(profit);
    $("flRDouble").textContent = R > 0 ? (72/R).toFixed(1) + " 年" : "—";
  }

  /* ============================================================
   * 计算器：凯利公式
   * ============================================================ */
  function drawKelly(){
    const p = +$("flInPk").value/100, b = +$("flInBk").value, q = 1-p;
    $("flVPk").textContent = (p*100) + "%";
    $("flVBk").textContent = b.toFixed(1);
    fillRange($("flInPk")); fillRange($("flInBk"));

    const fStar = (b*p - q)/b;
    const W=720, H=340, L=70, Rr=20, T=40, B=52;
    const iw = W-L-Rr, ih = H-T-B;
    const fmax = 0.95;
    const g = f => p*Math.log(1 + b*f) + q*Math.log(Math.max(1-f, 1e-9));

    const gs = [];
    for (let i=0; i<=95; i++){ const f = fmax*i/95; gs.push({ f, g:g(f) }); }
    const minG = Math.min(...gs.map(x => x.g)), maxG = Math.max(...gs.map(x => x.g));
    const pad = (maxG - minG)*0.12 || 1;
    const sx = f => L + iw*f/fmax;
    const sy = v => T + ih*(1 - (v - (minG-pad)) / ((maxG+pad) - (minG-pad)));
    const path = gs.map(x => `${sx(x.f).toFixed(1)},${sy(x.g).toFixed(1)}`).join(" ");

    let grid = "";
    for (let i=0; i<=4; i++){
      const v = minG - pad + ((maxG+pad) - (minG-pad))*i/4, y = sy(v);
      grid += `<line x1="${L}" y1="${y}" x2="${W-Rr}" y2="${y}" stroke="rgba(255,255,255,.07)"/>`;
    }
    [0,.25,.5,.75,.95].forEach(f => {
      grid += `<text x="${sx(f)}" y="${H-26}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">${(f*100).toFixed(0)}%</text>`;
    });

    const verdict = $("flKVerdict");
    let marker = "";
    if (fStar > 0 && fStar < 0.95){
      const fs = Math.min(fStar, fmax);
      marker = `
        <line x1="${sx(fs)}" y1="${sy(g(fs))}" x2="${sx(fs)}" y2="${T+ih}" stroke="#34d399" stroke-width="2" stroke-dasharray="5 5"/>
        <circle cx="${sx(fs)}" cy="${sy(g(fs))}" r="7" fill="#34d399" stroke="#0b1120" stroke-width="2"/>
        <text x="${sx(fs)}" y="${sy(g(fs))-14}" text-anchor="middle" style="fill:#34d399;font-size:13px;font-weight:800">f*=${(fStar*100).toFixed(1)}%</text>
        <line x1="${sx(Math.min(fStar*2,.95))}" y1="${T+10}" x2="${sx(Math.min(fStar*2,.95))}" y2="${T+ih}" stroke="rgba(248,113,113,.4)" stroke-width="1.5" stroke-dasharray="3 4"/>
        <text x="${sx(Math.min(fStar*2,.95))+4}" y="${T+20}" style="fill:#f87171;font-size:11px">2f* 危险起点</text>`;
      verdict.className = "fl-verdict good";
      verdict.innerHTML = `✅ <b>正期望机会！</b>凯利最优仓位为总资金的 <b>${(fStar*100).toFixed(1)}%</b>。但估计永远有误差，实战请使用半凯利 <b>${(fStar*50).toFixed(1)}%</b>，并严守单笔上限。`;
    } else {
      verdict.className = "fl-verdict bad";
      verdict.innerHTML = `🚫 <b>负期望赌局，最优仓位 = 0。</b>凯利公式的第一课不是“押多少”，而是“<b>不玩</b>”。赌场里大多数游戏都属于此类。`;
    }

    $("flKellySvg").innerHTML = `
      <defs><linearGradient id="fl-kg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(245,196,81,.18)"/><stop offset="1" stop-color="rgba(245,196,81,0)"/>
      </linearGradient></defs>
      ${grid}
      <path d="M${L},${sy(gs[0].g)} ${path.replace(/ /g," L")} L${sx(fmax)},${T+ih} L${L},${T+ih} Z" fill="url(#fl-kg)" opacity=".6"/>
      <polyline points="${path}" fill="none" stroke="#f5c451" stroke-width="3.5"/>
      ${marker}
      <text x="${L-8}" y="${T+ih}" text-anchor="end" style="fill:#8b98ad;font-size:11px">增长率</text>
      <text x="${(L+W-Rr)/2}" y="${H-6}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">仓位比例 f（占总资金）</text>`;

    $("flKStar").textContent = fStar > 0 ? (fStar*100).toFixed(1) + "%" : "0（不玩）";
    $("flKStar").className = "v " + (fStar > 0 ? "" : "red");
    $("flKHalf").textContent = fStar > 0 ? (fStar*50).toFixed(1) + "%" : "0";
    $("flKRuin").textContent = "100% 梭哈";
    $("flKExp").textContent = (p*b - q*1 >= 0 ? "+" : "") + ((p*b - q)*100).toFixed(1) + "%";
    $("flKExp").className = "v " + (p*b - q >= 0 ? "green" : "red");
  }

  /* ============================================================
   * 滚雪球动画（复利引擎装饰）
   * ============================================================ */
  let snowRaf = null;
  function startSnowball(){
    const track = document.querySelector("#flSnowSvg path:nth-of-type(2)");
    const ball = document.getElementById("flSnowball");
    if (!track || !ball || reduced()) return;
    const len = track.getTotalLength();
    let start = null;
    function frame(t){
      if (!start) start = t;
      const prog = Math.min((t - start)/4200, 1);
      const pt = track.getPointAtLength(len*prog);
      ball.setAttribute("cx", pt.x);
      ball.setAttribute("cy", pt.y);
      ball.setAttribute("r", 10 + 24*prog);
      if (prog < 1) snowRaf = requestAnimationFrame(frame);
      else snowRaf = setTimeout(() => { start = null; requestAnimationFrame(frame); }, 1200);
    }
    snowRaf = requestAnimationFrame(frame);
  }
  function stopSnowball(){
    if (snowRaf){ clearTimeout(snowRaf); cancelAnimationFrame(snowRaf); snowRaf = null; }
  }

  /* ============================================================
   * 渲染：区块骨架
   * ============================================================ */
  const SECTIONS_HTML = `
  <section class="fin-sec" id="fin-lab">
    <div class="sec-head">
      <div>
        <div class="sec-tag">Interactive Lab</div>
        <h2>实战实验室：亲手<em>转动雪球</em></h2>
        <p>理论不够直观？拖动滑块，亲眼看看复利与凯利公式如何在时间里放大结果。</p>
      </div>
    </div>
    <div class="fl-tabs">
      <button class="fl-tab active" data-tab="compound">⏳ 复利引擎</button>
      <button class="fl-tab" data-tab="kelly">🎯 凯利公式</button>
    </div>

    <!-- 复利计算器 -->
    <div class="fl-panel show" id="fl-tab-compound">
      <div class="fl-snow">
        <svg viewBox="0 0 520 150" id="flSnowSvg" aria-label="滚雪球复利动画">
          <defs>
            <linearGradient id="fl-hillG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#1a2440"/><stop offset="1" stop-color="#0b1120"/>
            </linearGradient>
            <linearGradient id="fl-ballG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f5c451"/><stop offset="1" stop-color="#e0a92e"/>
            </linearGradient>
          </defs>
          <path d="M20 140 C 120 120, 180 90, 300 55 S 460 15, 500 10 L500 140 Z" fill="url(#fl-hillG)" stroke="rgba(255,255,255,.08)"/>
          <path d="M40 132 C 160 112, 240 82, 330 45 S 450 15, 490 12" fill="none" stroke="#f5c451" stroke-width="2.5" stroke-dasharray="5 7" opacity=".8"/>
          <circle id="flSnowball" r="10" fill="url(#fl-ballG)" cx="40" cy="132"/>
          <text x="40" y="148" fill="#8b98ad" font-size="10" text-anchor="middle">小雪球 · 本金</text>
          <text x="486" y="24" fill="#f5c451" font-size="10" text-anchor="middle">巨球 · 复利</text>
        </svg>
        <div class="fl-snow-cap">很湿的雪（正收益）× 很长的坡（时间）= <b>财富滚雪球</b></div>
      </div>
      <div class="fl-grid">
        <div class="fl-controls">
          <div class="fl-ctrl">
            <label>初始本金 <b id="flVP">10,000 元</b></label>
            <input type="range" id="flInP" min="0" max="500000" step="1000" value="10000">
          </div>
          <div class="fl-ctrl">
            <label>每月定投 <b id="flVM">2,000 元</b><small> 先投资后消费</small></label>
            <input type="range" id="flInM" min="0" max="20000" step="100" value="2000">
          </div>
          <div class="fl-ctrl">
            <label>年化收益率 <b id="flVR">8%</b><small> 长期股权的历史中枢</small></label>
            <input type="range" id="flInR" min="1" max="20" step="0.5" value="8">
          </div>
          <div class="fl-ctrl">
            <label>投资年限 <b id="flVN">25 年</b><small> 坡越长，雪球越大</small></label>
            <input type="range" id="flInN" min="3" max="40" step="1" value="25">
          </div>
          <div class="fl-ctrl">
            <label>年通胀假设 <b id="flVI">2.5%</b><small> 侵蚀购买力的隐形税</small></label>
            <input type="range" id="flInI" min="0" max="6" step="0.1" value="2.5">
          </div>
        </div>
        <div class="fl-chart">
          <h4>资产增长曲线</h4>
          <div class="fl-chart-sub">金色 = 名义资产 · 青色虚线 = 扣除通胀后的实际购买力 · 灰色 = 累计投入本金</div>
          <svg id="flCompoundSvg" viewBox="0 0 720 340"></svg>
          <div class="fl-results">
            <div class="fl-res"><div class="v green" id="flRFinal">—</div><div class="k">期末总资产</div></div>
            <div class="fl-res"><div class="v" id="flRInvested">—</div><div class="k">累计投入</div></div>
            <div class="fl-res"><div class="v" id="flRProfit">—</div><div class="k">复利收益</div></div>
            <div class="fl-res"><div class="v" id="flRDouble">—</div><div class="k">本金翻倍时间(72法则)</div></div>
          </div>
          <div class="fl-legend">
            <span><i style="background:#f5c451"></i>名义资产</span>
            <span><i style="background:#2dd4bf"></i>实际购买力</span>
            <span><i style="background:#5b6b85"></i>累计投入</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 凯利计算器 -->
    <div class="fl-panel" id="fl-tab-kelly">
      <div class="fl-grid">
        <div class="fl-controls">
          <div class="fl-ctrl">
            <label>胜率 p <b id="flVPk">60%</b><small> 长期盈利的概率</small></label>
            <input type="range" id="flInPk" min="10" max="90" step="1" value="60">
          </div>
          <div class="fl-ctrl">
            <label>赔率 b <b id="flVBk">1.0</b><small> 平均盈利 / 平均亏损</small></label>
            <input type="range" id="flInBk" min="0.1" max="5" step="0.1" value="1">
          </div>
          <div class="fl-verdict good" id="flKVerdict"></div>
        </div>
        <div class="fl-chart">
          <h4>仓位 vs 长期增长率</h4>
          <div class="fl-chart-sub">凯利公式求解曲线峰值：f* = (bp − q) / b。越过峰值继续加注，长期增长率断崖式下跌——这就是「正期望也会破产」的数学证明。</div>
          <svg id="flKellySvg" viewBox="0 0 720 340"></svg>
          <div class="fl-results">
            <div class="fl-res"><div class="v" id="flKStar">—</div><div class="k">凯利最优仓位 f*</div></div>
            <div class="fl-res"><div class="v green" id="flKHalf">—</div><div class="k">实战建议（半凯利）</div></div>
            <div class="fl-res"><div class="v red" id="flKRuin">—</div><div class="k">满仓梭哈的下场</div></div>
            <div class="fl-res"><div class="v" id="flKExp">—</div><div class="k">单局期望收益</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="fin-sec" id="fin-quiz">
    <div class="sec-head">
      <div>
        <div class="sec-tag">Quiz</div>
        <h2>认知自检：三道题<em>检验掌握程度</em></h2>
        <p>看完投资认知框架，来验证一下你的「科学投资」直觉是否已经上线。</p>
      </div>
    </div>
    <div id="flQuizBox"></div>
    <div class="fl-score" id="flQuizScore"></div>
  </section>

  <section class="fin-sec" id="fin-action">
    <div class="sec-head">
      <div>
        <div class="sec-tag">Action</div>
        <h2>普通人落地清单：<em>今天就能开始</em></h2>
        <p>科学的投资不需要天赋，只需要规则。勾选你完成的项，看着进度条一点点长起来。</p>
      </div>
    </div>
    <div class="fa-grid" id="flChecklist"></div>
    <div class="fa-progress"><div class="fa-bar"><i id="flCheckBar" style="width:0%"></i></div><span>已完成 <b id="flCheckCount">0</b> / 6 项 · <span id="flCheer">滚雪球的第一步，是让雪球开始滚。</span></span></div>
  </section>

  <section class="fin-sec" id="fin-extend">
    <div class="sec-head">
      <div>
        <div class="sec-tag">Go Deeper</div>
        <h2>延伸学习：四条<em>深入路径</em></h2>
        <p>七大模块是「地图」，下面一门课与三本书是「水源」。<b>点击任意卡片</b>查看核心要点、图解与入门建议。</p>
      </div>
    </div>
    <div class="fe-grid" id="flExtGrid"></div>
  </section>

  <div class="fl-mask" id="flModalMask" hidden>
    <div class="fl-modal" role="dialog" aria-label="资源详情">
      <button class="fl-m-close" id="flModalClose" aria-label="关闭">✕</button>
      <div id="flModalContent"></div>
    </div>
  </div>`;

  /* ============================================================
   * 渲染：测验 / 清单 / 延伸
   * ============================================================ */
  let quizAnswered = 0, quizRight = 0;

  function renderQuiz(){
    const box = $("flQuizBox");
    if (!box) return;
    box.innerHTML = QUIZ.map((item, qi) => `
      <div class="fq-card">
        <div class="fq-q"><span class="qn">Q${qi+1}</span>${item.q}</div>
        <div class="fq-opts">
          ${item.opts.map((o, oi) => `<button class="fq-opt" data-q="${qi}" data-o="${oi}">${String.fromCharCode(65+oi)}. ${o}</button>`).join("")}
        </div>
        <div class="fq-why" id="flWhy${qi}"><b>解析：</b>${item.why}</div>
      </div>`).join("");
    box.querySelectorAll(".fq-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const qi = +btn.dataset.q, oi = +btn.dataset.o;
        const card = btn.closest(".fq-card");
        if (card.dataset.done) return;
        card.dataset.done = "1";
        quizAnswered++;
        if (oi === QUIZ[qi].a){ quizRight++; btn.classList.add("correct"); }
        else {
          btn.classList.add("wrong");
          card.querySelector(`.fq-opt[data-o="${QUIZ[qi].a}"]`).classList.add("correct");
        }
        card.querySelectorAll(".fq-opt").forEach(b => b.disabled = true);
        $("flWhy" + qi).classList.add("show");
        if (quizAnswered === QUIZ.length){
          const s = $("flQuizScore");
          s.innerHTML = `得分：${quizRight} / ${QUIZ.length} · ` + (quizRight === 3 ? "满分！你的认知框架已经上线 🎉" : quizRight >= 2 ? "不错，回去把错题的模块再点开看看 👀" : "建议重走一遍投资认知框架，重点看解析 📚");
          s.classList.add("show");
        }
      });
    });
  }

  function renderChecks(){
    const box = $("flChecklist");
    if (!box) return;
    box.innerHTML = CHECKS.map((c, i) => `
      <div class="fa-item" data-i="${i}">
        <div class="fa-box">✓</div><div class="fa-ct">${c}</div>
      </div>`).join("");
    box.querySelectorAll(".fa-item").forEach(el => {
      el.addEventListener("click", () => {
        el.classList.toggle("done");
        const doneCount = box.querySelectorAll(".done").length;
        $("flCheckCount").textContent = doneCount;
        $("flCheckBar").style.width = (doneCount / CHECKS.length * 100) + "%";
        $("flCheer").textContent =
          doneCount === CHECKS.length ? "全部完成——雪球已经全速滚动 🎉" : doneCount >= 3 ? "进度过半，习惯正在形成 💪" : "滚雪球的第一步，是让雪球开始滚。";
      });
    });
  }

  function renderExt(){
    const box = $("flExtGrid");
    if (!box) return;
    box.innerHTML = RESOURCES.map((r, i) => `
      <div class="fe-card" data-i="${i}">
        <div class="fe-icon">${r.icon}</div>
        <div>
          <h3>${r.title}</h3>
          <div class="fe-author">${r.author}</div>
          <div class="fe-brief">${r.brief}</div>
        </div>
      </div>`).join("");
    box.querySelectorAll(".fe-card").forEach(c => {
      c.addEventListener("click", () => openResDetail(+c.dataset.i));
    });
  }

  function openResDetail(i){
    const item = RESOURCES[i];
    if (!item) return;
    $("flModalContent").innerHTML = `
      <div class="fl-m-num">${item.num}</div>
      <h3>${item.title}</h3>
      <div class="fl-m-tagline">${item.tagline}</div>
      <div class="fl-m-body">${item.body}</div>
      <div class="fl-m-quote">${item.quote}</div>
      <div class="fl-m-diagram">${DIAGRAMS[item.diagram]()}</div>
      ${item.formula ? `<div class="fl-m-formula"><span class="f">${item.formula}</span></div>` : ""}
      <div class="fl-m-action"><b>普通人怎么做 →</b> ${item.action}</div>`;
    $("flModalMask").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    $("flModalMask").hidden = true;
    document.body.style.overflow = "";
  }

  /* ============================================================
   * 对外接口
   * ============================================================ */
  function mount(root, opts = {}){
    if (!root) return;
    root.innerHTML = SECTIONS_HTML;

    // 实验室 Tab
    root.querySelectorAll(".fl-tab").forEach(t => {
      t.addEventListener("click", () => {
        root.querySelectorAll(".fl-tab").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        root.querySelectorAll(".fl-panel").forEach(p => p.classList.remove("show"));
        const panel = root.querySelector("#fl-tab-" + t.dataset.tab);
        panel.classList.add("show");
      });
    });

    // 计算器
    ["flInP","flInM","flInR","flInN","flInI"].forEach(id => $(id).addEventListener("input", drawCompound));
    drawCompound();
    ["flInPk","flInBk"].forEach(id => $(id).addEventListener("input", drawKelly));
    drawKelly();

    // 其余区块
    renderQuiz();
    renderChecks();
    renderExt();

    // 弹窗
    $("flModalClose").addEventListener("click", closeModal);
    $("flModalMask").addEventListener("click", e => { if (e.target === e.currentTarget) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("flModalMask").hidden) closeModal(); });

    // 雪球动画
    startSnowball();
  }

  function dispose(){
    stopSnowball();
    quizAnswered = 0; quizRight = 0;
  }

  return { mount, dispose };
})();

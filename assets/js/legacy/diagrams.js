/* ============================================================
 * 图解层：全部 SVG 图解生成器（模块图解 + 资源图解）
 * 文件：js/diagrams.js
 * ============================================================ */

function svgWrap(inner, vb="0 0 720 300"){
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" font-family="PingFang SC,Microsoft YaHei,sans-serif">
    <style>
      .t{fill:#dbe4f0;font-size:13px}.ts{fill:#8b98ad;font-size:11px}
      .g{fill:#34d399;font-size:12px;font-weight:700}.r{fill:#f87171;font-size:12px;font-weight:700}
      .go{fill:#f5c451;font-size:12px;font-weight:700}
    </style>${inner}</svg>`;
}

const DIAGRAMS = {

  /* ---------- 模块 01：期望值光谱 ---------- */
  spectrum: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">期望值光谱：钱流向正期望的一侧</text>
    <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f87171"/><stop offset=".5" stop-color="#5b6b85"/><stop offset="1" stop-color="#34d399"/>
    </linearGradient></defs>
    <rect x="60" y="150" width="600" height="26" rx="13" fill="url(#sg)"/>
    <text x="60" y="140" class="r">负期望 · 必输</text>
    <text x="660" y="140" text-anchor="end" class="g">正期望 · 可赢</text>
    ${[
      {x:110,label:"轮盘赌",v:"−5.3%",c:"#f87171"},
      {x:250,label:"彩票",v:"−50%",c:"#f87171"},
      {x:390,label:"猜硬币",v:"0%",c:"#8b98ad"},
      {x:530,label:"优质股权",v:"+7%",c:"#34d399"},
      {x:640,label:"指数定投",v:"+8%",c:"#34d399"}
    ].map(d=>`
      <line x1="${d.x}" y1="150" x2="${d.x}" y2="176" stroke="${d.c}" stroke-width="2"/>
      <circle cx="${d.x}" cy="176" r="5" fill="${d.c}"/>
      <text x="${d.x}" y="200" text-anchor="middle" class="t">${d.label}</text>
      <text x="${d.x}" y="216" text-anchor="middle" style="fill:${d.c};font-size:12px;font-weight:700">${d.v}</text>`).join("")}
    <text x="360" y="262" text-anchor="middle" class="ts">同样有风险，方向相反：赌场把负期望卖给你，市场把正期望租给你</text>`),

  /* ---------- 模块 02：复利曲线 ---------- */
  compound: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">10 万元本金：单利 vs 复利（年化 8%）</text>
    <line x1="70" y1="250" x2="690" y2="250" stroke="#2a3550"/>
    <line x1="70" y1="40" x2="70" y2="250" stroke="#2a3550"/>
    <path id="cline" d="M70 250 C 200 235, 420 200, 690 130" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="5 6"/>
    <path id="epath" d="M70 250 C 250 235, 450 180, 690 60" fill="none" stroke="#f5c451" stroke-width="3.5"/>
    <text x="500" y="80" class="go">复利指数曲线</text>
    <text x="520" y="150" style="fill:#2dd4bf;font-size:12px">单利直线</text>
    <text x="70" y="275" class="ts">第0年</text>
    <text x="660" y="275" class="ts">第40年</text>
    <text x="360" y="290" text-anchor="middle" class="ts">阴影差距 = 时间的礼物：40 年后复利约为单利的 2.6 倍</text>
    <animate xlink:href="#epath" attributeName="stroke-dasharray" from="0 1200" to="1200 0" dur="2s" fill="freeze"/>
    <animate xlink:href="#cline" attributeName="stroke-dasharray" from="0 1200" to="5 6" dur="1.6s" fill="freeze"/>`),

  /* ---------- 模块 03：大数定律 ---------- */
  lln: () => svgWrap(`
    <text x="180" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">大数定律：频率收敛于概率</text>
    <line x1="40" y1="160" x2="340" y2="160" stroke="#2a3550" stroke-dasharray="4 5"/>
    <text x="40" y="150" class="ts">50% 期望线</text>
    <path d="M40 60 L60 200 L80 110 L100 175 L120 130 L140 165 L160 140 L180 155 L200 148 L220 152 L240 146 L260 150 L280 149 L300 151 L320 150 L340 150"
      fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="40" y="40" class="ts">抛硬币正面频率（前 340 次）</text>
    <text x="40" y="240" class="ts">次数越多，越接近 50%</text>
    <line x1="380" y1="30" x2="380" y2="270" stroke="#2a3550"/>
    <text x="550" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">1000 局后的资金曲线</text>
    <path d="M390 250 L 690 60" fill="none" stroke="#34d399" stroke-width="3"/>
    <text x="560" y="80" class="g">赌场（微弱正期望）</text>
    <path d="M390 250 L 680 235" fill="none" stroke="#f87171" stroke-width="3" stroke-dasharray="6 5"/>
    <text x="540" y="225" class="r">玩家（负期望）</text>
    <text x="390" y="268" class="ts">起点</text>
    <text x="550" y="290" text-anchor="middle" class="ts">波动互相抵消，期望留下——把这条曲线换成投资者</text>`),

  /* ---------- 模块 04：有效前沿 ---------- */
  risk: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">风险 - 收益平面与有效前沿</text>
    <line x1="70" y1="260" x2="690" y2="260" stroke="#2a3550"/>
    <line x1="70" y1="40" x2="70" y2="260" stroke="#2a3550"/>
    <text x="380" y="288" text-anchor="middle" class="ts">风险 σ（波动）→</text>
    <text x="46" y="150" class="ts" transform="rotate(-90 46 150)">收益 →</text>
    <path d="M110 250 Q 300 90 620 60" fill="none" stroke="#f5c451" stroke-width="2.5" stroke-dasharray="6 6"/>
    <text x="560" y="55" class="go">有效前沿</text>
    ${[
      {x:140,y:225,n:"国债",c:"#60a5fa"},
      {x:260,y:190,n:"蓝筹股",c:"#2dd4bf"},
      {x:300,y:110,n:"科技股",c:"#34d399"},
      {x:420,y:230,n:"垃圾债",c:"#f87171"},
      {x:480,y:170,n:"加密资产",c:"#f87171"},
      {x:340,y:150,n:"最优组合",c:"#f5c451"}
    ].map(d=>`<circle cx="${d.x}" cy="${d.y}" r="6" fill="${d.c}"/><text x="${d.x+10}" y="${d.y+4}" class="t">${d.n}</text>`).join("")}
    <defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#34d399"/></marker></defs>
    <path d="M300 110 L 340 150" stroke="#34d399" stroke-width="2" marker-end="url(#ar2)"/>
    <text x="360" y="140" class="g">同样的收益，更低波动</text>
    <text x="360" y="275" text-anchor="middle" class="ts">左上角区域更优——风险调整后收益才是真收益</text>`),

  /* ---------- 模块 05：分散投资 ---------- */
  diversify: () => svgWrap(`
    <text x="180" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">单一资产：大起大落</text>
    <path d="M40 150 L60 90 L80 180 L100 60 L120 210 L140 80 L160 200 L180 100 L200 220 L220 90 L240 190 L260 110 L280 230 L300 80 L320 180"
      fill="none" stroke="#f87171" stroke-width="2.5"/>
    <text x="180" y="260" text-anchor="middle" class="ts">一次暴雷 = 满盘皆输</text>
    <line x1="360" y1="30" x2="360" y2="270" stroke="#2a3550"/>
    <text x="540" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">分散组合：平滑向前</text>
    <path d="M390 160 L410 140 L430 170 L450 130 L470 165 L490 135 L510 160 L530 130 L550 155 L570 135 L590 150 L610 130 L630 145 L650 135 L670 140"
      fill="none" stroke="#34d399" stroke-width="3"/>
    <text x="540" y="200" text-anchor="middle" class="g">波动 −50%，收益几乎不变</text>
    <text x="540" y="222" text-anchor="middle" class="ts">相关系数 ρ 越低，平滑效果越强</text>
    <defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5c451"/></marker></defs>
    <path d="M330 140 L 370 140" stroke="#f5c451" stroke-width="2.5" marker-end="url(#ar3)"/>
    <text x="350" y="125" text-anchor="middle" class="go">低相关</text>
    <text x="360" y="290" text-anchor="middle" class="ts">马科维茨：免费午餐 = 不牺牲收益的前提下降低风险</text>`),

  /* ---------- 模块 06：凯利曲线 ---------- */
  kelly: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">仓位比例 vs 长期资本增长率（p=60%, b=1）</text>
    <line x1="70" y1="260" x2="690" y2="260" stroke="#2a3550"/>
    <line x1="70" y1="40" x2="70" y2="260" stroke="#2a3550"/>
    <text x="380" y="288" text-anchor="middle" class="ts">下注比例 f →</text>
    <path d="M70 240 C 200 200, 250 80, 330 70 C 420 62, 520 160, 690 258" fill="none" stroke="#f5c451" stroke-width="3"/>
    <line x1="330" y1="70" x2="330" y2="260" stroke="#34d399" stroke-width="2" stroke-dasharray="5 5"/>
    <circle cx="330" cy="70" r="7" fill="#34d399"/>
    <text x="330" y="52" text-anchor="middle" class="g">峰值 f* = 20%</text>
    <rect x="70" y="60" width="260" height="200" fill="rgba(96,165,250,.06)"/>
    <text x="200" y="90" text-anchor="middle" class="ts" style="fill:#60a5fa">保守区：增长未释放</text>
    <rect x="390" y="60" width="300" height="200" fill="rgba(248,113,113,.07)"/>
    <text x="540" y="90" text-anchor="middle" class="r">危险区：一次连败即出局</text>
    <text x="330" y="280" text-anchor="middle" class="go">凯利最优</text>
    <text x="360" y="300" text-anchor="middle" class="ts">越过峰值继续加注，长期增长率不升反降——正期望 + 重仓 = 慢性破产</text>`),

  /* ---------- 模块 07：情绪周期 ---------- */
  behavior: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">市场情绪周期 vs 理性定投</text>
    <path d="M50 180 C 120 60, 200 60, 260 150 C 300 210, 340 240, 400 170 C 450 110, 520 90, 580 160 C 630 215, 670 230, 690 200"
      fill="none" stroke="#f87171" stroke-width="2.5" opacity=".85"/>
    <circle cx="240" cy="75" r="7" fill="#f87171"/><text x="240" y="58" text-anchor="middle" class="r">贪婪顶 · 大众买入</text>
    <circle cx="400" cy="238" r="7" fill="#60a5fa"/><text x="400" y="262" text-anchor="middle" style="fill:#60a5fa;font-size:12px;font-weight:700">恐惧底 · 大众割肉</text>
    <path d="M50 250 L 690 60" fill="none" stroke="#34d399" stroke-width="3"/>
    <text x="560" y="90" class="g">纪律路线性向上</text>
    <text x="360" y="290" text-anchor="middle" class="ts">高点低点的钟摆永远摆动，规则让你不参与这场情绪过山车</text>`),

  /* ============================================================
   * 延伸学习资源图解
   * ============================================================ */

  /* ---------- E1：MIT 课程主线 ---------- */
  course: () => svgWrap(`
    <defs><marker id="ar4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5c451"/></marker></defs>
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
      ${i<4?`<path d="M${d.x+64} 123 H ${d.x+78}" stroke="#f5c451" stroke-width="2" marker-end="url(#ar4)"/>`:""}
    `).join("")}
    <text x="360" y="208" text-anchor="middle" class="ts">每一讲都是下一讲的地基：现值 → 资产定价 → 组合 → 衍生品</text>
    <rect x="190" y="228" width="340" height="52" rx="10" fill="rgba(255,255,255,.04)" stroke="#2a3550"/>
    <text x="360" y="250" text-anchor="middle" style="fill:#f5c451;font-size:15px;font-weight:800;font-family:Georgia,serif">"Mathematics + $$ = Finance"</text>
    <text x="360" y="270" text-anchor="middle" class="ts">—— Andrew Lo 的开篇第一页幻灯片</text>`),

  /* ---------- E2：Thorp 时间线 ---------- */
  thorp: () => svgWrap(`
    <text x="360" y="24" text-anchor="middle" class="t" style="font-size:14px;font-weight:700">Edward Thorp：从赌场到华尔街</text>
    <line x1="80" y1="160" x2="640" y2="160" stroke="#f5c451" stroke-width="2.5"/>
    <defs><marker id="ar5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5c451"/></marker></defs>
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
      ${i<3?`<path d="M${d.x+12} 160 H ${d.x+76}" stroke="#f5c451" stroke-width="2" marker-end="url(#ar5)"/>`:""}
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

/* ============================================================
 * 图解生成库：把「图解数据」渲染为 SVG
 * 文件：assets/js/lib/diagram-lib.js
 *
 * 设计目标：内容与代码分离。
 *   - 新增一张图解 = 在 catalog-figures.js 里加一条数据
 *   - 图解类型（type）与数据（data）由本库渲染
 *
 * 支持类型：
 *   concept-map  中心辐射概念图      flow     流程图（支持循环回流）
 *   compare      双栏对比            layers   分层架构
 *   hierarchy    金字塔层级          timeline 时间轴
 *   cycle        循环图              matrix   2×2 矩阵
 *   plot         折线图（多序列）     tree     树形分类
 *   scale        光谱/标尺           bars     条形图
 *   venn         韦恩图              cards    要点卡片
 * ============================================================ */

const DiagramLib = (() => {

  const FONT = "PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif";
  const C = {
    text:"#dbe4f0", sub:"#8b98ad", strong:"#eef3fa",
    gold:"#f5c451", teal:"#2dd4bf", green:"#34d399",
    red:"#f87171", blue:"#60a5fa", purple:"#a78bfa",
    orange:"#fb923c", line:"#2a3550"
  };
  const PAL = [C.blue, C.teal, C.green, C.gold, C.orange, C.purple, C.red];

  const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  function open(vb){
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" font-family="${FONT}" class="dlg" role="img">
  <style>
    .t{fill:${C.text};font-size:13px}.ts{fill:${C.sub};font-size:11px}
    .tt{fill:${C.strong};font-size:15px;font-weight:700}
    .tb{fill:${C.strong};font-size:12.5px;font-weight:700}
  </style>
  <defs>
    <marker id="ag"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.gold}"/></marker>
    <marker id="at"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.teal}"/></marker>
    <marker id="agr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.green}"/></marker>
    <marker id="ar"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.red}"/></marker>
    <marker id="ab"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.blue}"/></marker>
  </defs>`;
  }

  /* 支持 \n 换行的文本 */
  function txt(x, y, str, cls="t", anchor="start"){
    const lines = String(str ?? "").split("\n");
    if (lines.length === 1)
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(str)}</text>`;
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">` +
      lines.map((l,i)=>`<tspan x="${x}" dy="${i?15:0}">${esc(l)}</tspan>`).join("") + `</text>`;
  }
  function title(t, x=380, y=26){
    return t ? txt(x, y, t, "tt", "middle") : "";
  }
  function arrow(x1,y1,x2,y2,color="ag",dash=""){
    const d = dash ? ` stroke-dasharray="${dash}"` : "";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color==="ag"?C.gold:color==="at"?C.teal:color==="agr"?C.green:color==="ar"?C.red:C.blue}" stroke-width="2"${d} marker-end="url(#${color})"/>`;
  }

  /* ============ 各类图解渲染器 ============ */
  const R = {};

  /* ---- 中心辐射概念图 ---- */
  R["concept-map"] = d => {
    const nodes = d.nodes || [], n = nodes.length;
    const cx = 380, cy = 205;
    const rx = n > 6 ? 300 : 262, ry = n > 6 ? 158 : 138;
    let s = title(d.title);
    nodes.forEach((nd,i)=>{
      const a = -Math.PI/2 + i * 2*Math.PI/n;
      const x = cx + rx*Math.cos(a), y = cy + ry*Math.sin(a);
      const col = PAL[i % PAL.length];
      s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${C.line}" stroke-width="1.6"/>`;
      s += `<circle cx="${x}" cy="${y}" r="48" fill="rgba(255,255,255,.05)" stroke="${col}" stroke-width="1.6"/>`;
      s += txt(x, y+5, nd.label, "tb", "middle");
      if (nd.sub) s += txt(x, y+64, nd.sub, "ts", "middle");
    });
    s += `<circle cx="${cx}" cy="${cy}" r="64" fill="rgba(245,196,81,.12)" stroke="${C.gold}" stroke-width="2"/>`;
    s += txt(cx, cy-2, d.center?.label ?? "", "tt", "middle");
    if (d.center?.sub) s += txt(cx, cy+20, d.center.sub, "ts", "middle");
    return open("0 0 760 410") + s + `</svg>`;
  };

  /* ---- 流程图（每行 3 步，蛇形回流） ---- */
  R["flow"] = d => {
    const steps = d.steps || [];
    const per = steps.length > 3 ? 3 : steps.length;
    const xs = per === 3 ? [140, 380, 620] : (per === 2 ? [250, 510] : [380]);
    const rows = [];
    for (let i=0;i<steps.length;i+=per) rows.push(steps.slice(i, i+per));
    let s = title(d.title);
    rows.forEach((row, ri)=>{
      const y = ri === 0 ? 150 : 300;
      row.forEach((st, ci)=>{
        const x = xs[ci];
        s += `<rect x="${x-95}" y="${y-33}" width="190" height="66" rx="14" fill="rgba(255,255,255,.05)" stroke="${C.line}" stroke-width="1.5"/>`;
        s += txt(x, y-8, st.title, "tb", "middle");
        if (st.sub) s += txt(x, y+16, st.sub, "ts", "middle");
        if (ci < row.length-1) s += arrow(x+95, y, x+145, y);
      });
      if (ri < rows.length-1){
        const lx = xs[row.length-1], fx = xs[0];
        s += `<path d="M${lx} ${y+33} V 252 H ${fx} V ${y+100}" fill="none" stroke="${C.teal}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#at)"/>`;
        s += txt((lx+fx)/2, 246, "下一阶段", "ts", "middle");
      }
    });
    if (d.loop) s += txt(380, 362, d.loop, "ts", "middle");
    return open("0 0 760 380") + s + `</svg>`;
  };

  /* ---- 双栏对比 ---- */
  R["compare"] = d => {
    const cols = [d.left, d.right].filter(Boolean);
    let s = title(d.title);
    cols.forEach((col, i)=>{
      const x = i === 0 ? 40 : 400, w = 320;
      const col2 = col.color || PAL[i*2 % PAL.length];
      s += `<rect x="${x}" y="52" width="${w}" height="308" rx="16" fill="rgba(255,255,255,.035)" stroke="${C.line}" stroke-width="1.5"/>`;
      s += `<rect x="${x}" y="52" width="${w}" height="42" rx="16" fill="${col2}" opacity=".16"/>`;
      s += `<line x1="${x}" y1="94" x2="${x+w}" y2="94" stroke="${col2}" stroke-width="1.5"/>`;
      s += txt(x + w/2, 80, col.title, "tb", "middle");
      (col.items || []).slice(0,5).forEach((it, j)=>{
        const y = 118 + j*48;
        s += txt(x+18, y, it.k, "ts");
        s += txt(x+18, y+20, it.v, "t");
        if (j < (col.items||[]).length-1) s += `<line x1="${x+14}" y1="${y+34}" x2="${x+w-14}" y2="${y+34}" stroke="${C.line}" stroke-width="1" stroke-dasharray="3 5"/>`;
      });
    });
    if (d.note) s += txt(380, 382, d.note, "ts", "middle");
    return open("0 0 760 396") + s + `</svg>`;
  };

  /* ---- 分层架构 ---- */
  R["layers"] = d => {
    const layers = d.layers || [];
    let s = title(d.title);
    layers.slice(0,6).forEach((L, i)=>{
      const y = 58 + i*56, col = PAL[i % PAL.length];
      s += `<rect x="130" y="${y}" width="500" height="46" rx="12" fill="${col}" opacity="${0.2 - i*0.015}" stroke="${col}" stroke-width="1.4"/>`;
      s += txt(152, y+29, L.name, "tb");
      if (L.desc) s += txt(612, y+29, L.desc, "ts", "end");
      if (L.tags) s += txt(152, y+43, L.tags.join(" · "), "ts");
    });
    if (layers.length > 1){
      s += `<path d="M84 66 V ${58 + (layers.length-1)*56 + 36}" stroke="${C.gold}" stroke-width="2" marker-end="url(#ag)" marker-start="url(#ag)"/>`;
      s += txt(72, 60 + (layers.length-1)*28, "上层\n依赖\n下层", "ts", "middle");
    }
    return open("0 0 760 400") + s + `</svg>`;
  };

  /* ---- 金字塔层级（第 0 级在底部） ---- */
  R["hierarchy"] = d => {
    const lv = d.levels || [], n = lv.length;
    let s = title(d.title);
    lv.forEach((L, i)=>{
      const w = 190 + i*112, h = 46, cx = 320;
      const y = 348 - (n-1-i)*(h+9);
      const col = PAL[(n-1-i) % PAL.length];
      s += `<rect x="${cx-w/2}" y="${y}" width="${w}" height="${h}" rx="12" fill="${col}" opacity="${0.14 + i*0.05}" stroke="${col}" stroke-width="1.5"/>`;
      s += txt(cx, y+29, L.name, "tb", "middle");
      s += `<line x1="${cx+w/2}" y1="${y+h/2}" x2="${cx+w/2+26}" y2="${y+h/2}" stroke="${col}" stroke-width="1.4"/>`;
      s += txt(cx+w/2+34, y+h/2-2, L.desc, "t");
    });
    if (d.note) s += txt(380, 382, d.note, "ts", "middle");
    return open("0 0 760 396") + s + `</svg>`;
  };

  /* ---- 时间轴 ---- */
  R["timeline"] = d => {
    const ev = d.events || [];
    let s = title(d.title);
    s += `<line x1="80" y1="205" x2="680" y2="205" stroke="${C.line}" stroke-width="2"/>`;
    s += `<path d="M680 205 l-10 -5 v10 z" fill="${C.gold}"/>`;
    ev.slice(0,6).forEach((e, i)=>{
      const x = 80 + i*(600/Math.max(ev.length-1,1));
      const up = i % 2 === 0;
      const col = PAL[i % PAL.length];
      s += `<circle cx="${x}" cy="205" r="6" fill="${col}"/>`;
      if (up){
        s += `<line x1="${x}" y1="199" x2="${x}" y2="160" stroke="${col}" stroke-width="1.4"/>`;
        s += txt(x, 78, e.time, "tb", "middle");
        s += txt(x, 98, e.title, "t", "middle");
        if (e.desc) s += txt(x, 116, e.desc, "ts", "middle");
      } else {
        s += `<line x1="${x}" y1="211" x2="${x}" y2="250" stroke="${col}" stroke-width="1.4"/>`;
        s += txt(x, 272, e.time, "tb", "middle");
        s += txt(x, 292, e.title, "t", "middle");
        if (e.desc) s += txt(x, 310, e.desc, "ts", "middle");
      }
    });
    return open("0 0 760 340") + s + `</svg>`;
  };

  /* ---- 循环图 ---- */
  R["cycle"] = d => {
    const steps = d.steps || [], n = steps.length;
    const cx = 380, cy = 200, r = 128;
    let s = title(d.title);
    if (d.center) s += txt(cx, cy+5, d.center, "tb", "middle");
    steps.forEach((st, i)=>{
      const a = -Math.PI/2 + i * 2*Math.PI/n;
      const x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
      const col = PAL[i % PAL.length];
      s += `<rect x="${x-62}" y="${y-24}" width="124" height="48" rx="12" fill="rgba(255,255,255,.05)" stroke="${col}" stroke-width="1.6"/>`;
      s += txt(x, y-4, st.title, "tb", "middle");
      if (st.desc) s += txt(x, y+14, st.desc, "ts", "middle");
      const a2 = -Math.PI/2 + ((i+1) % n) * 2*Math.PI/n;
      const x2 = cx + r*Math.cos(a2), y2 = cy + r*Math.sin(a2);
      if (n > 2){
        const m = 0.62;
        const mx = cx + r*m*Math.cos((a+a2)/2 + (2*Math.PI/n)*0.42);
        const my = cy + r*m*Math.sin((a+a2)/2 + (2*Math.PI/n)*0.42);
        s += `<path d="M${x + 46*Math.cos(a+Math.PI/2)} ${y + 46*Math.sin(a+Math.PI/2)} Q ${mx} ${my} ${x2 - 46*Math.cos(a2+Math.PI/2)} ${y2 - 46*Math.sin(a2+Math.PI/2)}" fill="none" stroke="${C.gold}" stroke-width="1.8" marker-end="url(#ag)" opacity=".85"/>`;
      }
    });
    return open("0 0 760 400") + s + `</svg>`;
  };

  /* ---- 2×2 矩阵 ---- */
  R["matrix"] = d => {
    const q = d.quadrants || [];
    const pos = { tl:{x:90,y:56}, tr:{x:430,y:56}, bl:{x:90,y:226}, br:{x:430,y:226} };
    let s = title(d.title);
    q.forEach(item=>{
      const p = pos[item.pos] || pos.tl, col = item.color || C.gold;
      s += `<rect x="${p.x}" y="${p.y}" width="240" height="150" rx="14" fill="${col}" opacity=".08" stroke="${col}" stroke-width="1.5"/>`;
      s += txt(p.x+16, p.y+34, item.title, "tb");
      s += txt(p.x+16, p.y+62, item.desc, "ts");
    });
    s += `<line x1="90" y1="56" x2="90" y2="376" stroke="${C.line}" stroke-width="1.5"/>`;
    s += `<line x1="90" y1="376" x2="670" y2="376" stroke="${C.line}" stroke-width="1.5"/>`;
    s += txt(380, 398, d.axes?.x || "", "ts", "middle");
    s += `<text x="66" y="216" class="ts" text-anchor="middle" transform="rotate(-90 66 216)">${esc(d.axes?.y || "")}</text>`;
    return open("0 0 760 410") + s + `</svg>`;
  };

  /* ---- 折线图 ---- */
  R["plot"] = d => {
    const series = d.series || [];
    const x0=70, x1=720, y0=44, y1=290;
    let vmax = 0, vmin = d.yMin ?? 0;
    series.forEach(s2=>(s2.values||[]).forEach(v=>{ if(v>vmax) vmax=v; if(v<vmin) vmin=v; }));
    if (vmax === vmin) vmax = vmin + 1;
    const m = Math.max(...series.map(s2=>(s2.values||[]).length));
    const X = i => x0 + i*(x1-x0)/Math.max(m-1,1);
    const Y = v => y1 - (v - vmin)*(y1-y0)/(vmax - vmin);
    let s = title(d.title);
    for (let g=0; g<=4; g++){
      const gy = y0 + g*(y1-y0)/4;
      s += `<line x1="${x0}" y1="${gy}" x2="${x1}" y2="${gy}" stroke="${C.line}" stroke-width="1" stroke-dasharray="${g===4?"":"3 6"}"/>`;
    }
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${C.line}" stroke-width="1.5"/>`;
    series.forEach(sr=>{
      const vals = sr.values || [];
      const pts = vals.map((v,i)=>`${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" L ");
      s += `<path d="M ${pts}" fill="none" stroke="${sr.color||C.gold}" stroke-width="3" stroke-linecap="round"/>`;
      vals.forEach((v,i)=>{ s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.4" fill="${sr.color||C.gold}"/>`; });
    });
    (d.notes||[]).forEach(nt=>{
      const nx = X(nt.i ?? 0), ny = Y(nt.y ?? vmax);
      s += `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="6" fill="none" stroke="${C.red}" stroke-width="2"/>`;
      s += txt(nx.toFixed(1), ny-14, nt.label, "ts", "middle");
    });
    s += txt((x0+x1)/2, 330, d.xLabel || "", "ts", "middle");
    s += `<text x="52" y="${(y0+y1)/2}" class="ts" text-anchor="middle" transform="rotate(-90 52 ${(y0+y1)/2})">${esc(d.yLabel || "")}</text>`;
    series.forEach((sr,i)=>{
      const lx = 120 + i*140;
      s += `<line x1="${lx}" y1="356" x2="${lx+26}" y2="356" stroke="${sr.color||C.gold}" stroke-width="3.5"/>`;
      s += txt(lx+34, 360, sr.name, "ts");
    });
    return open("0 0 760 380") + s + `</svg>`;
  };

  /* ---- 树形分类 ---- */
  R["tree"] = d => {
    let leaf = 0;
    const walk = (nd, depth)=>{
      nd._x = null; nd._d = depth;
      if (!nd.children || !nd.children.length){ nd._leaf = leaf++; }
      else { nd.children.forEach(c=>walk(c, depth+1)); nd._leaf = (nd.children[0]._leaf + nd.children[nd.children.length-1]._leaf)/2; }
    };
    const roots = d.children || [];
    roots.forEach(r=>walk(r, 0));
    const N = Math.max(leaf, 1);
    const X = i => 80 + i*(600/Math.max(N-1,1));
    const Y = dep => 74 + dep*92;
    let s = title(d.title);
    if (d.root) s += txt(380, 42, d.root.label, "tt", "middle");
    const draw = (nd, parent)=>{
      const x = X(nd._leaf), y = Y(nd._d);
      if (parent){
        const px = X(parent._leaf), py = Y(parent._d);
        s += `<path d="M${px} ${py+8} V ${(py+y)/2} H ${x} V ${y-8}" fill="none" stroke="${C.line}" stroke-width="1.6"/>`;
      }
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="${PAL[nd._d % PAL.length]}"/>`;
      s += txt(x, y+24, nd.label, "t", "middle");
      (nd.children||[]).forEach(c=>draw(c, nd));
    };
    roots.forEach(r=>draw(r, null));
    return open("0 0 760 400") + s + `</svg>`;
  };

  /* ---- 光谱 / 标尺 ---- */
  R["scale"] = d => {
    let s = title(d.title);
    s += `<defs><linearGradient id="scg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.red}"/><stop offset=".5" stop-color="#5b6b85"/><stop offset="1" stop-color="${C.green}"/>
    </linearGradient></defs>`;
    s += `<rect x="80" y="180" width="600" height="24" rx="12" fill="url(#scg)"/>`;
    if (d.min) s += txt(80, 168, d.min, "ts");
    if (d.max) s += txt(680, 168, d.max, "ts", "end");
    (d.markers||[]).slice(0,6).forEach((mk,i)=>{
      const x = 80 + (mk.at ?? 50)*6;
      const up = i % 2 === 0;
      const col = mk.color || PAL[i % PAL.length];
      s += `<line x1="${x}" y1="${up?176:208}" x2="${x}" y2="${up?140:244}" stroke="${col}" stroke-width="2"/>`;
      s += `<circle cx="${x}" cy="192" r="5" fill="${col}"/>`;
      s += txt(x, up?128:262, mk.label, "tb", "middle");
      if (mk.sub) s += txt(x, up?114:278, mk.sub, "ts", "middle");
    });
    if (d.note) s += txt(380, 330, d.note, "ts", "middle");
    return open("0 0 760 350") + s + `</svg>`;
  };

  /* ---- 条形图 ---- */
  R["bars"] = d => {
    const items = d.items || [];
    const max = d.max ?? Math.max(...items.map(i=>i.value||0), 1);
    let s = title(d.title);
    items.slice(0,6).forEach((it,i)=>{
      const y = 64 + i*52, w = Math.max((it.value||0)/max*520, 4);
      const col = it.color || PAL[i % PAL.length];
      s += txt(88, y+18, it.label, "t", "end");
      s += `<rect x="100" y="${y}" width="${w.toFixed(1)}" height="30" rx="8" fill="${col}" opacity=".75"/>`;
      s += txt(100 + w + 10, y+20, `${it.value}${d.unit||""}`, "tb");
      if (it.sub) s += txt(100 + w + 10, y+34, it.sub, "ts");
    });
    if (d.note) s += txt(380, 386, d.note, "ts", "middle");
    return open("0 0 760 400") + s + `</svg>`;
  };

  /* ---- 韦恩图 ---- */
  R["venn"] = d => {
    const sets = d.sets || [];
    const pos = [{x:320,y:195},{x:445,y:195},{x:382,y:290}];
    let s = title(d.title);
    sets.slice(0,3).forEach((st,i)=>{
      const p = pos[i], col = st.color || PAL[i*2 % PAL.length];
      s += `<circle cx="${p.x}" cy="${p.y}" r="105" fill="${col}" opacity=".14" stroke="${col}" stroke-width="1.8"/>`;
      s += txt(p.x, p.y - (i===2? -66 : 88), st.label, "tb", "middle");
    });
    if (d.center) s += txt(sets.length>2?382:382, 195, d.center.label, "tt", "middle");
    if (d.note) s += txt(380, 340, d.note, "ts", "middle");
    return open("0 0 760 360") + s + `</svg>`;
  };

  /* ---- 要点卡片 ---- */
  R["cards"] = d => {
    const items = d.items || [];
    let s = title(d.title);
    items.slice(0,6).forEach((it,i)=>{
      const col = i % 3, row = Math.floor(i/3);
      const x = 40 + col*230, y = 62 + row*152;
      const cc = PAL[i % PAL.length];
      s += `<rect x="${x}" y="${y}" width="212" height="136" rx="16" fill="rgba(255,255,255,.04)" stroke="${cc}" stroke-width="1.4"/>`;
      if (it.icon) s += txt(x+18, y+38, it.icon, "t", "start");
      s += txt(x+18, y+68, it.title, "tb");
      s += txt(x+18, y+90, it.desc, "ts");
    });
    return open("0 0 760 380") + s + `</svg>`;
  };

  /* 统一入口：根据图解数据渲染 SVG 字符串 */
  function render(fig){
    const fn = R[fig?.type] || R["cards"];
    return fn(fig?.data || {});
  }

  /* 课程封面：由课程 id 生成确定性几何图案（无需外部图片） */
  function cover(course, w=400, h=210){
    const seed = [...String(course?.id || "x")].reduce((a,ch)=>a+ch.charCodeAt(0), 0);
    const rnd = (n)=>{ const x = Math.sin(seed + n*77.7)*43758.5453; return x - Math.floor(x); };
    const col = course?._discColor || C.gold;
    let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" class="cover" aria-hidden="true">
  <defs>
    <linearGradient id="cg${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${col}" stop-opacity=".28"/><stop offset="1" stop-color="#0b1120"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cg${seed})"/>`;
    for (let i=0;i<7;i++){
      const cx = rnd(i)*w, cy = rnd(i+40)*h, r = 14 + rnd(i+80)*44;
      s += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="${col}" stroke-opacity="${(0.10+rnd(i+120)*0.16).toFixed(2)}" stroke-width="1.4"/>`;
    }
    s += `<path d="M0 ${h-46} Q ${w*0.3} ${h-88} ${w*0.55} ${h-52} T ${w} ${h-30} V ${h} H 0 Z" fill="${col}" opacity=".10"/>`;
    s += `<text x="22" y="${h-20}" fill="#ffffff" fill-opacity=".82" font-size="15" font-weight="800" font-family="${FONT}">${esc(course?.code || "")}</text>`;
    s += `</svg>`;
    return s;
  }

  return { render, cover };
})();

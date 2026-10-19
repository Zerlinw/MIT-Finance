/* ============================================================
 * 平台主逻辑：首页 / 学校列表 / 学校详情 / 课程列表 /
 *             课程详情 / 图解浏览
 * 文件：js/platform.js
 * 依赖顺序：catalog-data.js → catalog-figures.js → diagram-lib.js → platform.js
 * ============================================================ */

(() => {

/* ---------- 工具 ---------- */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const params = () => new URLSearchParams(location.search);

/* ---------- 数据合并：课程 ↔ 图解 ---------- */
const CAT = {
  disciplines: DISCIPLINES,
  schools: SCHOOLS,
  levels: LEVELS,
  courses: COURSES.map(c => {
    const disc = DISCIPLINES.find(d => d.id === c.discipline) || { color:"#f5c451" };
    return { ...c, _discColor: disc.color, figures: FIGURES[c.id] || [] };
  })
};
const schoolOf   = c => CAT.schools.find(s => s.id === c.school);
const discOf     = c => CAT.disciplines.find(d => d.id === c.discipline);
const courseOf   = id => CAT.courses.find(c => c.id === id);
const coursesOfSchool   = sid => CAT.courses.filter(c => c.school === sid);
const coursesOfDisc     = did => CAT.courses.filter(c => c.discipline === did);
const figureCountOfSchool = sid => coursesOfSchool(sid).reduce((a,c)=>a+c.figures.length, 0);
const coverOf = c => DiagramLib.cover(c);

/* ---------- 通用片段 ---------- */
function levelChip(c, extra=""){
  return `<span class="chip chip-lv ${c.levelKey} ${extra}">${c.level}</span>`;
}
function courseCard(c){
  const s = schoolOf(c), d = discOf(c);
  return `<a class="course-card" href="course.html?id=${c.id}">
    <div class="cc-cover" style="position:relative">
      ${coverOf(c)}
      ${c.featured ? `<span class="chip chip-hot" style="position:absolute;top:12px;right:12px">★ 编辑推荐</span>` : ""}
    </div>
    <div class="cc-body">
      <div class="cc-school">${esc(s?.short || "")} · ${esc(d?.name || "")}</div>
      <div class="cc-title">${esc(c.title)}</div>
      <div class="cc-en">${esc(c.en)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${levelChip(c)}
        <span class="chip chip-disc">${c.figures.length} 张图解</span>
      </div>
      <div class="cc-meta">
        <span>代号 <b>${esc(c.code)}</b></span>
        <span>约 <b>${c.minutes ? c.minutes : "专题"}</b> 分钟</span>
      </div>
    </div>
  </a>`;
}
function schoolCard(s){
  const cs = coursesOfSchool(s.id);
  return `<a class="school-card" href="university.html?id=${s.id}">
    <div class="sc-badge" style="background:${s.color}">${esc(s.short)}</div>
    <div style="flex:1;min-width:0">
      <h3>${esc(s.name)}</h3>
      <div class="en">${esc(s.en)}</div>
      <div class="intro">${esc(s.intro)}</div>
      <div class="sc-meta">
        <span class="chip chip-qs">QS #${s.qs}</span>
        <span class="chip chip-disc">${s.country}</span>
        <span class="chip chip-disc">${cs.length} 门课程</span>
        <span class="chip chip-disc">${figureCountOfSchool(s.id)} 张图解</span>
      </div>
    </div>
  </a>`;
}
function emptyState(title, desc){
  return `<div class="empty"><div class="ico">🗺️</div><h3>${title}</h3><p>${desc}</p></div>`;
}
function navSearchBind(){
  $$(".nav-search").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const q = $("input", form).value.trim();
      location.href = "courses.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  });
}
function markNav(){
  const page = document.body.dataset.page;
  $$(".nav-links a").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("active");
  });
}
function bindReveal(){
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold:.12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ============================================================
 * 首页
 * ============================================================ */
function renderHome(){
  const totalFigs = CAT.courses.reduce((a,c)=>a+c.figures.length, 0);
  $("#statSchools").textContent = CAT.schools.length;
  $("#statCourses").textContent = CAT.courses.length;
  $("#statFigures").textContent = totalFigs;
  $("#statDisc").textContent = CAT.disciplines.length;

  // 学科入口
  $("#discGrid").innerHTML = CAT.disciplines.map(d => {
    const n = coursesOfDisc(d.id).length;
    return `<a class="disc-card reveal" href="courses.html?discipline=${d.id}">
      <span class="ico">${d.icon}</span>
      <h3>${esc(d.name)}</h3>
      <div class="cnt">${n} 门课程 · ${coursesOfDisc(d.id).reduce((a,c)=>a+c.figures.length,0)} 张图解</div>
    </a>`;
  }).join("");

  // 精选课程
  $("#featGrid").innerHTML = CAT.courses.filter(c => c.featured).map(c =>
    `<div class="reveal">${courseCard(c)}</div>`).join("");

  // 名校巡礼（按 QS 排序）
  $("#schoolGrid").innerHTML = [...CAT.schools].sort((a,b)=>a.qs-b.qs)
    .map(s => `<div class="reveal">${schoolCard(s)}</div>`).join("");

  // 最近上图
  const latest = CAT.courses
    .flatMap(c => c.figures.map(f => ({ f, c })))
    .sort((a,b) => String(b.c.updated||"").localeCompare(String(a.c.updated||"")))
    .slice(0, 8);
  $("#figGrid").innerHTML = latest.map(({f,c}) => {
    const idx = c.figures.indexOf(f);
    return `<a class="fig-card" href="gallery.html?course=${c.id}&fig=${idx}">
      <div class="fc-thumb">${DiagramLib.render(f)}</div>
      <div class="fc-body">
        <div class="t">${esc(f.title)}</div>
        <div class="s">${esc(schoolOf(c).short)} · ${esc(c.title)}</div>
      </div>
    </a>`;
  }).join("");
}

/* ============================================================
 * 学校列表
 * ============================================================ */
function renderUniversities(){
  const grid = $("#schoolGrid");
  const search = $("#fSearch"), discSel = $("#fDisc"), countrySel = $("#fCountry");

  const countries = [...new Set(CAT.schools.map(s => s.country))];
  countrySel.innerHTML = `<option value="">全部国家/地区</option>` +
    countries.map(c => `<option>${esc(c)}</option>`).join("");
  discSel.innerHTML = `<option value="">全部学科</option>` +
    CAT.disciplines.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join("");

  function apply(){
    const q = search.value.trim().toLowerCase();
    const d = discSel.value, ct = countrySel.value;
    const list = CAT.schools.filter(s => {
      if (d && !coursesOfSchool(s.id).some(c => c.discipline === d)) return false;
      if (ct && s.country !== ct) return false;
      if (q && !(`${s.name} ${s.en} ${s.short} ${s.intro} ${s.country}`.toLowerCase().includes(q))) return false;
      return true;
    });
    $("#resultCount").innerHTML = `共 <b>${list.length}</b> 所学校`;
    grid.innerHTML = list.length
      ? list.map(s => `<div class="reveal visible">${schoolCard(s)}</div>`).join("")
      : emptyState("没有匹配的学校", "换个关键词或学科试试");
  }
  [search, discSel, countrySel].forEach(el =>
    el.addEventListener("input", apply));
  apply();
}

/* ============================================================
 * 学校详情
 * ============================================================ */
function renderUniversity(){
  const id = params().get("id");
  const s = CAT.schools.find(x => x.id === id);
  if (!s){ $("#schoolBody").innerHTML = emptyState("学校不存在", "请从学校列表重新进入"); return; }

  document.title = `${s.name} · 课程图解合集 - OpenCourseAtlas`;
  const cs = coursesOfSchool(s.id);
  $("#crumbSchool").textContent = s.name;
  $("#sBadge").textContent = s.short;
  $("#sBadge").style.background = s.color;
  $("#sName").textContent = s.name;
  $("#sEn").textContent = s.en;
  $("#sIntro").textContent = s.intro;
  $("#sMeta").innerHTML = [
    `<span class="chip chip-qs">QS 2025 #${s.qs}</span>`,
    `<span class="chip chip-disc">${esc(s.country)} · ${esc(s.city)}</span>`,
    `<span class="chip chip-disc">建校 ${s.founded}</span>`,
    `<span class="chip chip-disc">${cs.length} 门课程</span>`,
    `<span class="chip chip-disc">${figureCountOfSchool(s.id)} 张图解</span>`
  ].join("");

  const discs = [...new Set(cs.map(c => c.discipline))];
  const tabs = $("#discTabs");
  tabs.innerHTML = `<button class="tab active" data-d="">全部<span class="n">${cs.length}</span></button>` +
    discs.map(d => {
      const disc = discOf({ discipline:d });
      const n = cs.filter(c => c.discipline === d).length;
      return `<button class="tab" data-d="${d}">${disc.icon} ${esc(disc.name)}<span class="n">${n}</span></button>`;
    }).join("");

  const grid = $("#courseGrid");
  function show(d){
    const list = d ? cs.filter(c => c.discipline === d) : cs;
    grid.innerHTML = list.length
      ? list.map(c => `<div class="reveal visible">${courseCard(c)}</div>`).join("")
      : emptyState("该学科课程整理中", "内容持续扩充，敬请期待");
  }
  tabs.addEventListener("click", e => {
    const btn = e.target.closest(".tab"); if (!btn) return;
    $$(".tab", tabs).forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    show(btn.dataset.d);
  });
  show("");
}

/* ============================================================
 * 课程列表（筛选 + 搜索 + 排序）
 * ============================================================ */
function renderCourses(){
  const p = params();
  const state = {
    q: p.get("q") || "",
    school: p.get("school") || "",
    discipline: p.get("discipline") || "",
    level: p.get("level") || "",
    sort: p.get("sort") || "featured"
  };

  const search = $("#fSearch"), schoolSel = $("#fSchool"),
        discSel = $("#fDisc"), sortSel = $("#fSort"), lvBox = $("#lvChips");
  search.value = state.q;
  schoolSel.innerHTML = `<option value="">全部学校</option>` +
    CAT.schools.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
  discSel.innerHTML = `<option value="">全部学科</option>` +
    CAT.disciplines.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join("");
  sortSel.innerHTML = [
    ["featured","推荐优先"],["figures","图解体数最多"],["minutes","时长最短"],["title","名称 A→Z"]
  ].map(([v,t]) => `<option value="${v}">${t}</option>`).join("");
  schoolSel.value = state.school; discSel.value = state.discipline; sortSel.value = state.sort;

  lvBox.innerHTML = `<button class="lv-chip active" data-lv="">全部难度</button>` +
    CAT.levels.map(l => `<button class="lv-chip" data-lv="${l.id}">${l.name}<small style="opacity:.6;font-weight:400"> · ${l.desc}</small></button>`).join("");
  $$(".lv-chip", lvBox).forEach(b => {
    if (b.dataset.lv === state.level) { $$(".lv-chip", lvBox).forEach(x=>x.classList.remove("active")); b.classList.add("active"); }
  });

  const grid = $("#courseGrid");

  function filtered(){
    const q = state.q.toLowerCase();
    let list = CAT.courses.filter(c => {
      const s = schoolOf(c), d = discOf(c);
      if (state.school && c.school !== state.school) return false;
      if (state.discipline && c.discipline !== state.discipline) return false;
      if (state.level && c.levelKey !== state.level) return false;
      if (q){
        const hay = `${c.title} ${c.en} ${c.code} ${c.instructor} ${c.tags.join(" ")} ${s?.name||""} ${s?.short||""} ${d?.name||""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const cmp = {
      featured:  (a,b) => (b.featured?1:0) - (a.featured?1:0) || a.title.localeCompare(b.title,"zh"),
      figures:   (a,b) => b.figures.length - a.figures.length,
      minutes:   (a,b) => (a.minutes||9999) - (b.minutes||9999),
      title:     (a,b) => a.title.localeCompare(b.title,"zh")
    }[state.sort] || (()=>0);
    return list.sort(cmp);
  }

  function syncURL(){
    const usp = new URLSearchParams();
    Object.entries(state).forEach(([k,v]) => { if (v && !(k==="sort" && v==="featured")) usp.set(k, v); });
    const qs = usp.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }
  function renderChips(){
    const box = $("#activeFilters");
    const chips = [];
    if (state.q) chips.push(["q", `关键词：${esc(state.q)}`]);
    if (state.school) chips.push(["school", schoolOf({school:state.school})?.name || state.school]);
    if (state.discipline) chips.push(["discipline", discOf({discipline:state.discipline})?.name || state.discipline]);
    if (state.level) chips.push(["level", CAT.levels.find(l=>l.id===state.level)?.name || state.level]);
    box.innerHTML = chips.map(([k,t]) =>
      `<span class="af-chip">${t}<button data-k="${k}" aria-label="移除筛选">✕</button></span>`).join("");
    $$("button", box).forEach(b => b.addEventListener("click", () => {
      state[b.dataset.k] = "";
      if (b.dataset.k === "q") search.value = "";
      if (b.dataset.k === "school") schoolSel.value = "";
      if (b.dataset.k === "discipline") discSel.value = "";
      if (b.dataset.k === "level") $$(".lv-chip", lvBox).forEach(x=>x.classList.toggle("active", x.dataset.lv===""));
      apply();
    }));
  }
  function apply(){
    syncURL(); renderChips();
    const list = filtered();
    $("#resultCount").innerHTML = `共 <b>${list.length}</b> 门课程 · <b>${list.reduce((a,c)=>a+c.figures.length,0)}</b> 张图解`;
    grid.innerHTML = list.length
      ? list.map(c => `<div class="reveal visible">${courseCard(c)}</div>`).join("")
      : emptyState("没有匹配的课程", "尝试放宽筛选条件，或看看其他学科的图解合集");
  }

  let timer;
  search.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(()=>{ state.q = search.value.trim(); apply(); }, 200); });
  schoolSel.addEventListener("change", () => { state.school = schoolSel.value; apply(); });
  discSel.addEventListener("change", () => { state.discipline = discSel.value; apply(); });
  sortSel.addEventListener("change", () => { state.sort = sortSel.value; apply(); });
  lvBox.addEventListener("click", e => {
    const b = e.target.closest(".lv-chip"); if (!b) return;
    $$(".lv-chip", lvBox).forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    state.level = b.dataset.lv; apply();
  });
  apply();
}

/* ============================================================
 * 课程详情
 * ============================================================ */
function renderCourse(){
  const id = params().get("id");
  const c = courseOf(id);
  if (!c){ $("#courseBody").innerHTML = emptyState("课程不存在", "请从课程列表重新进入"); return; }

  const s = schoolOf(c), d = discOf(c);
  document.title = `${c.title} · ${s.name} - OpenCourseAtlas`;

  $("#crumbSchool").textContent = s.name;
  $("#crumbSchool").href = `university.html?id=${s.id}`;
  $("#crumbCourse").textContent = c.title;
  $("#cCover").innerHTML = coverOf(c);
  $("#cTitle").textContent = c.title;
  $("#cEn").textContent = c.en;
  $("#cMeta").innerHTML = [
    `<a class="cc-school" href="university.html?id=${s.id}" style="text-decoration:none">${esc(s.short)} · ${esc(s.name)}</a>`,
    levelChip(c),
    `<span class="chip chip-disc">${d.icon} ${esc(d.name)}</span>`,
    c.featured ? `<span class="chip chip-hot">★ 编辑推荐</span>` : ""
  ].join("");
  $("#cTags").innerHTML = [c.code, c.instructor, ...c.tags].map(t => `<span>${esc(t)}</span>`).join("");

  $("#cOverview").innerHTML = `<h3>课程概述</h3><p>${esc(c.overview)}</p>
    <ul class="takeaways">${c.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;

  // 章节 + 图解清单
  let figNo = 0;
  const chaptersHtml = c.chapters.map((ch, i) => {
    const figs = c.figures.filter(f => f.ch === ch.id);
    return `<div class="chapter ${i===0?"open":""}">
      <div class="ch-head">
        <div class="ch-num">${String(i+1).padStart(2,"0")}</div>
        <div class="t"><h3>${esc(ch.title)}</h3><p>${esc(ch.summary)}</p></div>
        <div class="cnt">${figs.length} 张图解</div>
        <div class="arrow">▶</div>
      </div>
      <div class="ch-body"><div class="fig-chips">
        ${figs.map(f => { figNo++; const gi = c.figures.indexOf(f);
          return `<a class="fig-chip" href="gallery.html?course=${c.id}&fig=${gi}">
            <span class="n">${String(figNo).padStart(2,"0")}</span>
            <span class="t">${esc(f.title)}<small>${esc(f.caption)}</small></span>
          </a>`; }).join("")}
      </div></div>
    </div>`;
  }).join("");
  $("#chapters").innerHTML = chaptersHtml || emptyState("章节整理中", "该课程的章节结构即将上线");
  $$("#chapters .ch-head").forEach(h =>
    h.addEventListener("click", () => h.parentElement.classList.toggle("open")));

  // 主行动按钮
  const ctaHtml = c.deepLink
    ? `<a class="btn btn-gold" href="gallery.html?course=${c.id}&fig=0">开始浏览 ${c.figures.length} 张图解 ↓</a>
       <a class="btn btn-ghost" href="${c.deepLink}">深度专题页（交互实验室）→</a>`
    : `<a class="btn btn-gold" href="gallery.html?course=${c.id}&fig=0">开始浏览 ${c.figures.length} 张图解 ↓</a>`;
  $("#cCta").innerHTML = ctaHtml;
  $("#cCtaBottom").innerHTML = ctaHtml;

  // 侧栏
  $("#sideStats").innerHTML = [
    ["图解体数", c.figures.length + " 张"],
    ["章节数", c.chapters.length + " 章"],
    ["预计阅读", c.minutes ? c.minutes + " 分钟" : "深度专题"],
    ["难度", c.level],
    ["先修要求", c.prereq],
    ["资料来源", c.source],
    ["最近更新", c.updated || "—"]
  ].map(([k,v]) => `<div class="side-row"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("");

  $("#sideSchool").innerHTML = `<a class="side-link" href="university.html?id=${s.id}">
      <div class="sc-badge" style="width:44px;height:44px;border-radius:12px;font-size:11px;background:${s.color}">${esc(s.short)}</div>
      <div><div class="t">${esc(s.name)}</div><div class="s">QS #${s.qs} · ${coursesOfSchool(s.id).length} 门课程</div></div>
    </a>`;

  const related = CAT.courses
    .filter(x => x.id !== c.id && (x.discipline === c.discipline || x.school === c.school))
    .sort((a,b) => (b.featured?1:0)-(a.featured?1:0)).slice(0,4);
  $("#sideRelated").innerHTML = related.map(x => `<a class="side-link" href="course.html?id=${x.id}">
      <div><div class="t">${esc(x.title)}</div><div class="s">${esc(schoolOf(x).short)} · ${x.figures.length} 张图解</div></div>
    </a>`).join("") || `<div style="font-size:13px;color:var(--muted)">暂无相关课程</div>`;
}

/* ============================================================
 * 图解浏览（放大 / 切换 / 目录）
 * ============================================================ */
function renderGallery(){
  const c = courseOf(params().get("course"));
  const stage = $("#gStage"), inner = $("#gStageInner");
  if (!c){ $("#galleryBody").innerHTML = emptyState("课程不存在", "请从课程列表重新进入"); return; }

  const s = schoolOf(c);
  document.title = `图解浏览 · ${c.title} - OpenCourseAtlas`;

  // 按章节顺序展平图解
  const figs = [];
  c.chapters.forEach(ch => c.figures.filter(f => f.ch === ch.id).forEach(f => figs.push(f)));
  c.figures.forEach(f => { if (!figs.includes(f)) figs.push(f); });

  let idx = parseInt(params().get("fig") || "0", 10);
  if (isNaN(idx) || idx < 0 || idx >= figs.length) idx = 0;

  /* ---------- 侧栏目录 ---------- */
  $("#gCourseTitle").textContent = c.title;
  $("#gCourseSub").textContent = `${s.short} · ${figs.length} 张图解`;
  $("#gSideList").innerHTML = c.chapters.map(ch => {
    const list = figs.filter(f => f.ch === ch.id);
    if (!list.length) return "";
    return `<div class="g-ch"><div class="g-ch-title">${esc(ch.title)}</div>
      ${list.map(f => {
        const i = figs.indexOf(f);
        return `<button class="g-item ${i===idx?"active":""}" data-i="${i}">
          <span class="n">${String(i+1).padStart(2,"0")}</span>${esc(f.title)}
        </button>`; }).join("")}
    </div>`;
  }).join("");
  $("#gSide").addEventListener("click", e => {
    const b = e.target.closest(".g-item"); if (!b) return;
    go(parseInt(b.dataset.i, 10));
  });

  /* ---------- 缩放与平移 ---------- */
  let k = 1, tx = 0, ty = 0, drag = null;
  function apply(){
    inner.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
    $("#gZoomVal").textContent = Math.round(k*100) + "%";
    $("#gZoomIn").disabled = k >= 3;
    $("#gZoomOut").disabled = k <= 0.6;
  }
  function zoomBy(d){
    k = Math.min(3, Math.max(0.6, +(k + d).toFixed(2)));
    apply();
  }
  $("#gZoomIn").addEventListener("click", () => zoomBy(0.25));
  $("#gZoomOut").addEventListener("click", () => zoomBy(-0.25));
  $("#gZoomReset").addEventListener("click", () => { k=1; tx=0; ty=0; apply(); });
  stage.addEventListener("wheel", e => {
    if (e.ctrlKey){ e.preventDefault(); zoomBy(e.deltaY < 0 ? 0.15 : -0.15); }
  }, { passive:false });
  stage.addEventListener("dblclick", () => { if (k === 1){ k = 2; } else { k = 1; tx = 0; ty = 0; } apply(); });
  stage.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    drag = { x:e.clientX, y:e.clientY, tx, ty };
    stage.classList.add("dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", e => {
    if (!drag) return;
    tx = drag.tx + (e.clientX - drag.x);
    ty = drag.ty + (e.clientY - drag.y);
    apply();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(ev =>
    stage.addEventListener(ev, () => { drag = null; stage.classList.remove("dragging"); }));

  /* ---------- 全屏 ---------- */
  const viewer = $("#gViewer");
  $("#gFull").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else viewer.requestFullscreen?.();
  });

  /* ---------- 渲染当前图解 ---------- */
  function render(){
    const f = figs[idx];
    const ch = c.chapters.find(x => x.id === f.ch);
    $("#gLoc").innerHTML = `<a href="index.html" style="color:inherit;text-decoration:none">首页</a> /
      <a href="university.html?id=${c.school}" style="color:inherit;text-decoration:none">${esc(s.name)}</a> /
      <a href="course.html?id=${c.id}" style="color:inherit;text-decoration:none">${esc(c.title)}</a> /
      <b>${esc(ch?.title || "")}</b>`;
    $("#gFigTitle").innerHTML = `<span class="no">${String(idx+1).padStart(2,"0")}</span>${esc(f.title)}`;
    $("#gFigCap").textContent = f.caption;
    $("#gFigExplain").textContent = f.explain;
    inner.innerHTML = DiagramLib.render(f);
    $("#gCounter").textContent = `第 ${idx+1} / ${figs.length} 张`;
    $("#gProgress").style.width = ((idx+1)/figs.length*100).toFixed(1) + "%";
    // 上/下一张
    $("#gPrev").className = "prev" + (idx === 0 ? " disabled" : "");
    $("#gPrev").innerHTML = idx > 0 ? `← 上一张 · ${esc(figs[idx-1].title)}` : "← 已是第一张";
    $("#gPrev").href = `gallery.html?course=${c.id}&fig=${idx-1}`;
    $("#gNext").className = "next" + (idx === figs.length-1 ? " disabled" : "");
    $("#gNext").innerHTML = idx < figs.length-1 ? `下一张 · ${esc(figs[idx+1].title)} →` : "已是最后一张 →";
    $("#gNext").href = `gallery.html?course=${c.id}&fig=${idx+1}`;
    // 目录高亮 + 滚动到可见
    $$("#gSide .g-item").forEach(b => b.classList.toggle("active", +b.dataset.i === idx));
    const act = $("#gSide .g-item.active");
    act?.scrollIntoView({ block:"nearest" });
    // URL 同步（不刷新页面）
    history.replaceState(null, "", `gallery.html?course=${c.id}&fig=${idx}`);
    // 重置视图
    k = 1; tx = 0; ty = 0; apply();
  }
  function go(i){
    if (i < 0 || i >= figs.length || i === idx) return;
    idx = i; render();
  }
  $("#gPrev").addEventListener("click", e => { if (idx > 0){ e.preventDefault(); go(idx-1); } });
  $("#gNext").addEventListener("click", e => { if (idx < figs.length-1){ e.preventDefault(); go(idx+1); } });

  // 键盘导航
  document.addEventListener("keydown", e => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
    if (e.key === "ArrowLeft")  { go(idx-1); }
    else if (e.key === "ArrowRight"){ go(idx+1); }
    else if (e.key === "+" || e.key === "="){ zoomBy(0.25); }
    else if (e.key === "-"){ zoomBy(-0.25); }
    else if (e.key === "0"){ k=1; tx=0; ty=0; apply(); }
    else if (e.key === "Escape" && document.fullscreenElement){ document.exitFullscreen(); }
  });

  // 移动端目录抽屉
  $("#gSideToggle").addEventListener("click", () => {
    $("#gSide").classList.toggle("open");
  });

  render();
}

/* ============================================================
 * 分发
 * ============================================================ */
const PAGE = document.body.dataset.page;
const RENDERERS = {
  home: renderHome,
  universities: renderUniversities,
  university: renderUniversity,
  courses: renderCourses,
  course: renderCourse,
  gallery: renderGallery
};
markNav();
navSearchBind();
RENDERERS[PAGE]?.();
bindReveal();

})();

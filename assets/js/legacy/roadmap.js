/* ============================================================
 * 路线图模块：七大节点渲染 + 延伸学习卡片 + 通用详情弹窗
 * 文件：assets/js/legacy/roadmap.js
 * ============================================================ */

const visited = new Set();
const NODE_IDS = new Set(NODES.map(n => n.id));

/* ---------- 渲染路线图节点 ---------- */
function renderNodes(){
  const nodesG = document.getElementById("nodesG");
  if(!nodesG) return;
  let html = "";
  NODES.forEach(n=>{
    const below = n.y===310; // 底排标签放上方
    const ty = below ? n.y-52 : n.y+66;
    const sy = below ? n.y-34 : n.y+84;
    html += `
    <g class="node-g" data-id="${n.id}" transform="translate(${n.x},${n.y})">
      <circle class="nbody" r="30" fill="rgba(245,196,81,.1)" stroke="#f5c451" stroke-width="2"/>
      <text text-anchor="middle" y="6" style="fill:#f5c451;font-size:17px;font-weight:800">${n.num}</text>
      <text class="ntitle" text-anchor="middle" y="${ty-n.y}">${n.title}</text>
      <text class="nsub" text-anchor="middle" y="${sy-n.y}">${n.sub}</text>
      <circle class="vcheck" r="7" cx="21" cy="-21" fill="#34d399" stroke="#0b1120" stroke-width="2" opacity="0"/>
      <text class="vtick" y="-17" x="21" text-anchor="middle" style="fill:#052e16;font-size:9px;font-weight:900" opacity="0">✓</text>
    </g>`;
  });
  nodesG.innerHTML = html;
  nodesG.querySelectorAll(".node-g").forEach(g=>{
    g.addEventListener("click", ()=> openDetail(NODES.find(n=>n.id===+g.dataset.id)));
  });
}

/* ---------- 渲染延伸学习卡片 ---------- */
function renderExtCards(){
  const box = document.getElementById("extGrid");
  if(!box) return;
  box.innerHTML = RESOURCES.map((r,i)=>`
    <div class="ext-card" data-i="${i}">
      <div class="ext-icon">${r.icon}</div>
      <div>
        <h3>${r.title}</h3>
        <div class="author">${r.author}</div>
        <div class="brief">${r.brief}</div>
      </div>
    </div>`).join("");
  box.querySelectorAll(".ext-card").forEach(c=>{
    c.addEventListener("click", ()=> openDetail(RESOURCES[+c.dataset.i]));
  });
}

/* ---------- 通用详情弹窗（模块与资源共用） ---------- */
function openDetail(item){
  if(!item) return;
  const overlay = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  content.innerHTML = `
    <div class="m-num">${item.num}</div>
    <h3>${item.title}</h3>
    <div class="m-tagline">${item.tagline}</div>
    <div class="m-body">${item.body}</div>
    <div class="m-quote">${item.quote}</div>
    <div class="m-diagram">${DIAGRAMS[item.diagram]()}</div>
    ${item.formula ? `<div class="m-formula"><span class="f">${item.formula}</span></div>` : ""}
    <div class="m-action"><b>普通人怎么做 →</b> ${item.action}</div>
  `;
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";

  // 模块节点：标记已探索
  if(NODE_IDS.has(item.id)){
    visited.add(item.id);
    const g = document.querySelector(`.node-g[data-id="${item.id}"]`);
    if(g){
      g.classList.add("visited");
      g.querySelector(".vcheck").setAttribute("opacity","1");
      g.querySelector(".vtick").setAttribute("opacity","1");
    }
    document.getElementById("visitedCount").textContent = visited.size;
  }
}

function closeModal(){
  document.getElementById("modalOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------- 初始化 ---------- */
renderNodes();
renderExtCards();
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", e=>{
  if(e.target===e.currentTarget) closeModal();
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });

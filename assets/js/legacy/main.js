/* ============================================================
 * 主入口：通用交互、动画、导航
 * 文件：assets/js/legacy/main.js
 * 依赖顺序：data.js → diagrams.js → roadmap.js → lab.js → quiz.js → main.js
 * ============================================================ */

/* ---------- 支柱展开 ---------- */
document.querySelectorAll(".pillar").forEach(p=>{
  p.addEventListener("click", ()=> p.classList.toggle("open"));
});

/* ---------- 对比行交互 ---------- */
document.querySelectorAll(".vs-row").forEach(r=>{
  r.addEventListener("click", ()=>{
    document.querySelectorAll(".vs-row").forEach(x=>x.style.background="");
    r.style.background = "rgba(245,196,81,.1)";
  });
});

/* ---------- 实验室 Tab ---------- */
document.querySelectorAll(".lab-tab").forEach(t=>{
  t.addEventListener("click", ()=>{
    document.querySelectorAll(".lab-tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    document.querySelectorAll(".lab-panel").forEach(p=>p.classList.remove("show"));
    const panel=document.getElementById("tab-"+t.dataset.tab);
    panel.classList.add("show");
    panel.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
  });
});

/* ---------- 雪球动画 ---------- */
(function(){
  const track=document.querySelector("#snowSvg path:nth-of-type(2)");
  const ball=document.getElementById("snowball");
  if(!track || !ball) return;
  const len=track.getTotalLength();
  let start=null;
  function frame(t){
    if(!start) start=t;
    const prog=Math.min((t-start)/4200,1);
    const pt=track.getPointAtLength(len*prog);
    ball.setAttribute("cx",pt.x);
    ball.setAttribute("cy",pt.y);
    ball.setAttribute("r",10+24*prog);
    if(prog<1) requestAnimationFrame(frame);
    else setTimeout(()=>{ start=null; requestAnimationFrame(frame); },1200);
  }
  requestAnimationFrame(frame);
})();

/* ---------- 滚动显现 ---------- */
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target);} });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* ---------- 导航高亮 ---------- */
const secs=[...document.querySelectorAll("section[id]")];
const links=[...document.querySelectorAll(".nav-links a")];
const io2=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      links.forEach(l=>l.classList.toggle("active", l.getAttribute("href")==="#"+e.target.id));
    }
  });
},{rootMargin:"-40% 0px -55% 0px"});
secs.forEach(s=>io2.observe(s));

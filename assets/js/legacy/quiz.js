/* ============================================================
 * 认知自检测验 + 行动清单
 * 文件：assets/js/legacy/quiz.js
 * ============================================================ */

/* ==================== 测验 ==================== */
let quizAnswered=0, quizRight=0;

function renderQuiz(){
  const box=document.getElementById("quizBox");
  if(!box) return;
  box.innerHTML=QUIZ.map((item,qi)=>`
    <div class="quiz-card reveal">
      <div class="quiz-q"><span class="qn">Q${qi+1}</span>${item.q}</div>
      <div class="quiz-opts">
        ${item.opts.map((o,oi)=>`<button class="quiz-opt" data-q="${qi}" data-o="${oi}">${String.fromCharCode(65+oi)}. ${o}</button>`).join("")}
      </div>
      <div class="quiz-why" id="why${qi}"><b>解析：</b>${item.why}</div>
    </div>`).join("");
  box.querySelectorAll(".quiz-opt").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const qi=+btn.dataset.q, oi=+btn.dataset.o;
      const card=btn.closest(".quiz-card");
      if(card.dataset.done) return;
      card.dataset.done="1";
      quizAnswered++;
      if(oi===QUIZ[qi].a){ quizRight++; btn.classList.add("correct"); }
      else{
        btn.classList.add("wrong");
        card.querySelector(`.quiz-opt[data-o="${QUIZ[qi].a}"]`).classList.add("correct");
      }
      card.querySelectorAll(".quiz-opt").forEach(b=>b.disabled=true);
      document.getElementById("why"+qi).classList.add("show");
      if(quizAnswered===QUIZ.length){
        const s=document.getElementById("quizScore");
        s.textContent=`得分：${quizRight} / ${QUIZ.length} · `+(quizRight===3?"满分！你的认知框架已经上线 🎉":quizRight>=2?"不错，回去把错题的模块再点开看看 👀":"建议重走一遍七大模块，重点看解析 📚");
        s.classList.add("show");
      }
    });
  });
  box.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
}

/* ==================== 行动清单 ==================== */
function renderChecks(){
  const box=document.getElementById("checklist");
  if(!box) return;
  box.innerHTML=CHECKS.map((c,i)=>`
    <div class="check-item" data-i="${i}">
      <div class="checkbox">✓</div><div class="ct">${c}</div>
    </div>`).join("");
  box.querySelectorAll(".check-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      el.classList.toggle("done");
      const doneCount=box.querySelectorAll(".done").length;
      document.getElementById("checkCount").textContent=doneCount;
      document.getElementById("cheer").textContent =
        doneCount===6?"全部完成——雪球已经全速滚动 🎉":doneCount>=3?"进度过半，习惯正在形成 💪":"滚雪球的第一步，是让雪球开始滚。";
    });
  });
}

/* ---------- 初始化 ---------- */
renderQuiz();
renderChecks();

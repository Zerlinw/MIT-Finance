/* ============================================================
 * 交互实验室：复利引擎 + 凯利公式计算器
 * 文件：js/lab.js
 * ============================================================ */

const $ = id => document.getElementById(id);

function fmtWan(v){
  if(v>=10000) return (v/10000).toFixed(v>=1000000?0:1)+" 万";
  return Math.round(v).toLocaleString();
}

function fillRange(el){
  const pct = (el.value-el.min)/(el.max-el.min)*100;
  el.style.setProperty("--fill", pct+"%");
}

/* ==================== 复利引擎 ==================== */
function drawCompound(){
  const P=+$("inP").value, M=+$("inM").value, R=+$("inR").value, N=+$("inN").value, I=+$("inI").value;
  $("vP").textContent = P.toLocaleString()+" 元";
  $("vM").textContent = M.toLocaleString()+" 元";
  $("vR").textContent = R+"%";
  $("vN").textContent = N+" 年";
  $("vI").textContent = I.toFixed(1)+"%";
  ["inP","inM","inR","inN","inI"].forEach(x=>fillRange($(x)));

  const r=R/100/12, months=N*12;
  const bal=[], real=[], inv=[];
  let b=P;
  for(let m=0;m<=months;m++){
    bal.push(b);
    real.push(b/Math.pow(1+I/100, m/12));
    inv.push(P+M*m);
    b=b*(1+r)+M;
  }
  const W=720,H=340,L=70,Rr=20,T=30,B=52;
  const iw=W-L-Rr, ih=H-T-B;
  const maxV=Math.max(bal[months], inv[months], 1);
  const sx=i=> L+iw*i/months;
  const sy=v=> T+ih*(1-v/maxV);
  const pts=arr=>arr.map((v,i)=>`${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" ");

  let grid="";
  for(let g=0; g<=4; g++){
    const v=maxV*g/4, y=sy(v);
    grid+=`<line x1="${L}" y1="${y}" x2="${W-Rr}" y2="${y}" stroke="rgba(255,255,255,.07)"/>
           <text x="${L-8}" y="${y+4}" text-anchor="end" style="fill:#8b98ad;font-size:11px">${fmtWan(v)}</text>`;
  }
  let xlab="";
  const step=N>20?5:2;
  for(let y=0;y<=N;y+=step){
    xlab+=`<text x="${sx(y*12)}" y="${H-28}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">${y}年</text>`;
  }
  const areaPath = `M${sx(0)},${sy(bal[0])} ` + bal.map((v,i)=>`L${sx(i)},${sy(v)}`).join(" ") + ` L${sx(months)},${T+ih} L${sx(0)},${T+ih} Z`;

  $("compoundSvg").innerHTML = `
    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(245,196,81,.28)"/><stop offset="1" stop-color="rgba(245,196,81,0)"/>
    </linearGradient></defs>
    ${grid}
    <path d="${areaPath}" fill="url(#ag)"/>
    <polyline points="${pts(inv)}" fill="none" stroke="#5b6b85" stroke-width="2"/>
    <polyline points="${pts(real)}" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="6 5"/>
    <polyline points="${pts(bal)}" fill="none" stroke="#f5c451" stroke-width="3.5"/>
    <circle cx="${sx(months)}" cy="${sy(bal[months])}" r="5" fill="#f5c451" stroke="#0b1120" stroke-width="2"/>
    <text x="${sx(months)-6}" y="${sy(bal[months])-12}" text-anchor="end" style="fill:#f5c451;font-size:13px;font-weight:800">${fmtWan(bal[months])}</text>
    ${xlab}
    <line x1="${L}" y1="${T+ih}" x2="${W-Rr}" y2="${T+ih}" stroke="rgba(255,255,255,.15)"/>`;

  const invested=P+M*months, profit=bal[months]-invested;
  $("rFinal").textContent=fmtWan(bal[months]);
  $("rInvested").textContent=fmtWan(invested);
  $("rProfit").textContent=fmtWan(profit);
  $("rDouble").textContent= R>0 ? (72/R).toFixed(1)+" 年" : "—";
}

/* ==================== 凯利公式 ==================== */
function drawKelly(){
  const p=+$("inPk").value/100, b=+$("inBk").value, q=1-p;
  $("vPk").textContent=(p*100)+"%";
  $("vBk").textContent=b.toFixed(1);
  fillRange($("inPk")); fillRange($("inBk"));

  const fStar=(b*p-q)/b;
  const W=720,H=340,L=70,Rr=20,T=40,B=52;
  const iw=W-L-Rr, ih=H-T-B;
  const fmax=0.95;
  const g=f=> p*Math.log(1+b*f)+q*Math.log(Math.max(1-f,1e-9));

  const gs=[];
  for(let i=0;i<=95;i++){ const f=fmax*i/95; gs.push({f,g:g(f)}); }
  const minG=Math.min(...gs.map(x=>x.g)), maxG=Math.max(...gs.map(x=>x.g));
  const pad=(maxG-minG)*0.12||1;
  const sx=f=> L+iw*f/fmax;
  const sy=v=> T+ih*(1-(v-(minG-pad))/((maxG+pad)-(minG-pad)));
  const path=gs.map(x=>`${sx(x.f).toFixed(1)},${sy(x.g).toFixed(1)}`).join(" ");

  let grid="";
  for(let i=0;i<=4;i++){
    const v=minG-pad+((maxG+pad)-(minG-pad))*i/4, y=sy(v);
    grid+=`<line x1="${L}" y1="${y}" x2="${W-Rr}" y2="${y}" stroke="rgba(255,255,255,.07)"/>`;
  }
  [0,.25,.5,.75,.95].forEach(f=>{
    grid+=`<text x="${sx(f)}" y="${H-26}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">${(f*100).toFixed(0)}%</text>`;
  });

  const verdict=$("kVerdict");
  let marker="";
  if(fStar>0 && fStar<0.95){
    const fs=Math.min(fStar,fmax);
    marker=`
      <line x1="${sx(fs)}" y1="${sy(g(fs))}" x2="${sx(fs)}" y2="${T+ih}" stroke="#34d399" stroke-width="2" stroke-dasharray="5 5"/>
      <circle cx="${sx(fs)}" cy="${sy(g(fs))}" r="7" fill="#34d399" stroke="#0b1120" stroke-width="2"/>
      <text x="${sx(fs)}" y="${sy(g(fs))-14}" text-anchor="middle" style="fill:#34d399;font-size:13px;font-weight:800">f*=${(fStar*100).toFixed(1)}%</text>
      <line x1="${sx(Math.min(fStar*2,.95))}" y1="${T+10}" x2="${sx(Math.min(fStar*2,.95))}" y2="${T+ih}" stroke="rgba(248,113,113,.4)" stroke-width="1.5" stroke-dasharray="3 4"/>
      <text x="${sx(Math.min(fStar*2,.95))+4}" y="${T+20}" style="fill:#f87171;font-size:11px">2f* 危险起点</text>`;
    verdict.className="kelly-verdict good";
    verdict.innerHTML=`✅ <b>正期望机会！</b>凯利最优仓位为总资金的 <b>${(fStar*100).toFixed(1)}%</b>。但估计永远有误差，实战请使用半凯利 <b>${(fStar*50).toFixed(1)}%</b>，并严守单笔上限。`;
  }else{
    verdict.className="kelly-verdict bad";
    verdict.innerHTML=`🚫 <b>负期望赌局，最优仓位 = 0。</b>凯利公式的第一课不是“押多少”，而是“<b>不玩</b>”。赌场里大多数游戏都属于此类。`;
  }

  $("kellySvg").innerHTML=`
    <defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(245,196,81,.18)"/><stop offset="1" stop-color="rgba(245,196,81,0)"/>
    </linearGradient></defs>
    ${grid}
    <path d="M${L},${sy(gs[0].g)} ${path.replace(/ /g," L")} L${sx(fmax)},${T+ih} L${L},${T+ih} Z" fill="url(#kg)" opacity=".6"/>
    <polyline points="${path}" fill="none" stroke="#f5c451" stroke-width="3.5"/>
    ${marker}
    <text x="${L-8}" y="${T+ih}" text-anchor="end" style="fill:#8b98ad;font-size:11px">增长率</text>
    <text x="${(L+W-Rr)/2}" y="${H-6}" text-anchor="middle" style="fill:#8b98ad;font-size:11px">仓位比例 f（占总资金）</text>`;

  $("kStar").textContent = fStar>0 ? (fStar*100).toFixed(1)+"%" : "0（不玩）";
  $("kStar").className = "v "+(fStar>0?"":"red");
  $("kHalf").textContent = fStar>0 ? (fStar*50).toFixed(1)+"%" : "0";
  $("kRuin").textContent = "100% 梭哈";
  $("kExp").textContent = (p*b-q*1>=0?"+":"") + ((p*b-q)*100).toFixed(1)+"%";
  $("kExp").className = "v "+(p*b-q>=0?"green":"red");
}

/* ---------- 初始化 ---------- */
["inP","inM","inR","inN","inI"].forEach(id=>$(id).addEventListener("input", drawCompound));
drawCompound();
$("inPk").addEventListener("input", drawKelly);
$("inBk").addEventListener("input", drawKelly);
drawKelly();

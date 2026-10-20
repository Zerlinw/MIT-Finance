/* ============================================================
 * 3D 场景渲染库：把「3D 模型数据」软件渲染到 Canvas 2D
 * 文件：assets/js/lib/scene3d-lib.js
 *
 * 设计目标：零依赖。不引入 three.js / WebGL / glTF，
 * 使用 Canvas 2D + 透视投影 +  painter's algorithm 面排序，
 * 单场景三角形控制在千级，足以表达「几何示意类」心智模型
 * （基向量变换、损失曲面、双缝实验、设计循环……）。
 *
 * 模型数据见 assets/js/data/catalog-models.js 的 MODELS：
 *   MODELS = { 课程id: { title, camera:{yaw,pitch,dist},
 *                        parts:[原语], marks:[锚点] } }
 *
 * 原语类型（part.type）：
 *   box      立方体      size:[w,h,d]
 *   sphere   球体        size:[r]
 *   cylinder 圆柱        size:[r,h]
 *   cone     圆锥        size:[r,h]
 *   plane    平面        size:[w,d]（默认水平，用 rot 翻转）
 *   ring     圆环        size:[R,r]
 *   grid     网格地面    size:[w,d], n?:网格数
 *   line     线段        pos:[x,y,z], to:[x,y,z]
 *   arc      3D 弧线     pos, to, height（抬升量，可为负）
 *   bowl     抛物曲面    size:[R,depth]（损失曲面等）
 *   poly     凸多面体    pts:[[x,y,z]...], closed?
 *
 * 对外接口：
 *   Scene3D.mount(canvas, model, opts) -> controller | null
 *     opts: { onPick(hit), onHover(hit|null), autoRotate?, focus? }
 *     hit:  { kind:"part"|"mark", id, data }
 *   controller: { setView, getView, focus, setAutoRotate,
 *                 pause, resume, dispose }
 * ============================================================ */

const Scene3D = (() => {

  const FONT = "PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif";
  const C = { gold:"#f5c451", text:"#dbe4f0", sub:"#8b98ad" };
  const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
  const hexRGB = hex => {
    const n = parseInt(String(hex||"#ffffff").slice(1), 16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  };
  const shade = (hex, f) => {
    const [r,g,b] = hexRGB(hex);
    return `rgb(${clamp(r*f,0,255)|0},${clamp(g*f,0,255)|0},${clamp(b*f,0,255)|0})`;
  };
  const alphaOf = (hex, a) => {
    const [r,g,b] = hexRGB(hex);
    return `rgba(${r},${g},${b},${a})`;
  };

  /* ---------- 旋转：按 Z→Y→X 顺序应用欧拉角 ---------- */
  function rot3(p, r){
    let x=p[0], y=p[1], z=p[2];
    if (r[2]){ const c=Math.cos(r[2]), s=Math.sin(r[2]); const nx=x*c-y*s, ny=x*s+y*c; x=nx; y=ny; }
    if (r[1]){ const c=Math.cos(r[1]), s=Math.sin(r[1]); const nx=x*c+z*s, nz=-x*s+z*c; x=nx; z=nz; }
    if (r[0]){ const c=Math.cos(r[0]), s=Math.sin(r[0]); const ny=y*c-z*s, nz=y*s+z*c; y=ny; z=nz; }
    return [x,y,z];
  }
  function faceNormal(a,b,c){
    const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2];
    const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2];
    return [uy*vz-uz*vy, uz*vx-ux*vz, ux*vy-uy*vx];
  }

  /* ---------- 原语几何：生成 face（三角面）与 stroke（折线） ---------- */
  const GEOM = {

    box(p){
      const w=(p.size?.[0]??1)/2, h=(p.size?.[1]??1)/2, d=(p.size?.[2]??1)/2;
      const v=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]];
      const quads=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[4,5,1,0],[3,2,6,7]];
      return quads.map(q=>({ kind:"face", pts:q.map(i=>v[i]), color:p.color||"#8b98ad", opacity:p.opacity??1, id:p.id }));
    },

    sphere(p){
      const r=p.size?.[0]??.5, ns=p.seg||14, nl=p.seg2||9;
      const rows=[];
      for (let i=0;i<=nl;i++){
        const phi=Math.PI*i/nl, row=[];
        for (let j=0;j<=ns;j++){
          const th=2*Math.PI*j/ns;
          row.push([r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th)]);
        }
        rows.push(row);
      }
      const out=[];
      for (let i=0;i<nl;i++) for (let j=0;j<ns;j++){
        out.push({ kind:"face", pts:[rows[i][j],rows[i+1][j],rows[i+1][j+1]], color:p.color||"#8b98ad", opacity:p.opacity??1, id:p.id });
        out.push({ kind:"face", pts:[rows[i][j],rows[i+1][j+1],rows[i][j+1]], color:p.color||"#8b98ad", opacity:p.opacity??1, id:p.id });
      }
      return out;
    },

    cylinder(p){
      const r=p.size?.[0]??.5, h=p.size?.[1]??1, ns=p.seg||16, y0=-h/2, y1=h/2;
      const col=p.color||"#8b98ad", op=p.opacity??1, out=[];
      for (let j=0;j<ns;j++){
        const a0=2*Math.PI*j/ns, a1=2*Math.PI*(j+1)/ns;
        const p0=[r*Math.cos(a0),y0,r*Math.sin(a0)], p1=[r*Math.cos(a1),y0,r*Math.sin(a1)];
        const p2=[r*Math.cos(a1),y1,r*Math.sin(a1)], p3=[r*Math.cos(a0),y1,r*Math.sin(a0)];
        out.push({kind:"face",pts:[p0,p1,p2],color:col,opacity:op,id:p.id});
        out.push({kind:"face",pts:[p0,p2,p3],color:col,opacity:op,id:p.id});
        out.push({kind:"face",pts:[p0,[0,y0,0],p1],color:col,opacity:op,id:p.id});
        out.push({kind:"face",pts:[p3,p2,[0,y1,0]],color:col,opacity:op,id:p.id});
      }
      return out;
    },

    cone(p){
      const r=p.size?.[0]??.5, h=p.size?.[1]??1, ns=p.seg||14, y0=-h/2, y1=h/2;
      const col=p.color||"#8b98ad", op=p.opacity??1, out=[];
      const apex=[0,y1,0];
      for (let j=0;j<ns;j++){
        const a0=2*Math.PI*j/ns, a1=2*Math.PI*(j+1)/ns;
        const p0=[r*Math.cos(a0),y0,r*Math.sin(a0)], p1=[r*Math.cos(a1),y0,r*Math.sin(a1)];
        out.push({kind:"face",pts:[p0,p1,apex],color:col,opacity:op,id:p.id});
        out.push({kind:"face",pts:[p0,[0,y0,0],p1],color:col,opacity:op,id:p.id});
      }
      return out;
    },

    plane(p){
      const w=(p.size?.[0]??2)/2, d=(p.size?.[1]??2)/2;
      const v=[[-w,0,-d],[w,0,-d],[w,0,d],[-w,0,d]];
      return [{ kind:"face", pts:[v[0],v[1],v[2]], color:p.color||"#8b98ad", opacity:p.opacity??.4, id:p.id },
              { kind:"face", pts:[v[0],v[2],v[3]], color:p.color||"#8b98ad", opacity:p.opacity??.4, id:p.id }];
    },

    ring(p){
      const R=p.size?.[0]??1, r=p.size?.[1]??.2, ns=p.seg||20, nl=7;
      const col=p.color||"#8b98ad", op=p.opacity??.9, out=[];
      const grid=[];
      for (let i=0;i<=nl;i++){
        const th=2*Math.PI*i/nl, row=[];
        for (let j=0;j<=ns;j++){
          const ph=2*Math.PI*j/ns;
          row.push([(R+r*Math.cos(th))*Math.cos(ph), r*Math.sin(th), (R+r*Math.cos(th))*Math.sin(ph)]);
        }
        grid.push(row);
      }
      for (let i=0;i<nl;i++) for (let j=0;j<ns;j++){
        out.push({kind:"face",pts:[grid[i][j],grid[i+1][j],grid[i+1][j+1]],color:col,opacity:op,id:p.id});
        out.push({kind:"face",pts:[grid[i][j],grid[i+1][j+1],grid[i][j+1]],color:col,opacity:op,id:p.id});
      }
      return out;
    },

    grid(p){
      const w=(p.size?.[0]??8)/2, d=(p.size?.[1]??8)/2, n=p.n||8;
      const col=p.color||"#2a3550", out=[];
      for (let i=0;i<=n;i++){
        const t=-w + (2*w)*i/n;
        out.push({kind:"stroke",pts:[[t,0,-d],[t,0,d]],color:col,width:p.width||1,id:p.id});
        const s=-d + (2*d)*i/n;
        out.push({kind:"stroke",pts:[[-w,0,s],[w,0,s]],color:col,width:p.width||1,id:p.id});
      }
      return out;
    },

    line(p){
      return [{ kind:"stroke", pts:[p.pos||[0,0,0], p.to||[1,1,1]], color:p.color||"#8b98ad", width:p.width||2, id:p.id }];
    },

    arc(p){
      const a=p.pos||[0,0,0], b=p.to||[1,0,0], h=p.height??1, seg=p.seg||26;
      const mid=[(a[0]+b[0])/2, (a[1]+b[1])/2+h, (a[2]+b[2])/2];
      const pts=[];
      for (let i=0;i<=seg;i++){
        const t=i/seg, u=1-t;
        pts.push([u*u*a[0]+2*u*t*mid[0]+t*t*b[0],
                  u*u*a[1]+2*u*t*mid[1]+t*t*b[1],
                  u*u*a[2]+2*u*t*mid[2]+t*t*b[2]]);
      }
      return [{ kind:"stroke", pts, color:p.color||"#8b98ad", width:p.width||2.4, id:p.id }];
    },

    bowl(p){
      const R=p.size?.[0]??2, D=p.size?.[1]??1, n=p.seg||12;
      const pts=[];
      for (let i=0;i<=n;i++) for (let j=0;j<=n;j++){
        const x=-R+2*R*i/n, z=-R+2*R*j/n;
        const r2=(x*x+z*z)/(R*R);
        pts.push([x, D*Math.min(r2,1), z]);
      }
      const idx=(i,j)=>i*(n+1)+j, out=[];
      for (let i=0;i<n;i++) for (let j=0;j<n;j++){
        out.push({kind:"face",pts:[pts[idx(i,j)],pts[idx(i+1,j)],pts[idx(i+1,j+1)]],color:p.color||"#f5c451",opacity:p.opacity??.5,id:p.id});
        out.push({kind:"face",pts:[pts[idx(i,j)],pts[idx(i+1,j+1)],pts[idx(i,j+1)]],color:p.color||"#f5c451",opacity:p.opacity??.5,id:p.id});
      }
      return out;
    },

    poly(p){
      const pts=p.pts||[];
      if (pts.length<3) return [];
      const cx=pts.reduce((a,q)=>a+q[0],0)/pts.length;
      const cy=pts.reduce((a,q)=>a+q[1],0)/pts.length;
      const cz=pts.reduce((a,q)=>a+q[2],0)/pts.length;
      const col=p.color||"#8b98ad", op=p.opacity??.6, out=[];
      for (let i=0;i<pts.length;i++){
        const a=pts[i], b=pts[(i+1)%pts.length];
        if (!p.closed && i===pts.length-1) break;
        out.push({kind:"face",pts:[a,b,[cx,cy,cz]],color:col,opacity:op,id:p.id});
      }
      return out;
    }
  };

  /* ---------- 挂载 ---------- */
  function mount(canvas, model, opts = {}){
    if (!canvas || !model || !Array.isArray(model.parts) || !model.parts.length) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const cam0 = model.camera || {};
    let yaw = cam0.yaw ?? 0.6, pitch = cam0.pitch ?? 0.35, dist = cam0.dist ?? 9;
    let autoRotate = opts.autoRotate !== false && !reduced;
    let vyaw = 0, vpitch = 0;
    let highlight = new Set(opts.focus || []);
    let hover = null, dragging = false, moved = 0, last = null;
    let disposed = false, paused = false;
    let W = 10, H = 10;
    const pickTargets = [];

    /* 几何缓存：模型静态，挂载时构建一次 */
    const items = [];
    const labels = [];
    const anchors = [];
    (model.parts || []).forEach(p => {
      const build = GEOM[p.type];
      if (!build) return;
      const r = p.rot || [0,0,0], pos = p.pos || [0,0,0];
      build(p).forEach(it => {
        it.pts = it.pts.map(pt => rot3([pt[0]+pos[0], pt[1]+pos[1], pt[2]+pos[2]], r));
        items.push(it);
      });
      const top = (p.size?.[1] ?? p.size?.[0] ?? 1) / 2;
      labels.push({ id:p.id, text:p.label || "", at:[pos[0], pos[1]+top+.38, pos[2]], color:p.color || C.text });
      anchors.push({ kind:"part", id:p.id, at:pos, data:p });
    });
    (model.marks || []).forEach((mk, i) => {
      anchors.push({ kind:"mark", id:mk.id || ("m"+(i+1)), at:mk.at || [0,0,0], data:mk, no:i+1 });
    });

    /* 尺寸与 DPR */
    function resize(){
      const rect = canvas.getBoundingClientRect();
      W = Math.max(rect.width, 10);
      H = Math.max(rect.height || rect.width * .625, 10);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* 投影：先绕 yaw（水平）再绕 pitch（俯仰），相机位于 +dist */
    function project(pt){
      let x = pt[0], y = pt[1], z = pt[2];
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const x1 = x*cy + z*sy, z1 = -x*sy + z*cy;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const y1 = y*cp - z1*sp, z2 = y*sp + z1*cp;
      const depth = dist - z2;
      if (depth < .15) return null;
      const f = Math.min(W, H) * .92;
      const s = f / depth;
      return { x: W/2 + x1*s, y: H/2 - y1*s, depth };
    }

    /* 平行光方向 */
    const L = (()=>{ const l=[-.38,.76,.53]; const m=Math.hypot(...l); return l.map(v=>v/m); })();

    function draw(time){
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "rgba(14,22,42,.92)");
      bg.addColorStop(1, "rgba(7,11,20,.96)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const drawables = [];
      for (const it of items){
        const pts = it.pts.map(project);
        if (pts.some(p => !p)) continue;
        const depth = pts.reduce((a,p)=>a+p.depth, 0) / pts.length;
        drawables.push({ it, pts, depth });
      }
      drawables.sort((a, b) => b.depth - a.depth);

      for (const d of drawables){
        const dim = highlight.size > 0 && !highlight.has(d.it.id);
        if (d.it.kind === "face"){
          const n = faceNormal(d.it.pts[0], d.it.pts[1], d.it.pts[2]);
          const nl = Math.hypot(...n) || 1;
          const nd = (n[0]*L[0] + n[1]*L[1] + n[2]*L[2]) / nl;
          const lum = .34 + .66 * Math.max(0, nd);
          ctx.globalAlpha = (d.it.opacity ?? 1) * (dim ? .35 : 1);
          ctx.beginPath();
          ctx.moveTo(d.pts[0].x, d.pts[0].y);
          for (let i = 1; i < d.pts.length; i++) ctx.lineTo(d.pts[i].x, d.pts[i].y);
          ctx.closePath();
          ctx.fillStyle = shade(d.it.color, lum * (dim ? .5 : 1));
          ctx.fill();
          ctx.globalAlpha = dim ? .3 : .8;
          ctx.strokeStyle = shade(d.it.color, Math.min(1, lum + .3));
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.globalAlpha = (d.it.opacity ?? 1) * (dim ? .3 : 1);
          ctx.beginPath();
          ctx.moveTo(d.pts[0].x, d.pts[0].y);
          for (let i = 1; i < d.pts.length; i++) ctx.lineTo(d.pts[i].x, d.pts[i].y);
          ctx.strokeStyle = d.it.color;
          ctx.lineWidth = d.it.width || 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      /* 部件标签 */
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const lb of labels){
        if (!lb.text) continue;
        const p = project(lb.at);
        if (!p) continue;
        const dim = highlight.size > 0 && !highlight.has(lb.id);
        ctx.font = `700 12px ${FONT}`;
        ctx.globalAlpha = dim ? .3 : 1;
        const w = ctx.measureText(lb.text).width + 14;
        ctx.fillStyle = "rgba(7,11,20,.78)";
        ctx.fillRect(p.x - w/2, p.y - 11, w, 22);
        ctx.fillStyle = shade(lb.color, dim ? .5 : 1.12);
        ctx.fillText(lb.text, p.x, p.y);
        ctx.globalAlpha = 1;
      }

      /* mark 锚点（金色脉冲编号点） */
      pickTargets.length = 0;
      const pulse = 1 + .14 * Math.sin(time / 340);
      for (const a of anchors){
        const p = project(a.at);
        if (!p) continue;
        if (a.kind === "part"){
          pickTargets.push({ kind:"part", id:a.id, sx:p.x, sy:p.y, r:20, data:a.data });
          continue;
        }
        const hov = hover && hover.kind === "mark" && hover.id === a.id;
        const r = (hov ? 15 : 12.5) * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 7, 0, Math.PI*2);
        ctx.fillStyle = "rgba(245,196,81,.13)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI*2);
        ctx.fillStyle = "rgba(7,11,20,.92)";
        ctx.fill();
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = `800 11px ${FONT}`;
        ctx.fillStyle = C.gold;
        ctx.fillText(String(a.no), p.x, p.y);
        pickTargets.push({ kind:"mark", id:a.id, sx:p.x, sy:p.y, r:r+9, data:a.data, no:a.no });
      }
    }

    /* 命中测试 */
    function hit(e){
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      let best = null, bd = Infinity;
      for (const t of pickTargets){
        const d = Math.hypot(t.sx - x, t.sy - y);
        if (d <= t.r && d < bd){ bd = d; best = t; }
      }
      return best;
    }
    function hitInfo(t){
      return t ? { kind:t.kind, id:t.id, data:t.data } : null;
    }

    /* 指针交互：拖拽旋转（带惯性） / 滚轮缩放 / 点击拾取 */
    canvas.addEventListener("pointerdown", e => {
      dragging = true; moved = 0; last = { x:e.clientX, y:e.clientY };
      vyaw = vpitch = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    });
    canvas.addEventListener("pointermove", e => {
      if (dragging && last){
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        yaw += dx * .008;
        pitch = clamp(pitch + dy * .006, -1.15, 1.15);
        vyaw = dx * .008; vpitch = dy * .006;
        last = { x:e.clientX, y:e.clientY };
        return;
      }
      const t = hit(e);
      const changed = (t?.id ?? null) !== (hover?.id ?? null) || (t?.kind ?? null) !== (hover?.kind ?? null);
      hover = t;
      canvas.style.cursor = t ? "pointer" : "grab";
      if (changed) opts.onHover?.(hitInfo(t));
    });
    ["pointerup", "pointercancel"].forEach(ev =>
      canvas.addEventListener(ev, e => {
        if (dragging && moved < 6){
          const t = hit(e);
          opts.onPick?.(hitInfo(t));
        }
        dragging = false; last = null;
        canvas.style.cursor = "grab";
      }));
    canvas.addEventListener("wheel", e => {
      e.preventDefault();
      dist = clamp(dist * (1 + e.deltaY * .0012), 3, 26);
    }, { passive:false });
    canvas.style.cursor = "grab";

    /* 渲染循环：仅在可见且未暂停时绘制 */
    let raf = 0, lastT = 0;
    function tick(t){
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (paused || document.hidden) { lastT = t; return; }
      const dt = Math.min(t - lastT, 50) || 16;
      lastT = t;
      if (!dragging && (Math.abs(vyaw) > 1e-4 || Math.abs(vpitch) > 1e-4)){
        const k = dt / 16;
        yaw += vyaw * k;
        pitch = clamp(pitch + vpitch * k, -1.15, 1.15);
        const decay = Math.pow(.92, k);
        vyaw *= decay; vpitch *= decay;
      }
      if (autoRotate && !dragging) yaw += .0022 * (dt / 16);
      draw(t);
    }
    raf = requestAnimationFrame(tick);

    return {
      setView(v){
        if (!v) return;
        if (v.yaw != null) yaw = v.yaw;
        if (v.pitch != null) pitch = clamp(v.pitch, -1.15, 1.15);
        if (v.dist != null) dist = clamp(v.dist, 3, 26);
      },
      getView(){ return { yaw, pitch, dist }; },
      focus(ids){ highlight = new Set(ids || []); },
      setAutoRotate(b){ autoRotate = !!b; },
      pause(){ paused = true; },
      resume(){ paused = false; },
      dispose(){ disposed = true; cancelAnimationFrame(raf); ro.disconnect(); }
    };
  }

  return { mount };
})();

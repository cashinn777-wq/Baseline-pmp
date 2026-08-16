function grade(q,ok,sure){
const c=card(q.id);
c.seen++;
if(ok){c.right++;c.box=Math.min(5,c.box+1)}
else{c.wrong++;c.box=1}
c.due=dayNum()+BOX_DAYS[c.box];
S.log.push({ts:Date.now(),id:q.id,ok,sure});
if(S.log.length>3000)S.log=S.log.slice(-3000);
touchDay();save();
}
/* ============================ icons ============================ */
const I={
study:'<path d="M4 5.5A1.5 1.5 0 015.5 4H10a3 3 0 013 3v12a2.5 2.5 0 00-2.5-2.5H4z"/><path d="M20 5.5A1.5 1.5 0 0018.5 4H14a3 3 0 00-3 3v12a2.5 2.5 0 012.5-2.5H20z"/>',
miss:'<path d="M12 8v5"/><path d="M12 16.5v.01"/><circle cx="12" cy="12" r="8.5"/>',
map:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
rules:'<path d="M5 4.5h11l3 3V19.5H5z"/><path d="M9 10h6"/><path d="M9 14h4"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M21 12h-2M5 12H3M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4L17 17M7 7L5.6 5.6"/>',
back:'<path d="M15 5l-7 7 7 7"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>'
};
const svg=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
/* ---------- 80-second pacing (240 min / 180 questions) ---------- */
let TICK=null,QSTART=0,TICKQ=-1;
function paceTick(){
clearInterval(TICK);
if(!S.pace||!SESS||VIEW!=="drill"||SESS.phase!=="answer"){TICKQ=-1;return}
if(TICKQ!==SESS.i){QSTART=Date.now();TICKQ=SESS.i}
const upd=()=>{
const el=document.getElementById("pace");
if(!el){clearInterval(TICK);return}
const n=Math.floor((Date.now()-QSTART)/1000);
el.textContent=n+"s / 80s";
el.className="pacev"+(n>110?" over":n>80?" warn":"");
};
upd(); TICK=setInterval(upd,1000);
}
/* ============================ router ============================ */
let VIEW="home";
function go(v){VIEW=v;render();window.scrollTo(0,0)}
function bar(title,sub,opts={}){
const left=opts.back?`<button class="iconbtn" data-${opts.backAct?"act":"go"}="${opts.back}" aria-label="Back">${svg(I.back)}</button>`:`<div style="width:42px"></div>`;
const right=opts.gear!==false?`<button class="iconbtn" data-go="settings" aria-label="Settings">${svg(I.gear)}</button>`:`<div style="width:42px"></div>`;
return `<div class="bar">${left}<h6 class="center">${title}${sub?`<small>${sub}</small>`:""}</h6>${right}</div>`;
}
function activityStrip(){
const cells=[];
for(let i=13;i>=0;i--){
const d=new Date(Date.now()-localOff()-i*864e5).toISOString().slice(0,10);
cells.push(`<i class="${S.days[d]?"s-did":""}${i===0?" s-today":""}"></i>`);
}
return `<div class="strip">${cells.join("")}</div>`;
}
function nav(){
const it=[["home","Study",I.study],["journal","Misses",I.miss],["map","ECO Map",I.map],["rules","Mindset",I.rules]];
return `<nav>${it.map(([v,l,ic])=>
`<button data-go="${v}" class="${VIEW===v?"on":""}">${svg(ic)}<span>${l}</span></button>`).join("")}</nav>`;
}
/* ============================ views ============================ */
function vHome(){
const d=daysToExam(), done=(S.days[today()]||0);
const acc=accuracy(), cw=confidentlyWrong();
return `<div class="view on">
${bar("Baseline","PMP · ECO July 2026")}
<div class="scroll">
<h1>${done?`${done} answered today`:"Ready when you are"}</h1>
<p class="sub">${d===null?"Ten questions. About five minutes.":
d>0?`${d} day${d===1?"":"s"} until your exam. Ten questions today keeps you on plan.`:
d===0?"Exam day. You've done the work.":"Exam date has passed — update it in settings."}</p>
<div class="stats">
<div class="stat"><b>${S.streak}</b><span>Day streak</span></div>
<div class="stat"><b>${S.log.length}</b><span>Answered</span></div>
<div class="stat"><b>${acc}%</b><span>Accuracy</span></div>
</div>
<div class="card tight">
<div class="eyebrow">Last 14 days</div>
${activityStrip()}
</div>
<div class="card">
<div class="row between" style="margin-bottom:10px">
<div class="eyebrow">ECO coverage</div>
<div class="num" style="font-size:13px;color:var(--muted)">${solidTasks()} / 26 solid</div>
</div>
${["P","R","B"].map(k=>{
const p=Math.round(domainProgress(k)*100);
return `<div style="margin-bottom:11px">
<div class="row between" style="margin-bottom:5px">
<span style="font-size:14px;font-weight:600">${ECO[k].name}</span>
<span class="num" style="font-size:12px;color:var(--muted)">${ECO[k].w}% of exam</span>
</div>
<div class="meter"><i style="width:${p}%"></i></div>
</div>`}).join("")}
</div>
${cw>0?`<div class="card tight warn">
<div class="eyebrow" style="color:var(--stop);margin-bottom:6px">Watch this</div>
<div style="font-size:15px;line-height:1.45">You've been <b>sure and wrong ${cw} time${cw===1?"":"s"}</b>. That's the most dangerous state to walk into the exam with — those are in your Misses.</div>
</div>`:""}
<div class="card tight">
<p class="note" style="margin:0">Built on PMI's July 2026 Exam Content Outline — People 33%, Process 41%, Business Environment 26%, and roughly 60% adaptive or hybrid. Use this daily, and still sit two full-length simulators before exam day. Nothing pocket-sized replaces the four-hour rehearsal.</p>
</div>
</div>
<div class="dock">
<button class="btn primary" data-act="start">Start 10 questions</button>
<div class="modes">
<button class="modebtn" data-act="startlogic"><b>Logic 10</b><span>Argument &amp; language drills</span></button>
<button class="modebtn" data-act="startcase"><b>Case set</b><span>How the exam opens</span></button>
</div>
</div>
${nav()}</div>`;
}
function vDrill(){
if(!SESS)return vHome();
const q=SESS.qs[SESS.i];
if(!q)return vSummary();
const fb=SESS.phase==="feedback";
const P=SESS.perms[SESS.i];
const isMR=q.k==="mr";
const cDisp=isMR?q.c.map(x=>P.indexOf(x)).sort((a,b)=>a-b):P.indexOf(q.c);
const chosenDisp=isMR?[...SESS.multi].sort((a,b)=>a-b):SESS.sel;
const ready=isMR?SESS.multi.length===q.pick:SESS.sel!==null;
const gfxHtml=q.k==="gfx"?({burndown:gBurndown,evm:gEVM,raci:gRACI}[q.g])(q.gd):"";
const cs=SESS.mode==="case"?SESS.caseObj:null;
const segs=SESS.qs.map((_,i)=>{
const r=SESS.results[i];
return `<i class="${r?(r.ok?"s-ok":"s-bad"):(i===SESS.i?"s-now":"")}"></i>`;
}).join("");
const onPlan=SESS.results.filter(x=>x.ok).length;
return `<div class="view on">
${bar(`Question ${SESS.i+1} / ${SESS.qs.length}`,
SESS.mode==="logic"?"LOGIC DRILL":SESS.mode==="case"?"CASE SET":
SESS.mode==="task"?SESS.taskName.toUpperCase():(ECO[q.d]?ECO[q.d].name.toUpperCase():"DRILL"),
{back:"quit",backAct:true,gear:false})}
<div class="plan">
<div class="plan-bar">${segs}</div>
<div class="plan-meta">
<span>Plan</span>
${S.pace?`<span id="pace" class="pacev">0s / 80s</span>`:""}
<span>${onPlan} on plan · ${SESS.results.length-onPlan} variance</span>
</div>
</div>
<div class="qwrap">
<div class="qtags">
${q.k==="logic"
? `<span class="tag logic">${esc(LTYPE[q.lt].n)}</span>`
: `<span class="tag">${ECO[q.d].name} · Task ${q.t}</span><span class="tag mode">${modeLabel[q.m]}</span>`}
${isMR?`<span class="tag mr">Select ${q.pick}</span>`:""}
${q.k==="gfx"?`<span class="tag mr">Graphic</span>`:""}
</div>
${cs&&SESS.i>0?`<p class="ask" style="margin-bottom:14px">${esc(q.q)}</p>`:""}
${cs?`<div class="casebox">
<button class="casehead" data-act="togglecase">
<span class="eyebrow">Case · ${esc(cs.title)}</span>
<span class="chev">${SESS.caseOpen?"Hide":"Show"}</span>
</button>
${SESS.caseOpen?`<div class="casebody">${cs.s.split("\n\n").map(x=>`<p>${esc(x)}</p>`).join("")}</div>`:""}
</div>`:""}
${gfxHtml?`<div class="gfxwrap">${gfxHtml}${q.cap?`<p class="gfxcap">${esc(q.cap)}</p>`:""}</div>`:""}
${q.s?`<p class="scenario">${esc(q.s)}</p>`:""}
${cs&&SESS.i>0?"":`<p class="ask">${esc(q.q)}</p>`}
<div class="opts">
${P.map((orig,i)=>{
let cls="opt";
const isRight=isMR?cDisp.includes(i):i===cDisp;
const wasPicked=isMR?SESS.multi.includes(i):SESS.sel===i;
if(fb){ if(isRight)cls+=" right"; else if(wasPicked)cls+=" wrong"; }
else{ if(SESS.killed.includes(i))cls+=" dead"; if(wasPicked)cls+=" sel"; }
const kill=(!fb&&S.elim)?`<span class="xkill" data-kill="${i}">✕</span>`:"";
const why=fb?`<div class="why ${isRight?"good":"bad"}"><b>${isRight?(isMR?"Correct selection":"Why this is the answer"):(isMR?"Not a correct selection":"Why not this")}</b>${esc(q.e[orig])}</div>`:"";
const aria=fb?`aria-disabled="true"`:`aria-pressed="${wasPicked}"`;
return `<div><button class="${cls}" data-opt="${i}" ${aria}>
<span class="key">${"ABCDE"[i]}</span><span class="txt">${esc(q.o[orig])}</span>${kill}
</button>${why}</div>`;
}).join("")}
</div>
${fb?(q.k==="logic"
? `<div class="rulebox fadein"><span class="eyebrow">Technique · ${esc(LTYPE[q.lt].n)}</span><p>${esc(LTYPE[q.lt].p)}</p></div>`
: `<div class="rulebox fadein"><span class="eyebrow">Mindset rule · ${esc(RULES[q.r].n)}</span><p>${esc(RULES[q.r].p)}</p></div>`):""}
${fb&&SESS.results[SESS.i]&&!SESS.results[SESS.i].ok?`
<div class="fadein" style="margin-top:18px">
<div class="eyebrow" style="margin-bottom:2px">Why did you miss it?</div>
<p class="note" style="margin:4px 0 0">One tap. This is what the Misses tab is built from.</p>
<div class="cause">${Object.entries(CAUSES).map(([k,v])=>
`<button class="btn ${SESS.results[SESS.i].cause===k?"plan":"ghost"}" data-cause="${k}">${v}</button>`).join("")}</div>
</div>`:""}
<div style="height:12px"></div>
</div>
<div class="dock">
${fb
? `<button class="btn primary" data-act="next">${SESS.i+1<SESS.qs.length?"Next question":"See results"}</button>`
: `<div class="pair">
<button class="btn primary" data-act="lock" data-sure="1" ${!ready||(S.elim&&!isMR&&SESS.killed.length<2)?"disabled":""}>I'm sure</button>
<button class="btn ghost" data-act="lock" data-sure="0" ${!ready||(S.elim&&!isMR&&SESS.killed.length<2)?"disabled":""}>Not sure</button>
</div>
<p class="hint">${isMR
? (SESS.multi.length<q.pick?`Choose ${q.pick-SESS.multi.length} more · all or nothing`:"No partial credit — check both")
: (S.elim?(SESS.killed.length<2?`Rule out ${2-SESS.killed.length} more first`:"Now choose the best remaining"):"Guessing is data too")}</p>`}
</div></div>`;
}
function missedHtml(r){
const bad=r.filter(x=>!x.ok);
if(!bad.length)return `<p class="note">Nothing missed this round.</p>`;
const rows=bad.map(x=>{
const q=byId(x.id);
const line=q.q.length>60?q.q:q.s.slice(0,120)+"\u2026";
return `<div class="miss">
<span class="pill unknown">${esc(qLabel(q))}</span>
<p class="q">${esc(line)}</p>
<p class="note" style="margin:0"><b style="color:var(--amber)">${esc(qRule(q))}</b></p>
</div>`;
}).join("");
return `<h2 style="margin-top:0">Missed</h2>`+rows;
}
function vSummary(){
const r=SESS.results, n=r.length, ok=r.filter(x=>x.ok).length;
const sureRight=r.filter(x=>x.sure&&x.ok).length;
const sureWrong=r.filter(x=>x.sure&&!x.ok).length;
const unsureRight=r.filter(x=>!x.sure&&x.ok).length;
return `<div class="view on">
${bar("Session complete","",{gear:false})}
<div class="scroll">
<div class="score"><b>${ok}</b><span>/ ${n}</span></div>
<p class="sub" style="margin-top:8px">${
ok===n?"Clean sweep. Come back tomorrow — spacing is what makes it stick.":
ok>=n*.7?"Solid. The misses are already filed with the rule you slipped on.":
"This is the useful kind of session. Every miss below is a gap you now know about."}</p>
<h2 style="margin-top:8px">How well you knew it</h2>
<div class="calib">
<div><b style="color:var(--go)">${sureRight}</b><span>Sure and right</span></div>
<div><b style="color:var(--stop)">${sureWrong}</b><span>Sure and wrong</span></div>
<div><b style="color:var(--amber)">${unsureRight}</b><span>Right but guessing</span></div>
</div>
<p class="note" style="margin-top:12px">${
sureWrong>0?"Sure and wrong is the number to drive to zero. It means a rule you believe is the wrong rule — not a fact you're missing.":
unsureRight>0?"Right but guessing means the knowledge isn't stable yet. Those cards will come back sooner.":
"Your confidence matched your performance. That's calibration, and it's rarer than it sounds."}</p>
<div class="divider"></div>
${missedHtml(r)}
</div>
<div class="dock">
<button class="btn primary" data-act="start">Ten more</button>
<button class="btn quiet" data-go="home">Done for now</button>
</div></div>`;
}
function vJournal(){
const counts={misread:0,unknown:0,company:0,none:0};
S.misses.forEach(m=>counts[m.cause||"none"]++);
const list=[...S.misses].reverse().slice(0,60);
return `<div class="view on">
${bar("Mistake journal")}
<div class="scroll">
<h1>${S.misses.length} miss${S.misses.length===1?"":"es"}</h1>
<p class="sub">Not a scoreboard. A map of which instinct is costing you.</p>
${S.misses.length?`
<div class="stats" style="grid-template-columns:repeat(3,1fr)">
<div class="stat"><b style="color:var(--stop)">${counts.company}</b><span>Company's way</span></div>
<div class="stat"><b style="color:var(--amber)">${counts.misread}</b><span>Misread</span></div>
<div class="stat"><b>${counts.unknown}</b><span>Didn't know</span></div>
</div>
${counts.company>=3?`<div class="card tight warn">
<div class="eyebrow" style="color:var(--stop);margin-bottom:6px">The pattern that fails people</div>
<div style="font-size:15px;line-height:1.45">${counts.company} of your misses came from answering the way your workplace would. That's the single most common reason experienced project managers fail this exam. Read the Mindset tab before your next session.</div>
</div>`:""}
<h2>Every miss</h2>
${list.map(m=>{const q=byId(m.id);if(!q)return"";
return `<div class="miss">
<span class="pill ${m.cause||"unknown"}">${m.cause?CAUSES[m.cause]:"Untagged"}</span>
<p class="q">${esc(q.q)}</p>
<p class="note" style="margin:0 0 6px">${Array.isArray(m.chosen)
? `Select-${q.pick} question — you missed the exact set`
: `You chose <b style="color:var(--stop)">${"ABCDE"[m.chosen]}</b> · answer was <b style="color:var(--go)">${"ABCDE"[q.c]}</b>`}</p>
<p class="note" style="margin:0"><b style="color:var(--amber)">${esc(qRule(q))}</b> — ${esc(qLabel(q))}</p>
</div>`}).join("")}
`:`<div class="empty"><p>Nothing here yet. Misses show up automatically with the rule you slipped on and why the right answer was right.</p>
<button class="btn primary" data-act="start">Start a session</button></div>`}
</div>${nav()}</div>`;
}

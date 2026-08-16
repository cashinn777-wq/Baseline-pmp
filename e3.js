function vMap(){
return `<div class="view on">
${bar("ECO status board","Exam content outline · July 2026")}
<div class="scroll">
<h1>26 tasks</h1>
<p class="sub">PMI's actual blueprint — every exam question maps to one of these. A bar fills as you answer that task's questions correctly and they survive their review intervals. <b style="color:var(--amber)">Tap any task to drill just that one.</b></p>
${["P","R","B"].map(d=>`
<div class="dgroup">
<div class="dhead"><h2 style="margin:0">${ECO[d].name}</h2><span class="w">${ECO[d].w}% of exam</span></div>
<div class="grid">
${Object.entries(ECO[d].tasks).map(([t,name])=>{
const p=Math.round(taskProgress(d,+t)*100);
const cnt=ALLQ.filter(x=>x.d===d&&+x.t===+t).length;
return `<button class="cell ${p>=60?"solid":p>0?"part":""}" data-task="${d}${t}">
<span class="tno">Task ${t} · ${cnt} q${p>=60?" · solid":""}</span>
<span class="tname">${esc(name)}</span>
<div class="meter"><i style="width:${p}%"></i></div>
</button>`}).join("")}
</div>
</div>`).join("")}
</div>${nav()}</div>`;
}
function vRules(){
return `<div class="view on">
${bar("The PMI mindset")}
<div class="scroll">
<h1>Eight rules</h1>
<p class="sub">Over 80% of the exam is situational, and all four options usually look reasonable. These are the filters that separate the best answer from the merely correct one. Write them down before the exam starts.</p>
${Object.entries(RULES).map(([k,r],i)=>`
<div class="rule">
<span class="eyebrow">Rule ${String(i+1).padStart(2,"0")}</span>
<h3>${esc(r.n)}</h3>
<p>${esc(r.p)}</p>
<p class="look"><b>Looks like:</b> ${esc(r.good)}<br><i>Not:</i> ${esc(r.bad)}</p>
</div>`).join("")}
<div class="card">
<span class="eyebrow" style="color:var(--amber)">On the maths</span>
<h3 style="font-family:var(--display);font-size:18px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin:5px 0 8px">You won't calculate. You will interpret.</h3>
<p style="margin:0;font-size:15px;line-height:1.5">The July 2026 exam has eight question formats and none of them accept a typed number, so drilling EAC and TCPI formulas is wasted time. But graphic-based questions are new and explicitly involve reading burndown charts, earned value graphs, dashboards and RACI matrices. Know what CPI below 1.0 means, what a flat burndown is telling you, what a widening cost curve implies. Meaning, not maths.</p>
</div>
<h2>Reading the question</h2>
<p class="sub">Seven techniques for when the scenario runs away from you. Drill them under <b>Logic 10</b> on the Study tab.</p>
${Object.entries(LTYPE).map(([k,r])=>`
<div class="rule">
<span class="eyebrow" style="color:var(--go)">Technique</span>
<h3>${esc(r.n)}</h3>
<p>${esc(r.p)}</p>
</div>`).join("")}
<div class="card tight">
<span class="eyebrow">Exam structure</span>
<p class="note" style="margin:6px 0 0">180 questions in 240 minutes — exactly 80 seconds each. The exam opens with a case-study section, and the first break comes right after it. Once you start a break you cannot return to the previous section, so finish your review before you stand up.</p>
</div>
</div>${nav()}</div>`;
}
function vSettings(){
const total=ALLQ.length;
return `<div class="view on">
${bar("Settings","",{back:"home",gear:false})}
<div class="scroll">
<label class="field"><span>Exam date</span>
<input type="date" id="ed" value="${S.examDate||""}"></label>
<div class="toggle">
<div><div class="lbl">Elimination trainer</div>
<div class="desc">Rule out two options before you can answer. Slower, and the closest thing to how the exam is actually beaten.</div></div>
<button class="sw ${S.elim?"on":""}" data-toggle="elim" aria-label="Elimination trainer"><i></i></button>
</div>
<div class="toggle">
<div><div class="lbl">Pacing timer</div>
<div class="desc">The real exam gives you 80 seconds per question. Shows a live count and warns when you run over.</div></div>
<button class="sw ${S.pace?"on":""}" data-toggle="pace" aria-label="Pacing timer"><i></i></button>
</div>
<label class="field" style="margin-top:16px"><span>Reading size</span></label>
<div class="modes" style="grid-template-columns:repeat(3,1fr);margin:-8px 0 18px">
${[["md","Normal"],["lg","Large"],["xl","Largest"]].map(([k,l])=>
`<button class="btn ${S.fs===k?"primary":"ghost"}" style="font-size:14px;min-height:46px" data-fs="${k}">${l}</button>`).join("")}
</div>
<div class="toggle">
<div><div class="lbl">Light theme</div>
<div class="desc">Easier outdoors and in bright rooms.</div></div>
<button class="sw ${S.theme==="light"?"on":""}" data-toggle="theme" aria-label="Light theme"><i></i></button>
</div>
<h2>Your progress</h2>
<p class="note">Everything lives on this device only — nothing is uploaded and there is no account. Safari can clear site storage after long inactivity, so export a backup now and then.</p>
<div style="height:12px"></div>
<button class="btn ghost" data-act="export">Export a backup file</button>
<div style="height:9px"></div>
<label class="field" style="margin:0"><span>Restore from a backup</span>
<input type="file" id="imp" accept="application/json"></label>
<div class="divider"></div>
<p class="note">${ALLQ.length} questions across all 26 ECO tasks — including ${MR.length} multiple-response, ${GFX.length} graphic-based, ${LOGIC.length} logic drills and ${CASES.length} case sets. ${S.log.length} answers recorded.</p>
<div style="height:14px"></div>
<button class="btn quiet" data-act="reset" style="color:var(--stop);border-color:color-mix(in srgb,var(--stop) 45%,var(--rule))">Erase all progress</button>
<div style="height:20px"></div>
</div></div>`;
}
/* ============================ render ============================ */
function render(){
document.documentElement.dataset.theme=S.theme;
document.documentElement.dataset.fs=S.fs||"md";
document.querySelector('meta[name=theme-color]').content=S.theme==="light"?"#EEF2F8":"#0D1626";
const map={home:vHome,drill:vDrill,summary:vSummary,journal:vJournal,map:vMap,rules:vRules,settings:vSettings};
app.innerHTML=(map[VIEW]||vHome)();
const ed=$("#ed");if(ed)ed.onchange=e=>{S.examDate=e.target.value;save();render()};
const im=$("#imp");if(im)im.onchange=doImport;
paceTick();
}
/* ============================ events ============================ */
app.addEventListener("click",e=>{
const t=e.target.closest("[data-go],[data-act],[data-opt],[data-kill],[data-cause],[data-toggle],[data-task],[data-fs]");
if(!t)return;
if(t.dataset.kill!==undefined){
e.stopPropagation();
const i=+t.dataset.kill;
if(SESS.phase!=="answer"||SESS.qs[SESS.i].k==="mr")return;
const k=SESS.killed.indexOf(i);
if(k>=0)SESS.killed.splice(k,1);
else if(SESS.killed.length<3){SESS.killed.push(i);if(SESS.sel===i)SESS.sel=null}
return render();
}
if(t.dataset.task){
const d=t.dataset.task[0], tn=+t.dataset.task.slice(1);
buildSession(10,"task",{d,t:tn});VIEW="drill";return render();
}
if(t.dataset.go)return go(t.dataset.go);
if(t.dataset.opt!==undefined){
if(SESS.phase!=="answer")return;
const i=+t.dataset.opt, q=SESS.qs[SESS.i];
if(SESS.killed.includes(i))return;
if(q.k==="mr"){
const j=SESS.multi.indexOf(i);
if(j>=0)SESS.multi.splice(j,1);
else if(SESS.multi.length<q.pick)SESS.multi.push(i);
else{SESS.multi.shift();SESS.multi.push(i)}
} else SESS.sel=i;
return render();
}
if(t.dataset.act==="togglecase"){SESS.caseOpen=!SESS.caseOpen;return render()}
if(t.dataset.cause){
const r=SESS.results[SESS.i];r.cause=t.dataset.cause;
const m=S.misses.find(x=>x.ts===r.ts);if(m)m.cause=t.dataset.cause;
save();return render();
}
if(t.dataset.toggle==="elim"){S.elim=!S.elim;save();return render()}
if(t.dataset.toggle==="pace"){S.pace=!S.pace;save();return render()}
if(t.dataset.fs){S.fs=t.dataset.fs;save();return render()}
if(t.dataset.toggle==="theme"){S.theme=S.theme==="light"?"dark":"light";save();return render()}
const a=t.dataset.act;
if(a==="start"){buildSession(10,"mix");VIEW="drill";return render()}
if(a==="startlogic"){buildSession(10,"logic");VIEW="drill";return render()}
if(a==="startcase"){buildSession(10,"case");VIEW="drill";return render()}
if(a==="quit"){SESS=null;return go("home")}
if(a==="lock"){
const q=SESS.qs[SESS.i],sure=t.dataset.sure==="1",P=SESS.perms[SESS.i];
let chosen,ok;
if(q.k==="mr"){
chosen=SESS.multi.map(i=>P[i]).sort((a,b)=>a-b);
const want=[...q.c].sort((a,b)=>a-b);
ok=chosen.length===want.length&&chosen.every((v,n)=>v===want[n]);
} else { chosen=P[SESS.sel]; ok=chosen===q.c; }
const ts=Date.now();
grade(q,ok,sure);
SESS.results[SESS.i]={id:q.id,ok,sure,ts,cause:null};
if(!ok){S.misses.push({id:q.id,ts,chosen,cause:null});if(S.misses.length>500)S.misses=S.misses.slice(-500);save()}
SESS.phase="feedback";return render();
}
if(a==="next"){
SESS.i++;SESS.sel=null;SESS.multi=[];SESS.killed=[];SESS.phase="answer";
if(SESS.mode==="case")SESS.caseOpen=SESS.i===0;
if(SESS.i>=SESS.qs.length){VIEW="summary"}
return render();
}
if(a==="export"){
const b=new Blob([JSON.stringify(S)],{type:"application/json"});
const u=URL.createObjectURL(b),l=document.createElement("a");
l.href=u;l.download="baseline-pmp-"+today()+".json";l.click();
setTimeout(()=>URL.revokeObjectURL(u),1500);return;
}
if(a==="reset"){
if(confirm("Erase every answer, miss, and streak on this device? This cannot be undone.")){
S=blank();save();SESS=null;return go("home");
}
}
});
function doImport(e){
const f=e.target.files[0];if(!f)return;
const r=new FileReader();
r.onload=()=>{try{
const d=JSON.parse(r.result);
if(!d||typeof d!=="object"||!("cards"in d))throw 0;
S=Object.assign(blank(),d);save();alert("Progress restored.");go("home");
}catch(x){alert("That file isn't a Baseline backup. Pick the .json file the export button created.")}};
r.readAsText(f);
}
document.addEventListener("keydown",e=>{
if(VIEW!=="drill"||!SESS)return;
if(SESS.phase==="answer"&&/^[a-dA-D]$/.test(e.key)){
const i="abcd".indexOf(e.key.toLowerCase());
if(!SESS.killed.includes(i)){SESS.sel=i;render()}
}
if(e.key==="Enter"){
const b=document.querySelector('[data-act="next"],[data-act="lock"][data-sure="1"]:not([disabled])');
if(b)b.click();
}
});
render();


const LOGIC=LOGICD;
const CASES=CASESD;
const BANK=QALL;
const MR=QALL.filter(q=>q.k==="mr");
const GFX=QALL.filter(q=>q.k==="gfx");
const FILL=[];
/* ============================================================
BASELINE — PMP drill, built on PMI's July 2026 ECO
Domains: People 33% / Process 41% / Business Environment 26%
============================================================ */
const ALLQ=[];
const ECO = {
P:{name:"People",w:33,tasks:{
1:"Develop a common vision",2:"Manage conflicts",3:"Lead the project team",4:"Engage stakeholders",
5:"Align stakeholder expectations",6:"Manage stakeholder expectations",7:"Help ensure knowledge transfer",
8:"Plan and manage communication"}},
R:{name:"Process",w:41,tasks:{
1:"Develop an integrated plan and plan delivery",2:"Develop and manage project scope",
3:"Help ensure value-based delivery",4:"Plan and manage resources",5:"Plan and manage procurement",
6:"Plan and manage finance",7:"Plan and optimize quality",8:"Plan and manage schedule",
9:"Evaluate project status",10:"Manage project closure"}},
B:{name:"Business Environment",w:26,tasks:{
1:"Define and establish project governance",2:"Plan and manage project compliance",
3:"Manage and control changes",4:"Remove impediments and manage issues",5:"Plan and manage risk",
6:"Continuous improvement",7:"Support organizational change",8:"Evaluate external business environment"}}
};
const RULES = {
assess:{n:"Assess before acting",
p:"The first move is almost never the fix. It's understanding. Look for analyze, review, investigate, determine the impact, root cause.",
good:"Assess the impact · Review the plan · Determine the cause",
bad:"Immediately implement · Quickly add resources · Tell them to proceed"},
escalate:{n:"Never pass the buck",
p:"You are the project manager. Work the options you have, then bring leadership a recommendation — not a question. Escalating first is the single most common wrong answer.",
good:"Resolve with the team, then inform · Present a recommended option",
bad:"Ask the sponsor what to do · Escalate to the PMO · Wait for direction"},
servant:{n:"Serve the team, don't command it",
p:"When the team is involved, the answer that includes or empowers them beats the one that solves it for them. In agile scenarios you remove impediments — you don't assign work or set the sprint scope.",
good:"Facilitate a discussion · Remove the impediment · Let the team estimate",
bad:"Assign the task yourself · Decide the sprint scope · Reassign without asking"},
change:{n:"Every change goes through change control",
p:"Nothing quietly absorbs scope. Even a small, free, well-intentioned change gets logged, assessed for impact, and approved before any work starts.",
good:"Submit a change request · Assess impact, then route to the CCB",
bad:"Absorb it to keep goodwill · Add it if the team has slack · Approve it yourself"},
mode:{n:"Read the vocabulary for the mode",
p:"Sprint, backlog, product owner, retrospective, increment → answer as agile. CCB, WBS, baseline, variance, EAC → answer as predictive. No signal at all → default predictive: check the plan first.",
good:"Match the ceremony to the framework named",
bad:"Applying baselines to a sprint · Applying a CCB to a backlog"},
direct:{n:"Go to the source, face to face",
p:"Conflict is resolved with the people in it, directly and privately, before anyone else is involved. Collaborate to a real solution rather than smoothing, avoiding, or forcing.",
good:"Meet with both privately · Facilitate between them",
bad:"Email the whole team · Report them to their manager · Let it settle on its own"},
value:{n:"Protect value, not just scope",
p:"The exam's definition of success is delivered value, not a green schedule. Work that no longer produces benefit gets challenged, reprioritized, or stopped.",
good:"Reprioritize the backlog by value · Re-examine the business case",
bad:"Deliver it anyway because it's in scope · Ignore the changed benefit"},
safety:{n:"Safety and compliance override everything",
p:"The one time a PM acts immediately without checking a plan is an active threat to health, safety, or the law. Never conceal, delay, or negotiate a compliance breach.",
good:"Stop the work · Report it immediately · Notify the regulator",
bad:"Finish the phase first · Handle it internally and quietly"}
};
/* ================= LOGIC DRILLS — argument & language work ================= */
const LTYPE={
weaken:{n:"Weakens the conclusion",p:"Find the fact that makes the stated conclusion less likely. Not the fact you dislike — the one that breaks the link between the evidence and the claim."},
strengthen:{n:"Strengthens the conclusion",p:"Find the fact that makes the conclusion more likely. It usually closes a gap the argument quietly assumed."},
assume:{n:"Hidden assumption",p:"What must be true for this conclusion to hold? Name the invisible bridge between the evidence and the claim. If the bridge breaks, the argument falls."},
distractor:{n:"Name the trap",p:"PMP wrong answers fail in predictable ways. Classify the failure and you stop having to interpret it."},
signal:{n:"Operative word",p:"The same scenario has different answers depending on one word. Find the word that sets the task."},
negative:{n:"Negative stem",p:"NOT, EXCEPT, LEAST. Three of the options are correct behaviour and you are hunting the one that isn't. Read the stem twice."},
facts:{n:"Strip to the facts",p:"Reduce the scenario to who is involved, what changed, and what is at stake. Everything else is padding."}
};
/* ================= MULTIPLE RESPONSE — no partial credit ================= */
/* ================= GRAPHIC-BASED — one of only two new formats ================= */
function gBurndown(d){
const W=300,H=150,pad=26, n=d.ideal.length-1, max=Math.max(...d.ideal,...d.actual);
const X=i=>pad+i*(W-pad-8)/n, Y=v=>H-20-(v/max)*(H-38);
const path=a=>a.map((v,i)=>`${i?"L":"M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
return `<svg viewBox="0 0 ${W} ${H}" class="gfx" role="img" aria-label="Sprint burndown chart">
<line x1="${pad}" y1="${H-20}" x2="${W-8}" y2="${H-20}" class="ax"/>
<line x1="${pad}" y1="12" x2="${pad}" y2="${H-20}" class="ax"/>
<path d="${path(d.ideal)}" class="ideal"/>
<path d="${path(d.actual)}" class="actual"/>
${d.actual.map((v,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" class="dot"/>`).join("")}
<text x="${pad-5}" y="16" class="lab" text-anchor="end">${max}</text>
<text x="${pad-5}" y="${H-17}" class="lab" text-anchor="end">0</text>
<text x="${pad}" y="${H-7}" class="lab">Day 1</text>
<text x="${W-8}" y="${H-7}" class="lab" text-anchor="end">Day ${n+1}</text>
<text x="${W-8}" y="20" class="lab lg" text-anchor="end">— ideal · ● actual</text>
</svg>`;
}
function gEVM(d){
const W=300,H=150,pad=30,n=d.pv.length-1,max=Math.max(...d.pv,...d.ev,...d.ac);
const X=i=>pad+i*(W-pad-8)/n, Y=v=>H-20-(v/max)*(H-38);
const path=a=>a.map((v,i)=>`${i?"L":"M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
return `<svg viewBox="0 0 ${W} ${H}" class="gfx" role="img" aria-label="Earned value chart">
<line x1="${pad}" y1="${H-20}" x2="${W-8}" y2="${H-20}" class="ax"/>
<line x1="${pad}" y1="12" x2="${pad}" y2="${H-20}" class="ax"/>
<path d="${path(d.pv)}" class="pv"/><path d="${path(d.ev)}" class="ev"/><path d="${path(d.ac)}" class="ac"/>
<text x="${pad-5}" y="16" class="lab" text-anchor="end">$${max}k</text>
<text x="${pad}" y="${H-7}" class="lab">Month 1</text>
<text x="${W-8}" y="${H-7}" class="lab" text-anchor="end">Month ${n+1}</text>
<text x="${W-8}" y="20" class="lab lg" text-anchor="end">PV · EV · AC</text>
</svg>`;
}
function gRACI(d){
const cols=d.cols,rows=d.rows,W=300,cw=(W-96)/cols.length,rh=22,H=26+rows.length*rh;
let out=`<svg viewBox="0 0 ${W} ${H}" class="gfx" role="img" aria-label="Responsibility assignment matrix">`;
cols.forEach((c,j)=>out+=`<text x="${96+cw*j+cw/2}" y="14" class="lab" text-anchor="middle">${c}</text>`);
rows.forEach((r,i)=>{
out+=`<text x="0" y="${34+i*rh}" class="lab rw">${r.n}</text>`;
r.v.forEach((v,j)=>{
out+=`<rect x="${96+cw*j+2}" y="${22+i*rh}" width="${cw-4}" height="${rh-5}" class="cellbox"/>`;
if(v)out+=`<text x="${96+cw*j+cw/2}" y="${36+i*rh}" class="raci r-${v}" text-anchor="middle">${v}</text>`;
});
});
return out+"</svg>";
}
/* ================= CASE SETS — the exam opens with these ================= */
CASES.forEach(c=>c.qs.forEach(q=>{q.k="case";q.caseId=c.id}));
BANK.forEach(q=>q.k=q.k||"mcq");
ALLQ.push(...BANK,...LOGIC);
CASES.forEach(c=>ALLQ.push(...c.qs));
const QMAP={}; ALLQ.forEach(q=>QMAP[q.id]=q);
/* ============================ state ============================ */
const KEY="baseline.pmp.v1";
const BOX_DAYS=[0,0,1,3,7,16];          // Leitner intervals by box 1..5
const CAUSES={misread:"Misread it",unknown:"Didn't know it",company:"My company's way"};
const localOff=()=>new Date().getTimezoneOffset()*6e4;
const today=()=>new Date(Date.now()-localOff()).toISOString().slice(0,10);
const dayNum=()=>Math.floor((Date.now()-localOff())/864e5);
let S=load();
function blank(){return{v:1,examDate:"",theme:"dark",elim:false,pace:false,fs:"md",cards:{},misses:[],log:[],days:{},streak:0,last:""}}
function load(){try{const r=localStorage.getItem(KEY);return r?Object.assign(blank(),JSON.parse(r)):blank()}catch(e){return blank()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function card(id){return S.cards[id]||(S.cards[id]={box:1,due:0,seen:0,right:0,wrong:0})}
function touchDay(){
const t=today();
if(S.last!==t){
const y=new Date(Date.now()-localOff()-864e5).toISOString().slice(0,10);
S.streak=(S.last===y)?S.streak+1:1;
S.last=t;
}
S.days[t]=(S.days[t]||0)+1;
}
/* ============================ helpers ============================ */
const $=s=>document.querySelector(s);
const app=$("#app");
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const byId=id=>QMAP[id];
const modeLabel={pred:"Predictive",agile:"Agile",hybrid:"Hybrid"};
function qLabel(q){
if(q.k==="logic")return "Logic · "+LTYPE[q.lt].n;
return ECO[q.d].name+" · Task "+q.t;
}
function qRule(q){ return q.k==="logic"?LTYPE[q.lt].n:RULES[q.r].n; }
function daysToExam(){if(!S.examDate)return null;return Math.ceil((new Date(S.examDate+"T00:00")-new Date(today()+"T00:00"))/864e5)}
function accuracy(){const n=S.log.length;if(!n)return 0;return Math.round(S.log.filter(l=>l.ok).length/n*100)}
function confidentlyWrong(){return S.log.filter(l=>l.sure&&!l.ok).length}
function taskProgress(d,t){
const qs=ALLQ.filter(q=>q.d===d&&q.t===t);
if(!qs.length)return 0;
const strong=qs.filter(q=>(S.cards[q.id]||{}).box>=3).length;
return strong/qs.length;
}
function domainProgress(d){
const ts=Object.keys(ECO[d].tasks);
return ts.reduce((a,t)=>a+taskProgress(d,+t),0)/ts.length;
}
function solidTasks(){
let n=0;for(const d in ECO)for(const t in ECO[d].tasks)if(taskProgress(d,+t)>=.6)n++;
return n;
}
/* ============================ session ============================ */
let SESS=null;
function shuffleN(n){
const a=[...Array(n).keys()];
for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
return a;
}
const shuffle4=q=>shuffleN(q&&q.o?q.o.length:4);
function buildSession(n=10,mode="mix",arg=null){
if(mode==="task"){
const pool=ALLQ.filter(q=>q.d===arg.d&&+q.t===arg.t);
const qs=pool.sort(()=>Math.random()-.5).slice(0,Math.min(n,pool.length));
SESS={qs,perms:qs.map(q=>shuffleN(q.o.length)),i:0,sel:null,multi:[],killed:[],
phase:"answer",results:[],mode:"task",taskName:ECO[arg.d].tasks[arg.t]};
return;
}
if(mode==="logic"){
const now=dayNum();
const pool=LOGIC.map(q=>{
const c=S.cards[q.id];
const pri=!c?2:(c.due<=now?3-c.box*.1:.3-c.box*.05);
return{q,pri:pri+Math.random()*.35};
}).sort((a,b)=>b.pri-a.pri).slice(0,n).map(x=>x.q);
SESS={qs:pool,perms:pool.map(q=>shuffleN(q.o.length)),i:0,sel:null,multi:[],killed:[],phase:"answer",results:[],mode:"logic"};
return;
}
if(mode==="case"){
const scored=CASES.map(c=>{
const seen=c.qs.reduce((a,q)=>a+((S.cards[q.id]||{}).seen||0),0);
return{c,seen:seen+Math.random()};
}).sort((a,b)=>a.seen-b.seen);
const cs=scored[0].c;
SESS={qs:cs.qs.slice(),perms:cs.qs.map(q=>shuffleN(q.o.length)),i:0,sel:null,multi:[],killed:[],
phase:"answer",results:[],mode:"case",caseObj:cs,caseOpen:true};
return;
}
const now=dayNum();
const quota={P:3,R:4,B:3};
const pick=[];
for(const d of ["R","P","B"]){
const pool=BANK.filter(q=>q.d===d).map(q=>{
const c=S.cards[q.id];
let pri;
if(!c)pri=2;                             // unseen
else if(c.due<=now)pri=3-c.box*.1;       // due, weakest first
else pri=0.3-c.box*.05;                  // not due
return{q,pri:pri+Math.random()*.35};
}).sort((a,b)=>b.pri-a.pri);
pick.push(...pool.slice(0,quota[d]).map(x=>x.q));
}
const out=[],pool=[...pick];
while(pool.length){
let i=pool.findIndex(q=>!out.length||q.d!==out[out.length-1].d);
if(i<0)i=0;
out.push(pool.splice(i,1)[0]);
}
const qs=out.slice(0,n);
SESS={qs,perms:qs.map(q=>shuffleN(q.o.length)),i:0,sel:null,multi:[],killed:[],phase:"answer",results:[],mode:"mix"};
}

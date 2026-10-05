// Core v4.9: multiclass foundation (martial targets).
const V49_TARGETS=['fighter','barbarian','rogue','monk'];
const V49_REQ={
 barbarian:[['str',13]],bard:[['cha',13]],cleric:[['wis',13]],druid:[['wis',13]],
 fighter:[['str',13,'or','dex',13]],monk:[['dex',13],['wis',13]],paladin:[['str',13],['cha',13]],
 ranger:[['dex',13],['wis',13]],rogue:[['dex',13]],sorcerer:[['cha',13]],warlock:[['cha',13]],wizard:[['int',13]]
};
function v49ClassEntry(c,id){return c.progression?.classes?.find(x=>x.classId===id)||null;}
function v49MeetsOne(c,r){if(r[2]==='or')return effectiveAbilityScore(c,r[0])>=r[1]||effectiveAbilityScore(c,r[3])>=r[4];return effectiveAbilityScore(c,r[0])>=r[1];}
function v49ReqText(id){return (V49_REQ[id]||[]).map(r=>r[2]==='or'?`${r[0].toUpperCase()} ${r[1]} or ${r[3].toUpperCase()} ${r[4]}`:`${r[0].toUpperCase()} ${r[1]}`).join(', ')||'None';}
function v49Eligible(c,target){const current=primaryClassId(c),fails=[];for(const r of V49_REQ[current]||[])if(!v49MeetsOne(c,r))fails.push(`${CLASS_INFO[current].name}: ${v49ReqText(current)}`);for(const r of V49_REQ[target]||[])if(!v49MeetsOne(c,r))fails.push(`${CLASS_INFO[target].name}: ${v49ReqText(target)}`);if(v49ClassEntry(c,target))fails.push(`${CLASS_INFO[target].name} is already one of this character's classes.`);if(totalLevel(c)>=20)fails.push('Character level is already 20.');return{ok:!fails.length,errors:fails};}
function v49AddResource(c,id,name,max,recovery){if((c.resources||[]).some(r=>r.id===id))return; c.resources.push({id,name,current:max,maximum:max,recovery});}
function v49FighterStyles(){return ['archery','defense','dueling','greatWeaponFighting','protection','twoWeaponFighting'];}
function v49StyleName(x){return {archery:'Archery',defense:'Defense',dueling:'Dueling',greatWeaponFighting:'Great Weapon Fighting',protection:'Protection',twoWeaponFighting:'Two-Weapon Fighting'}[x]||x;}
function v49Proficiencies(target){return {
 fighter:['Light armor','Medium armor','Shields','Simple weapons','Martial weapons'],
 barbarian:['Shields','Simple weapons','Martial weapons'],
 rogue:['Light armor',"Thieves' tools"],
 monk:['Simple weapons','Shortswords']
 }[target]||[];}
function v49AddClass(c,target,{fightingStyle=null,expertise=[]}={}){
 const check=v49Eligible(c,target);if(!check.ok)return{ok:false,errors:check.errors};
 if(target==='fighter'&&!v49FighterStyles().includes(fightingStyle))return{ok:false,errors:['Choose a Fighter Fighting Style.']};
 if(target==='rogue'&&expertise.length!==2)return{ok:false,errors:['Choose exactly two Rogue Expertise skills.']};
 const info=CLASS_INFO[target],oldMax=maxHP(c),con=getAbilityModifier(c,'con'),gain=Math.max(1,info.fixedHP+con);
 c.progression.classes.push({classId:target,level:1,subclassId:null,choices:{fightingStyle:target==='fighter'?fightingStyle:null,expertise:target==='rogue'?[...expertise]:[]}});
 c.health.maxHPBase=oldMax+gain;c.health.currentHP=Math.min(c.health.maxHPBase,c.health.currentHP+gain);
 const hd=c.health.hitDice[info.hitDie]||={maximum:0,remaining:0};hd.maximum+=1;hd.remaining+=1;
 c.multiclass ||= {proficiencies:[],history:[]};for(const p of v49Proficiencies(target))if(!c.multiclass.proficiencies.includes(p))c.multiclass.proficiencies.push(p);
 c.multiclass.history.push({classId:target,atTotalLevel:totalLevel(c),date:new Date().toISOString()});
 if(target==='fighter')v49AddResource(c,'second-wind','Second Wind',1,['shortRest','longRest']);
 if(target==='barbarian')v49AddResource(c,'rage','Rage',2,['longRest']);
 return{ok:true,changes:[`Multiclass: ${info.name} 1`,`Max HP ${oldMax} → ${c.health.maxHPBase}`,`+1 ${info.hitDie} Hit Die`,...(target==='fighter'?[`Fighting Style: ${v49StyleName(fightingStyle)}`]:[]),...(target==='rogue'?[`Expertise: ${expertise.map(x=>SKILL_LABELS[x]||x).join(', ')}`]:[])]};
}
function v49SecondaryFeatures(c){
 const rows=[];for(const cls of c.progression?.classes||[]){if(cls.classId===primaryClassId(c))continue;const id=cls.classId;
 if(id==='fighter')rows.push(`<div class="skillrow"><span><strong>Fighter ${cls.level}</strong><br><small class="muted">Fighting Style: ${esc(v49StyleName(cls.choices?.fightingStyle||'—'))} · Second Wind</small></span><span class="pill">Multiclass</span></div>`);
 if(id==='barbarian')rows.push(`<div class="skillrow"><span><strong>Barbarian ${cls.level}</strong><br><small class="muted">Rage · Unarmored Defense. Rage restrictions remain table/context controlled.</small></span><span class="pill">Multiclass</span></div>`);
 if(id==='rogue')rows.push(`<div class="skillrow"><span><strong>Rogue ${cls.level}</strong><br><small class="muted">Sneak Attack 1d6 · Expertise: ${(cls.choices?.expertise||[]).map(x=>esc(SKILL_LABELS[x]||x)).join(', ')} · Thieves’ Cant</small></span><span class="pill">Multiclass</span></div>`);
 if(id==='monk')rows.push(`<div class="skillrow"><span><strong>Monk ${cls.level}</strong><br><small class="muted">Unarmored Defense · Martial Arts d4.</small></span><span class="pill">Multiclass</span></div>`);
 }return rows.join('');
}
const v48FeatureList_49=featureList;
featureList=function(c){return v48FeatureList_49(c)+v49SecondaryFeatures(c);};
function v49ClassSummary(c){return (c.progression?.classes||[]).map(x=>`${CLASS_INFO[x.classId]?.name||x.classId} ${x.level}`).join(' / ');}
const v48Sheet_49=sheetScreen;
sheetScreen=function(){let h=v48Sheet_49();if((state.active.progression?.classes||[]).length>1)h=h.replace(/Human · ([^<]+)/,`Human · ${esc(v49ClassSummary(state.active))}`);return h;};
const v48More_49=moreScreen;
moreScreen=function(){let h=v48More_49(),c=state.active;const eligible=V49_TARGETS.some(id=>v49Eligible(c,id).ok);const card=`<section class="card"><h3>Multiclass</h3><p class="muted">${esc(v49ClassSummary(c))} · Total level ${totalLevel(c)}</p>${c.multiclass?.proficiencies?.length?`<p class="tiny muted">Multiclass proficiencies: ${esc(c.multiclass.proficiencies.join(', '))}</p>`:''}<button class="wide ${eligible?'primary':''}" data-v49-multiclass ${eligible?'':'disabled'}>ADD CLASS (BETA)</button><p class="tiny muted">v4.9 supports Fighter, Barbarian, Rogue and Monk as new multiclass targets. Caster multiclass and combined slots arrive in v5.0.</p></section>`;return h.replace(/Core v4\.8/g,'Core v4.9')+card;};
const v48Modal_49=renderModal;
renderModal=function(){const m=state.modal,c=state.active;if(m?.type==='v49Multiclass'){const options=V49_TARGETS.filter(id=>!v49ClassEntry(c,id)).map(id=>{const q=v49Eligible(c,id);return `<option value="${id}" ${q.ok?'':'disabled'}>${CLASS_INFO[id].name} — ${v49ReqText(id)}${q.ok?'':' (requirements not met)'}</option>`}).join('');return `<div class="modalback"><div class="modal"><button class="compact ghost" data-modal-act="close">Close</button><h2>Add a class</h2><p class="muted">2014 multiclass prerequisites must be met for both your current class and the new class.</p><label>New class</label><select id="m-v49-class">${options}</select><div id="m-v49-options"></div><div id="m-v49-errors" class="error"></div><button class="primary wide" data-v49-confirm>ADD CLASS LEVEL</button></div></div>`;}return v48Modal_49();};
function v49Options(){const box=document.querySelector('#m-v49-options'),id=document.querySelector('#m-v49-class')?.value;if(!box||!id)return;if(id==='fighter')box.innerHTML=`<label>Fighting Style</label><select id="m-v49-style">${v49FighterStyles().map(x=>`<option value="${x}">${v49StyleName(x)}</option>`).join('')}</select>`;else if(id==='rogue'){const prof=Object.keys(SKILL_LABELS).filter(s=>state.active.proficiencies?.skills?.includes?.(s)||state.active.skills?.[s]?.proficient);box.innerHTML=`<label>Expertise 1</label><select id="m-v49-exp1">${prof.map(x=>`<option value="${x}">${esc(SKILL_LABELS[x])}</option>`).join('')}</select><label>Expertise 2</label><select id="m-v49-exp2">${prof.map(x=>`<option value="${x}">${esc(SKILL_LABELS[x])}</option>`).join('')}</select>`;}else box.innerHTML='';}
async function v49Confirm(){const c=state.active,id=document.querySelector('#m-v49-class')?.value,o={fightingStyle:document.querySelector('#m-v49-style')?.value||null,expertise:[document.querySelector('#m-v49-exp1')?.value,document.querySelector('#m-v49-exp2')?.value].filter(Boolean)};if(id==='rogue'&&new Set(o.expertise).size!==2){document.querySelector('#m-v49-errors').textContent='Choose two different Expertise skills.';return;}const probe=v49AddClass(deep(c),id,o);if(!probe.ok){document.querySelector('#m-v49-errors').innerHTML=probe.errors.map(x=>`<p>${esc(x)}</p>`).join('');return;}pushUndo(c,'Multiclass');const r=v49AddClass(c,id,o);addLog(c,'Multiclass',r.changes.join(' · '));await persist();state.modal=null;render();toast(`${CLASS_INFO[id].name} 1 added`);}
const v48Bind_49=bind;
bind=function(){v48Bind_49();const b=document.querySelector('[data-v49-multiclass]');if(b)b.onclick=()=>{state.modal={type:'v49Multiclass'};render();queueMicrotask(v49Options);};const sel=document.querySelector('#m-v49-class');if(sel)sel.onchange=v49Options;const ok=document.querySelector('[data-v49-confirm]');if(ok)ok.onclick=v49Confirm;};

// Core v4.7 clean patch: Paladin and Ranger progression through level 5.
const V47_HALF_CASTER_SLOTS={1:{},2:{1:2},3:{1:3},4:{1:3},5:{1:4,2:2}};
const V47_PALADIN_STYLES=['defense','dueling','greatWeaponFighting','protection'];
const V47_RANGER_STYLES=['archery','defense','dueling','twoWeaponFighting'];
const V47_HUNTERS_PREY={colossusSlayer:'Colossus Slayer',giantKiller:'Giant Killer',hordeBreaker:'Horde Breaker'};
SPELLS_KNOWN.ranger={2:2,3:3,4:3,5:4};
DEFAULT_SPELLS.paladin={cantrips:[],prepared:[]};
DEFAULT_SPELLS.ranger={cantrips:[],known:[]};

function v47AddClass(spellId,classId){const sp=SPELLS[spellId];if(sp&&!sp.classes.includes(classId))sp.classes.push(classId);}
['bless','command','cure-wounds','detect-magic','protection-evil-good','shield-of-faith','aid','lesser-restoration','sanctuary'].forEach(id=>v47AddClass(id,'paladin'));
['cure-wounds','detect-magic','fog-cloud','darkvision','lesser-restoration','silence'].forEach(id=>v47AddClass(id,'ranger'));
Object.assign(SPELLS,{
 'divine-favor':{id:'divine-favor',name:'Divine Favor',classes:['paladin'],level:1,school:'Evocation',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V, S',concentration:true,summary:'Weapon attacks deal extra radiant damage while concentrating; apply the extra damage when a hit qualifies.'},
 'searing-smite':{id:'searing-smite',name:'Searing Smite',classes:['paladin'],level:1,school:'Evocation',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,summary:'The next qualifying melee weapon hit deals extra fire damage and can ignite the target.'},
 'thunderous-smite':{id:'thunderous-smite',name:'Thunderous Smite',classes:['paladin'],level:1,school:'Evocation',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,summary:'The next qualifying melee weapon hit deals extra thunder damage and can push or knock the target prone.'},
 'wrathful-smite':{id:'wrathful-smite',name:'Wrathful Smite',classes:['paladin'],level:1,school:'Evocation',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'wis',summary:'The next qualifying melee weapon hit deals extra psychic damage and can frighten the target.'},
 'zone-of-truth':{id:'zone-of-truth',name:'Zone of Truth',classes:['bard','cleric','paladin'],level:2,school:'Enchantment',castingTime:'1 action',range:'60 ft',duration:'10 minutes',components:'V, S',save:'cha',summary:'Creatures in the area that fail a Charisma save cannot knowingly speak a deliberate lie.'},
 'magic-weapon':{id:'magic-weapon',name:'Magic Weapon',classes:['paladin','wizard'],level:2,school:'Transmutation',castingTime:'1 bonus action',range:'Touch',duration:'Concentration, up to 1 hour',components:'V, S',concentration:true,summary:'A nonmagical weapon becomes magical and gains a bonus to attack and damage rolls; weapon selection remains manual.'},
 'hunters-mark':{id:'hunters-mark',name:"Hunter's Mark",classes:['ranger'],level:1,school:'Divination',castingTime:'1 bonus action',range:'90 ft',duration:'Concentration, up to 1 hour',components:'V',concentration:true,summary:'Mark a creature; qualifying weapon hits deal extra damage and tracking improves. Target tracking remains manual.'},
 'ensnaring-strike':{id:'ensnaring-strike',name:'Ensnaring Strike',classes:['ranger'],level:1,school:'Conjuration',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'str',summary:'The next weapon hit can restrain the target with magical vines.'},
 'hail-of-thorns':{id:'hail-of-thorns',name:'Hail of Thorns',classes:['ranger'],level:1,school:'Conjuration',castingTime:'1 bonus action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'dex',damage:{dice:'1d10',type:'piercing',upcast:{dicePerLevel:'1d10'}},summary:'The next ranged weapon hit creates a burst of thorns.'},
 'goodberry':{id:'goodberry',name:'Goodberry',classes:['druid','ranger'],level:1,school:'Transmutation',castingTime:'1 action',range:'Touch',duration:'Instantaneous',components:'V, S, M',summary:'Creates ten magical berries; healing is applied manually.'},
 'longstrider':{id:'longstrider',name:'Longstrider',classes:['bard','druid','ranger','wizard'],level:1,school:'Transmutation',castingTime:'1 action',range:'Touch',duration:'1 hour',components:'V, S, M',summary:'Increases a creature speed by 10 feet.'},
 'pass-without-trace':{id:'pass-without-trace',name:'Pass without Trace',classes:['druid','ranger'],level:2,school:'Abjuration',castingTime:'1 action',range:'Self (30-ft radius)',duration:'Concentration, up to 1 hour',components:'V, S, M',concentration:true,summary:'Nearby allies gain a major Stealth bonus; party tracking remains manual.'},
 'spike-growth':{id:'spike-growth',name:'Spike Growth',classes:['druid','ranger'],level:2,school:'Transmutation',castingTime:'1 action',range:'150 ft',duration:'Concentration, up to 10 minutes',components:'V, S, M',concentration:true,damage:{dice:'2d4',type:'piercing'},summary:'Transforms ground into damaging hidden spikes.'}
});
const V47_DEVOTION_SPELLS={3:['protection-evil-good','sanctuary'],5:['lesser-restoration','zone-of-truth']};
function v47DevotionSpells(c){if(primaryClassId(c)!=='paladin'||primaryClass(c)?.subclassId!=='devotion')return[];const lvl=casterClassLevel(c,'paladin'),out=[];for(const [min,ids] of Object.entries(V47_DEVOTION_SPELLS))if(lvl>=Number(min))out.push(...ids);return out;}

const v46IsSpellcaster=isSpellcaster;
isSpellcaster=function(c){const id=primaryClassId(c),lvl=casterClassLevel(c,id);if(id==='paladin'||id==='ranger')return lvl>=2;return v46IsSpellcaster(c);};
const v46UsesPreparedSpells=usesPreparedSpells;
usesPreparedSpells=function(c){return primaryClassId(c)==='paladin'||v46UsesPreparedSpells(c);};
const v46UsesKnownSpells=usesKnownSpells;
usesKnownSpells=function(c){return primaryClassId(c)==='ranger'||v46UsesKnownSpells(c);};
const v46SpellcastingAbility=spellcastingAbility;
spellcastingAbility=function(c){const id=primaryClassId(c);if(id==='paladin')return'cha';if(id==='ranger')return'wis';return v46SpellcastingAbility(c);};
const v46PreparedLimit=preparedLimit;
preparedLimit=function(c){if(primaryClassId(c)==='paladin')return Math.max(1,Math.floor(casterClassLevel(c,'paladin')/2)+getAbilityModifier(c,'cha'));return v46PreparedLimit(c);};
const v46SlotMaximums=slotMaximums;
slotMaximums=function(c){const id=primaryClassId(c);if(id==='paladin'||id==='ranger')return{...(V47_HALF_CASTER_SLOTS[Math.min(5,Math.max(1,casterClassLevel(c,id)))]||{})};return v46SlotMaximums(c);};
const v46AvailablePreparationChoices=availablePreparationChoices;
availablePreparationChoices=function(c){if(primaryClassId(c)==='paladin'){const max=maxSpellLevel(c);return spellsForClass('paladin').filter(s=>s.level>0&&s.level<=max);}return v46AvailablePreparationChoices(c);};
const v46AlwaysPreparedSpells=alwaysPreparedSpells;
alwaysPreparedSpells=function(c){return[...new Set([...v46AlwaysPreparedSpells(c),...v47DevotionSpells(c)])];};
const v46CanCastSpell=canCastSpell;
canCastSpell=function(c,spellId,options={}){if(options.ritual&&['paladin','ranger'].includes(primaryClassId(c)))return{ok:false,reason:'This class does not gain Ritual Casting from its Spellcasting feature.'};return v46CanCastSpell(c,spellId,options);};

function v47AllowedStyle(id,style){return(id==='paladin'?V47_PALADIN_STYLES:V47_RANGER_STYLES).includes(style);}
function v47RangerSpellPool(target){const max=target>=5?2:1;return spellsForClass('ranger').filter(s=>s.level>0&&s.level<=max);}
function v47ResolveRangerSpells(c,target,{newSpells=[],replaceOldSpell=null,replaceNewSpell=null}={}){
 const existing=knownSpellIds(c),allowed=new Set(v47RangerSpellPool(target).map(s=>s.id)),errors=[];let base=[...existing];
 if(replaceOldSpell||replaceNewSpell){if(!replaceOldSpell||!replaceNewSpell)errors.push('Choose both spells for replacement.');else if(!base.includes(replaceOldSpell))errors.push('The spell to replace is not currently known.');else if(!allowed.has(replaceNewSpell))errors.push('The replacement is not available at this Ranger level.');else if(base.includes(replaceNewSpell)&&replaceNewSpell!==replaceOldSpell)errors.push('The replacement is already known.');else base=base.map(id=>id===replaceOldSpell?replaceNewSpell:id);}
 base=[...new Set(base)];const targetCount=SPELLS_KNOWN.ranger[target]||0,need=Math.max(0,targetCount-base.length),adds=[...new Set(newSpells.filter(Boolean))];
 if(adds.length!==need)errors.push(`Choose exactly ${need} new Ranger spell${need===1?'':'s'}.`);
 if(adds.some(id=>!allowed.has(id)||base.includes(id)))errors.push('One or more selected Ranger spells are invalid or already known.');
 const final=[...new Set([...base,...adds])];if(final.length!==targetCount)errors.push(`Ranger ${target} should know ${targetCount} spells.`);
 return{ok:!errors.length,errors,final,added:adds,replaced:replaceOldSpell&&replaceNewSpell&&replaceOldSpell!==replaceNewSpell?{from:replaceOldSpell,to:replaceNewSpell}:null};
}
function v47UpdatePaladinResources(c){
 const lvl=v46ClassLevel(c,'paladin');if(!lvl)return;
 const lay=c.resources.find(r=>r.id==='lay-on-hands'),next=lvl*5;if(lay){const old=Number(lay.maximum||0);lay.maximum=next;lay.current=Math.min(next,Number(lay.current||0)+Math.max(0,next-old));}else c.resources.push({id:'lay-on-hands',name:'Lay on Hands',current:next,maximum:next,recovery:['longRest']});
 const senseMax=Math.max(1,1+getAbilityModifier(c,'cha')),sense=c.resources.find(r=>r.id==='divine-sense');if(sense){const old=Number(sense.maximum||0);sense.maximum=senseMax;sense.current=Math.min(senseMax,Number(sense.current||0)+Math.max(0,senseMax-old));}else c.resources.push({id:'divine-sense',name:'Divine Sense',current:senseMax,maximum:senseMax,recovery:['longRest']});
 if(lvl>=3&&!c.resources.some(r=>r.id==='channel-divinity'))c.resources.push({id:'channel-divinity',name:'Channel Divinity',current:1,maximum:1,recovery:['shortRest','longRest']});
}
const v46MigrateCharacter=migrateCharacter;
migrateCharacter=function(c){const out=v46MigrateCharacter(c),id=primaryClassId(c),lvl=classLevel(c,id);if(id==='paladin'){v47UpdatePaladinResources(c);if(lvl>=2)ensureSpellcasting(c);}if(id==='ranger'&&lvl>=2)ensureSpellcasting(c);return out;};
const v46AttacksPerAction_47=attacksPerAction;
attacksPerAction=function(c){return Math.max(v46AttacksPerAction_47(c),(v46ClassLevel(c,'paladin')>=5||v46ClassLevel(c,'ranger')>=5)?2:1);};

function v47HalfCasterLevelUp(character,{hpMode='fixed',hpRoll=null,asi={},fightingStyle=null,huntersPrey=null,newSpells=[],replaceOldSpell=null,replaceNewSpell=null}={}){
 const c=character;migrateCharacter(c);const cid=primaryClassId(c),info=CLASS_INFO[cid],cls=c.progression.classes.find(x=>x.classId===cid),oldLevel=Number(cls?.level||1),target=oldLevel+1,errors=[];
 if(!['paladin','ranger'].includes(cid))return{ok:false,errors:['Unsupported v4.7 class.']};if(oldLevel>=5)return{ok:false,errors:['Core v4.7 supports this class through level 5.']};
 if(target===2&&!v47AllowedStyle(cid,fightingStyle))errors.push('Choose a valid Fighting Style.');if(target===4)errors.push(...validateASI(c,asi));if(cid==='ranger'&&target===3&&!V47_HUNTERS_PREY[huntersPrey])errors.push("Choose a Hunter's Prey option.");
 let rangerPlan=null;if(cid==='ranger'&&target>=2){const probe=deep(c),pcls=probe.progression.classes.find(x=>x.classId==='ranger');pcls.level=target;ensureSpellcasting(probe);rangerPlan=v47ResolveRangerSpells(probe,target,{newSpells,replaceOldSpell,replaceNewSpell});if(!rangerPlan.ok)errors.push(...rangerPlan.errors);}
 if(errors.length)return{ok:false,errors};
 const oldMax=maxHP(c),wasFull=c.health.currentHP>=oldMax,oldCon=getAbilityModifier(c,'con');let dieValue=info.fixedHP;if(hpMode==='roll')dieValue=Math.max(1,Math.min(Number(info.hitDie.slice(1)),Number(hpRoll)||1));
 cls.level=target;c.health.maxHPBase=oldMax+Math.max(1,dieValue+oldCon);c.health.hitDice[info.hitDie]||={maximum:oldLevel,remaining:oldLevel};const hd=c.health.hitDice[info.hitDie];hd.maximum=target;hd.remaining=Math.min(hd.maximum,Number(hd.remaining||0)+1);const changes=[`${info.name} ${oldLevel} -> ${target}`,`Max HP ${oldMax} -> ${c.health.maxHPBase}`];
 if(target===2){c.progression.fightingStyle=fightingStyle;changes.push(`Fighting Style: ${FIGHTING_STYLES[fightingStyle].name}`,'New Feature: Spellcasting');}
 if(cid==='paladin'){
  if(target===2)changes.push('New Feature: Divine Smite');
  if(target===3){cls.subclassId='devotion';changes.push('Sacred Oath: Oath of Devotion','New Features: Divine Health, Channel Divinity');}
  if(target===4)applyASI(c,asi,target,oldCon,changes);
  if(target===5)changes.push('New Feature: Extra Attack','2nd-level spell slots');
  ensureSpellcasting(c);v47UpdatePaladinResources(c);
 }else{
  if(target===3){cls.subclassId='hunter';c.progression.classChoices||={};c.progression.classChoices.huntersPrey=huntersPrey;changes.push('Ranger Archetype: Hunter',`Hunter's Prey: ${V47_HUNTERS_PREY[huntersPrey]}`,'New Feature: Primeval Awareness');}
  if(target===4)applyASI(c,asi,target,oldCon,changes);
  if(target===5)changes.push('New Feature: Extra Attack','2nd-level spell slots');
  const s=ensureSpellcasting(c);s.spellsKnown=[...rangerPlan.final];s.prepared=[...s.spellsKnown];if(rangerPlan.added.length)changes.push(`Learned: ${rangerPlan.added.map(id=>getSpell(id)?.name||id).join(', ')}`);if(rangerPlan.replaced)changes.push(`Replaced ${getSpell(rangerPlan.replaced.from)?.name||rangerPlan.replaced.from} -> ${getSpell(rangerPlan.replaced.to)?.name||rangerPlan.replaced.to}`);
 }
 if(wasFull)c.health.currentHP=c.health.maxHPBase;else c.health.currentHP=Math.min(c.health.currentHP,c.health.maxHPBase);return{ok:true,oldLevel,target,oldMax,newMax:c.health.maxHPBase,changes};
}
const v46LevelUpCharacter_47=levelUpCharacter;
levelUpCharacter=function(c,options={}){return['paladin','ranger'].includes(primaryClassId(c))?v47HalfCasterLevelUp(c,options):v46LevelUpCharacter_47(c,options);};

const v46FeatureList_47=featureList;
featureList=function(c){let html=v46FeatureList_47(c),ci=classInfo(c);if(ci.id==='paladin'){
 const lay=c.resources?.find(r=>r.id==='lay-on-hands');
 if(ci.level>=2)html+=`<div class="skillrow"><span><strong>Fighting Style</strong><br><small class="muted">${esc(FIGHTING_STYLES[c.progression?.fightingStyle]?.name||'-')}</small></span><span class="pill">Passive</span></div><div class="skillrow"><span><strong>Spellcasting</strong><br><small class="muted">CHA-based prepared half-caster.</small></span><span class="pill">Class</span></div><div class="skillrow"><span><strong>Divine Smite</strong><br><small class="muted">After a melee weapon hit, expend a spell slot and roll the extra radiant damage manually with Dice.</small></span><span class="pill">On Hit</span></div>`;
 if(ci.level>=3)html+=`<div class="skillrow"><span><strong>Oath of Devotion</strong><br><small class="muted">Channel Divinity and Divine Health. Oath spells are always prepared.</small></span><span class="pill">Subclass</span></div>`;
 if(ci.level>=5)html+=`<div class="skillrow"><span><strong>Extra Attack</strong><br><small class="muted">Attack twice with the Attack action; automated.</small></span><span class="pill">Passive</span></div>`;
 html+=`<div class="skillrow"><span><strong>Lay on Hands</strong><br><small class="muted">${lay?.current||0}/${lay?.maximum||ci.level*5} HP pool.</small></span><span class="pill">Resource</span></div>`;
 }else if(ci.id==='ranger'){
 if(ci.level>=2)html+=`<div class="skillrow"><span><strong>Fighting Style</strong><br><small class="muted">${esc(FIGHTING_STYLES[c.progression?.fightingStyle]?.name||'-')}</small></span><span class="pill">Passive</span></div><div class="skillrow"><span><strong>Spellcasting</strong><br><small class="muted">WIS-based known-spell half-caster.</small></span><span class="pill">Class</span></div>`;
 if(ci.level>=3){const hp=c.progression?.classChoices?.huntersPrey;html+=`<div class="skillrow"><span><strong>Hunter</strong><br><small class="muted">Hunter's Prey: ${esc(V47_HUNTERS_PREY[hp]||'-')}. Primeval Awareness is available.</small></span><span class="pill">Subclass</span></div>`;}
 if(ci.level>=5)html+=`<div class="skillrow"><span><strong>Extra Attack</strong><br><small class="muted">Attack twice with the Attack action; automated.</small></span><span class="pill">Passive</span></div>`;
 }return html;};

function v47CanLevel(ci){return ci.level<5&&['paladin','ranger'].includes(ci.id);}
const v46SheetScreen_47=sheetScreen;
sheetScreen=function(){let html=v46SheetScreen_47(),ci=classInfo(state.active);if(v47CanLevel(ci)&&!html.includes('data-act="level-up"'))html=html.replace('<button data-breakdown="ac" class="compact">AC</button>',`<button data-breakdown="ac" class="compact">AC</button><button class="compact primary" data-act="level-up">LEVEL UP</button>`);return html;};
const v46MoreScreen_47=moreScreen;
moreScreen=function(){let html=v46MoreScreen_47(),ci=classInfo(state.active);if(v47CanLevel(ci)&&!html.includes('data-act="level-up"'))html=html.replace('<button class="wide" style="margin-top:8px" data-act="dice">',`<button class="primary wide" data-act="level-up">LEVEL UP</button><button class="wide" style="margin-top:8px" data-act="dice">`);return html.replace(/Core v4\.6/g,'Core v4.7');};

function v47Select(id,label,items,valueKey='id',labelKey='name'){return `<label>${label}</label><select id="${id}">${items.map(x=>`<option value="${esc(x[valueKey])}">${esc(x[labelKey])}</option>`).join('')}</select>`;}
function v47SpellLevelUI(c,target){if(primaryClassId(c)!=='ranger')return'';const probe=deep(c),cls=probe.progression.classes.find(x=>x.classId==='ranger');cls.level=target;ensureSpellcasting(probe);const pool=v47RangerSpellPool(target),existing=knownSpellIds(c),need=Math.max(0,(SPELLS_KNOWN.ranger[target]||0)-existing.length);let html='';for(let i=0;i<need;i++)html+=v47Select(`m-new-spell-${i}`,`New Ranger spell ${i+1}`,pool);if(existing.length){html+=v47Select('m-replace-old','Optional: replace known spell',[{id:'',name:'No replacement'},...existing.map(id=>({id,name:getSpell(id)?.name||id}))]);html+=v47Select('m-replace-new','Replacement spell',[{id:'',name:'-'} ,...pool]);}return html;}
const v46RenderModal_47=renderModal;
renderModal=function(){const m=state.modal,c=state.active,ci=c?classInfo(c):null;if(m?.type==='levelUp'&&ci&&v47CanLevel(ci)){
 const target=ci.level+1,info=CLASS_INFO[ci.id],style=target===2?v47Select('m-style','Fighting Style',(ci.id==='paladin'?V47_PALADIN_STYLES:V47_RANGER_STYLES).map(id=>({id,name:FIGHTING_STYLES[id].name}))):'',hunter=ci.id==='ranger'&&target===3?v47Select('m-hunters-prey',"Hunter's Prey",Object.entries(V47_HUNTERS_PREY).map(([id,name])=>({id,name}))):'',asi=target===4?`<label>ASI first +1</label><select id="m-asi-1">${ABILITIES.map(a=>`<option value="${a}">${a.toUpperCase()} (${effectiveAbilityScore(c,a)})</option>`).join('')}</select><label>ASI second +1</label><select id="m-asi-2">${ABILITIES.map(a=>`<option value="${a}">${a.toUpperCase()} (${effectiveAbilityScore(c,a)})</option>`).join('')}</select>`:'',spells=v47SpellLevelUI(c,target);
 const body=`<h2>Level Up: ${esc(ci.name)} ${ci.level} -> ${target}</h2><label>HP increase</label><select id="m-hp-mode"><option value="fixed">Fixed: ${info.fixedHP} + CON modifier</option><option value="roll">Roll 1${info.hitDie} + CON modifier</option></select>${style}${hunter}${spells}${asi}<div id="level-errors" class="error">${(m.errors||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div><button class="primary wide" data-modal-act="apply-level-up">LEVEL UP</button>`;
 return `<div class="modalback" data-modal-act="backdrop"><div class="modal" role="dialog"><div class="between row"><span></span><button class="compact ghost" data-modal-act="close">Close</button></div>${body}</div></div>`;
 }return v46RenderModal_47();};
const v46ApplyLevelUpFromModal_47=applyLevelUpFromModal;
applyLevelUpFromModal=async function(){const c=state.active,ci=classInfo(c);if(!v47CanLevel(ci))return v46ApplyLevelUpFromModal_47();const target=ci.level+1,info=CLASS_INFO[ci.id],hpMode=document.querySelector('#m-hp-mode').value,hpRoll=hpMode==='roll'?rollDie(Number(info.hitDie.slice(1))):null,options={hpMode,hpRoll,asi:{},fightingStyle:document.querySelector('#m-style')?.value||null,huntersPrey:document.querySelector('#m-hunters-prey')?.value||null,newSpells:[],replaceOldSpell:document.querySelector('#m-replace-old')?.value||null,replaceNewSpell:document.querySelector('#m-replace-new')?.value||null};document.querySelectorAll('[id^="m-new-spell-"]').forEach(x=>options.newSpells.push(x.value));if(target===4){const a1=document.querySelector('#m-asi-1').value,a2=document.querySelector('#m-asi-2').value;options.asi[a1]=(options.asi[a1]||0)+1;options.asi[a2]=(options.asi[a2]||0)+1;}const preview=levelUpCharacter(deep(c),options);if(!preview.ok){state.modal.errors=preview.errors;render();return;}pushUndo(c,'Level Up');const result=levelUpCharacter(c,options);addLog(c,'Level Up',result.changes.join(' | '));await persist();state.modal={type:'levelSummary',changes:result.changes};render();};

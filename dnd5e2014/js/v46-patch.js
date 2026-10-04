// Core v4.6 patch: Barbarian, Rogue and Monk progression through level 5.
const V46_LEVEL_CLASSES=new Set(['barbarian','rogue','monk']);
function v46ClassLevel(c,id){return Number(c.progression?.classes?.find(x=>x.classId===id)?.level||0);}
function v46HasArmor(c){return (c.inventory?.items||[]).some(i=>i.equipped&&i.category==='armor'&&i.id!=='shield');}
function v46HasHeavyArmor(c){return (c.inventory?.items||[]).some(i=>i.equipped&&i.category==='armor'&&i.armorType==='heavy');}
function v46HasShield(c){return (c.inventory?.items||[]).some(i=>i.equipped&&i.id==='shield');}
const v45Speed=speed;
speed=function(c){let v=v45Speed(c);if(v46ClassLevel(c,'monk')>=2&&!v46HasArmor(c)&&!v46HasShield(c))v+=10;if(v46ClassLevel(c,'barbarian')>=5&&!v46HasHeavyArmor(c))v+=10;return v;};
const v45AttacksPerAction=attacksPerAction;
attacksPerAction=function(c){return Math.max(v45AttacksPerAction(c),(v46ClassLevel(c,'barbarian')>=5||v46ClassLevel(c,'monk')>=5)?2:1);};
const v45WeaponAttack=weaponAttack;
weaponAttack=function(c,item){const out=v45WeaponAttack(c,item);if(v46ClassLevel(c,'monk')>=5&&(item.monkWeapon||item.id==='unarmed')&&out.damageDice==='1d4')out.damageDice='1d6';return out;};
function v46LevelUp(character,{hpMode='fixed',hpRoll=null,asi={}}={}){
  const c=character;migrateCharacter(c);const cid=primaryClassId(c),info=CLASS_INFO[cid],cls=c.progression.classes.find(x=>x.classId===cid),oldLevel=Number(cls?.level||1),target=oldLevel+1,errors=[];
  if(!V46_LEVEL_CLASSES.has(cid))return{ok:false,errors:['Unsupported v4.6 class.']};
  if(oldLevel>=5)return{ok:false,errors:['Core v4.6 supports this class through level 5.']};
  if(target===4)errors.push(...validateASI(c,asi));if(errors.length)return{ok:false,errors};
  const oldMax=maxHP(c),wasFull=c.health.currentHP>=oldMax,oldCon=getAbilityModifier(c,'con');let dieValue=info.fixedHP;if(hpMode==='roll')dieValue=Math.max(1,Math.min(Number(info.hitDie.slice(1)),Number(hpRoll)||1));
  cls.level=target;c.health.maxHPBase=oldMax+Math.max(1,dieValue+oldCon);c.health.hitDice[info.hitDie] ||= {maximum:oldLevel,remaining:oldLevel};const hd=c.health.hitDice[info.hitDie];hd.maximum=target;hd.remaining=Math.min(hd.maximum,Number(hd.remaining||0)+1);const changes=[`${info.name} ${oldLevel} → ${target}`,`Max HP ${oldMax} → ${c.health.maxHPBase}`];
  if(cid==='barbarian'){
    const rage=c.resources.find(r=>r.id==='rage');if(rage&&target>=3){const before=rage.maximum;rage.maximum=3;rage.current=Math.min(rage.maximum,rage.current+Math.max(0,rage.maximum-before));}
    if(target===2)changes.push('New Features: Reckless Attack, Danger Sense');
    if(target===3){cls.subclassId='berserker';changes.push('Primal Path: Path of the Berserker','Rage uses: 3/Long Rest','New Feature: Frenzy');}
    if(target===5)changes.push('New Features: Extra Attack, Fast Movement (+10 ft without heavy armor)');
  }
  if(cid==='rogue'){
    if(target===2)changes.push('New Feature: Cunning Action');
    if(target===3){cls.subclassId='thief';changes.push('Roguish Archetype: Thief','Sneak Attack increases to 2d6','New Features: Fast Hands, Second-Story Work');}
    if(target===5)changes.push('Sneak Attack increases to 3d6','New Feature: Uncanny Dodge');
  }
  if(cid==='monk'){
    let ki=c.resources.find(r=>r.id==='ki');if(target>=2){if(!ki){ki={id:'ki',name:'Ki',current:target,maximum:target,recovery:['shortRest','longRest']};c.resources.push(ki);}else{const before=ki.maximum;ki.maximum=target;ki.current=Math.min(ki.maximum,ki.current+Math.max(0,target-before));}}
    if(target===2)changes.push('New Features: Ki, Flurry of Blows, Patient Defense, Step of the Wind, Unarmored Movement +10 ft');
    if(target===3){cls.subclassId='open-hand';changes.push('Monastic Tradition: Way of the Open Hand','New Features: Deflect Missiles, Open Hand Technique');}
    if(target===4)changes.push('New Feature: Slow Fall');
    if(target===5)changes.push('Martial Arts die increases to d6','New Features: Extra Attack, Stunning Strike');
  }
  if(target===4)applyASI(c,asi,target,oldCon,changes);
  if(wasFull)c.health.currentHP=c.health.maxHPBase;else c.health.currentHP=Math.min(c.health.currentHP,c.health.maxHPBase);return{ok:true,oldLevel,target,oldMax,newMax:c.health.maxHPBase,changes};
}
const v45LevelUpCharacter=levelUpCharacter;
levelUpCharacter=function(c,options={}){return V46_LEVEL_CLASSES.has(primaryClassId(c))?v46LevelUp(c,options):v45LevelUpCharacter(c,options);};
function v46SneakDice(level){return level>=5?'3d6':level>=3?'2d6':'1d6';}
const v45FeatureList=featureList;
featureList=function(c){let html=v45FeatureList(c),ci=classInfo(c);if(ci.id==='barbarian'){
  const rage=c.resources?.find(r=>r.id==='rage');html=html.replace('2 uses per Long Rest',`${rage?.maximum||2} uses per Long Rest`);
  if(ci.level>=2)html+=`<div class="skillrow"><span><strong>Reckless Attack</strong><br><small class="muted">On your first STR melee attack of the turn, you may gain advantage; attacks against you then have advantage until your next turn.</small></span><span class="pill">Choice</span></div><div class="skillrow"><span><strong>Danger Sense</strong><br><small class="muted">Advantage on visible DEX saves while not blinded, deafened or incapacitated; contextual toggle remains manual.</small></span><span class="pill">Passive</span></div>`;
  if(ci.level>=3)html+=`<div class="skillrow"><span><strong>Path of the Berserker</strong><br><small class="muted">Frenzy can grant a bonus-action melee attack while raging; exhaustion consequences remain table-managed.</small></span><span class="pill">Subclass</span></div>`;
  if(ci.level>=5)html+=`<div class="skillrow"><span><strong>Extra Attack</strong><br><small class="muted">Attack twice with the Attack action.</small></span><span class="pill">Passive</span></div><div class="skillrow"><span><strong>Fast Movement</strong><br><small class="muted">+10 ft speed while not wearing heavy armor; automated.</small></span><span class="pill">Passive</span></div>`;
 }else if(ci.id==='rogue'){
  html=html.replace('Sneak Attack 1d6',`Sneak Attack ${v46SneakDice(ci.level)}`);
  if(ci.level>=2)html+=`<div class="skillrow"><span><strong>Cunning Action</strong><br><small class="muted">Dash, Disengage or Hide as a bonus action.</small></span><span class="pill">Bonus Action</span></div>`;
  if(ci.level>=3)html+=`<div class="skillrow"><span><strong>Thief</strong><br><small class="muted">Fast Hands and Second-Story Work.</small></span><span class="pill">Subclass</span></div>`;
  if(ci.level>=5)html+=`<div class="skillrow"><span><strong>Uncanny Dodge</strong><br><small class="muted">Reaction to halve damage from an attacker you can see; apply the resulting damage manually.</small></span><span class="pill">Reaction</span></div>`;
 }else if(ci.id==='monk'){
  if(ci.level>=5)html=html.replace('d4 Martial Arts die','d6 Martial Arts die');
  if(ci.level>=2)html+=`<div class="skillrow"><span><strong>Ki</strong><br><small class="muted">${ci.level} points · restores on Short/Long Rest. Spend via the resource tracker for Flurry of Blows, Patient Defense or Step of the Wind.</small></span><span class="pill">Resource</span></div><div class="skillrow"><span><strong>Unarmored Movement</strong><br><small class="muted">+10 ft while unarmored and without a shield; automated.</small></span><span class="pill">Passive</span></div>`;
  if(ci.level>=3)html+=`<div class="skillrow"><span><strong>Way of the Open Hand</strong><br><small class="muted">Open Hand Technique plus Deflect Missiles; target-dependent effects remain contextual.</small></span><span class="pill">Subclass</span></div>`;
  if(ci.level>=4)html+=`<div class="skillrow"><span><strong>Slow Fall</strong><br><small class="muted">Reaction reduces falling damage by five times Monk level.</small></span><span class="pill">Reaction</span></div>`;
  if(ci.level>=5)html+=`<div class="skillrow"><span><strong>Extra Attack</strong><br><small class="muted">Attack twice with the Attack action; automated.</small></span><span class="pill">Passive</span></div><div class="skillrow"><span><strong>Stunning Strike</strong><br><small class="muted">Spend 1 Ki after a melee weapon hit; target makes a CON save. Target state remains manual.</small></span><span class="pill">Ki</span></div>`;
 }return html;};
function v46CanLevel(ci){return ci.level<5&&(['fighter','wizard','cleric','barbarian','rogue','monk'].includes(ci.id));}
const v45SheetScreen=sheetScreen;
sheetScreen=function(){let html=v45SheetScreen(),ci=classInfo(state.active);if(v46CanLevel(ci)&&!html.includes('data-act="level-up"'))html=html.replace('<button data-breakdown="ac" class="compact">AC</button>',`<button data-breakdown="ac" class="compact">AC</button><button class="compact primary" data-act="level-up">LEVEL UP</button>`);return html;};
const v45MoreScreen=moreScreen;
moreScreen=function(){let html=v45MoreScreen(),ci=classInfo(state.active);if(v46CanLevel(ci)&&!html.includes('data-act="level-up"'))html=html.replace('<button class="wide" style="margin-top:8px" data-act="dice">',`<button class="primary wide" data-act="level-up">LEVEL UP</button><button class="wide" style="margin-top:8px" data-act="dice">`);return html.replace(/Core v4\.4/g,'Core v4.6').replace('most new classes do not level beyond 1 yet.','Barbarian, Rogue and Monk now progress through level 5; Paladin, Ranger, Bard, Druid, Sorcerer and Warlock remain level-1 slices.');};
function v46LevelNotes(id){return id==='barbarian'?{2:'Reckless Attack + Danger Sense',3:'Path of the Berserker + Frenzy + 3 Rages',4:'Ability Score Improvement',5:'Extra Attack + Fast Movement'}:id==='rogue'?{2:'Cunning Action',3:'Thief + Sneak Attack 2d6',4:'Ability Score Improvement',5:'Uncanny Dodge + Sneak Attack 3d6'}:{2:'Ki + Unarmored Movement',3:'Way of the Open Hand + Deflect Missiles',4:'Ability Score Improvement + Slow Fall',5:'Extra Attack + Stunning Strike + Martial Arts d6'};}
const v45RenderModal=renderModal;
renderModal=function(){const m=state.modal,c=state.active,ci=c?classInfo(c):null;if(m?.type==='levelUp'&&ci&&V46_LEVEL_CLASSES.has(ci.id)){
  const target=ci.level+1,info=CLASS_INFO[ci.id],notes=v46LevelNotes(ci.id);let subclass='';if(target===3){const label=ci.id==='barbarian'?'Path of the Berserker':ci.id==='rogue'?'Thief':'Way of the Open Hand';subclass=`<div class="skillrow"><span>Subclass</span><strong>${label}</strong></div>`;}const asi=target===4?`<label>Ability Score Improvement — first +1</label><select id="m-asi-1">${ABILITIES.map(a=>`<option value="${a}">${a.toUpperCase()} (${effectiveAbilityScore(c,a)})</option>`).join('')}</select><label>Ability Score Improvement — second +1</label><select id="m-asi-2">${ABILITIES.map(a=>`<option value="${a}">${a.toUpperCase()} (${effectiveAbilityScore(c,a)})</option>`).join('')}</select><p class="muted tiny">Same ability twice = +2; scores cannot exceed 20.</p>`:'';const body=`<h2>Level Up: ${esc(ci.name)} ${ci.level} → ${target}</h2><p class="notice muted">New at this level: ${esc(notes[target]||'—')}</p><label>HP increase</label><select id="m-hp-mode"><option value="fixed">Fixed: ${info.fixedHP} + CON modifier</option><option value="roll">Roll 1${info.hitDie} + CON modifier</option></select>${subclass}${asi}<div id="level-errors" class="error">${(m.errors||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div><button class="primary wide" data-modal-act="apply-level-up">LEVEL UP</button>`;return `<div class="modalback" data-modal-act="backdrop"><div class="modal" role="dialog"><div class="between row"><span></span><button class="compact ghost" data-modal-act="close">Close</button></div>${body}</div></div>`;}return v45RenderModal();};
const v45ApplyLevelUpFromModal=applyLevelUpFromModal;
applyLevelUpFromModal=async function(){const c=state.active,ci=classInfo(c);if(!V46_LEVEL_CLASSES.has(ci.id))return v45ApplyLevelUpFromModal();const target=ci.level+1,info=CLASS_INFO[ci.id],hpMode=document.querySelector('#m-hp-mode').value,hpRoll=hpMode==='roll'?rollDie(Number(info.hitDie.slice(1))):null,options={hpMode,hpRoll,asi:{}};if(target===4){const a1=document.querySelector('#m-asi-1').value,a2=document.querySelector('#m-asi-2').value;options.asi[a1]=(options.asi[a1]||0)+1;options.asi[a2]=(options.asi[a2]||0)+1;}const preview=levelUpCharacter(deep(c),options);if(!preview.ok){state.modal.errors=preview.errors;render();return;}pushUndo(c,'Level Up');const result=levelUpCharacter(c,options);addLog(c,'Level Up',result.changes.join(' · '));await persist();state.modal={type:'levelSummary',changes:result.changes};render();};
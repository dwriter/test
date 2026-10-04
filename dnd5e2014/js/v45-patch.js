// Core v4.5 patch: starting equipment packages + live creator review/validation.
const V45_GEAR={
  dungeoneerPack:{id:'dungeoneer-pack',name:"Dungeoneer’s Pack",category:'gear',weight:61.5,quantity:1,equipped:false},
  explorerPack:{id:'explorer-pack',name:"Explorer’s Pack",category:'gear',weight:59,quantity:1,equipped:false},
  scholarPack:{id:'scholar-pack',name:"Scholar’s Pack",category:'gear',weight:10,quantity:1,equipped:false},
  priestPack:{id:'priest-pack',name:"Priest’s Pack",category:'gear',weight:24,quantity:1,equipped:false},
  diplomatPack:{id:'diplomat-pack',name:"Diplomat’s Pack",category:'gear',weight:36,quantity:1,equipped:false},
  entertainerPack:{id:'entertainer-pack',name:"Entertainer’s Pack",category:'gear',weight:38,quantity:1,equipped:false},
  burglarPack:{id:'burglar-pack',name:"Burglar’s Pack",category:'gear',weight:44.5,quantity:1,equipped:false},
  componentPouch:{id:'component-pouch',name:'Component Pouch',category:'gear',weight:2,quantity:1,equipped:false},
  arcaneFocus:{id:'arcane-focus',name:'Arcane Focus',category:'gear',weight:1,quantity:1,equipped:false},
  druidicFocus:{id:'druidic-focus',name:'Druidic Focus',category:'gear',weight:1,quantity:1,equipped:false},
  holySymbol:{id:'holy-symbol',name:'Holy Symbol',category:'gear',weight:1,quantity:1,equipped:false},
  spellbook:{id:'spellbook',name:'Spellbook',category:'gear',weight:3,quantity:1,equipped:false},
  thievesTools:{id:'thieves-tools',name:"Thieves’ Tools",category:'gear',weight:1,quantity:1,equipped:false},
  arrows20:{id:'arrows',name:'Arrows',category:'gear',weight:1,quantity:20,equipped:false},
  bolts20:{id:'crossbow-bolts',name:'Crossbow Bolts',category:'gear',weight:1.5,quantity:20,equipped:false},
  javelin5:{id:'javelin',name:'Javelin',category:'gear',weight:10,quantity:5,equipped:false},
  dart10:{id:'dart',name:'Dart',category:'gear',weight:2.5,quantity:10,equipped:false}
};
const V45_WEAPONS={
  warhammer:{id:'warhammer',name:'Warhammer',category:'weapon',damageDice:'1d8',damageType:'bludgeoning',weight:2,properties:['versatile 1d10'],equipped:true},
  spear:{id:'spear',name:'Spear',category:'weapon',damageDice:'1d6',damageType:'piercing',weight:3,properties:['thrown 20/60','versatile 1d8'],equipped:true,monkWeapon:true}
};
const V45_KITS={
  fighter:[
    {id:'sword-board',name:'Sword & shield',summary:'Chain mail, longsword, shield, light crossbow + 20 bolts, dungeoneer’s pack.',items:['armor:chainMail','weapon:longsword','armor:shield','weapon:lightCrossbow','gear:bolts20','gear:dungeoneerPack']},
    {id:'archer',name:'Archer',summary:'Leather armor, longbow + 20 arrows, shortsword, explorer’s pack.',items:['armor:leather','weapon:longbow','gear:arrows20','weapon:shortsword','gear:explorerPack']},
    {id:'great-weapon',name:'Great weapon',summary:'Chain mail, greatsword, two handaxes, explorer’s pack.',items:['armor:chainMail','weapon:greatsword','weapon:handaxe','weapon:handaxe','gear:explorerPack']}
  ],
  wizard:[
    {id:'staff-focus',name:'Staff & focus',summary:'Quarterstaff, arcane focus, scholar’s pack, spellbook.',items:['weapon:quarterstaff','gear:arcaneFocus','gear:scholarPack','gear:spellbook']},
    {id:'dagger-components',name:'Dagger & components',summary:'Dagger, component pouch, explorer’s pack, spellbook.',items:['weapon:dagger','gear:componentPouch','gear:explorerPack','gear:spellbook']}
  ],
  cleric:[
    {id:'mace-scale',name:'Mace & scale mail',summary:'Scale mail, shield, mace, light crossbow + 20 bolts, priest’s pack, holy symbol.',items:['armor:scaleMail','armor:shield','weapon:mace','weapon:lightCrossbow','gear:bolts20','gear:priestPack','gear:holySymbol']},
    {id:'warhammer-chain',name:'Warhammer & chain mail',summary:'Chain mail, shield, warhammer, explorer’s pack, holy symbol.',items:['armor:chainMail','armor:shield','weapon:warhammer','gear:explorerPack','gear:holySymbol']}
  ],
  barbarian:[
    {id:'greataxe',name:'Greataxe',summary:'Greataxe, two handaxes, javelins, explorer’s pack.',items:['weapon:greataxe','weapon:handaxe','weapon:handaxe','gear:javelin5','gear:explorerPack']},
    {id:'longsword',name:'Longsword',summary:'Longsword, two handaxes, javelins, explorer’s pack.',items:['weapon:longsword','weapon:handaxe','weapon:handaxe','gear:javelin5','gear:explorerPack']}
  ],
  rogue:[
    {id:'rapier-bow',name:'Rapier & shortbow',summary:'Leather armor, rapier, shortbow + 20 arrows, burglar’s pack, thieves’ tools.',items:['armor:leather','weapon:rapier','weapon:shortbow','gear:arrows20','gear:burglarPack','gear:thievesTools']},
    {id:'shortswords',name:'Two shortswords',summary:'Leather armor, two shortswords, burglar’s pack, thieves’ tools.',items:['armor:leather','weapon:shortsword','weapon:shortsword','gear:burglarPack','gear:thievesTools']}
  ],
  monk:[
    {id:'staff',name:'Quarterstaff',summary:'Quarterstaff, 10 darts, explorer’s pack.',items:['weapon:quarterstaff','gear:dart10','gear:explorerPack']},
    {id:'spear',name:'Spear',summary:'Spear, 10 darts, explorer’s pack.',items:['weapon:spear','gear:dart10','gear:explorerPack']}
  ],
  paladin:[
    {id:'sword-board',name:'Sword & shield',summary:'Chain mail, longsword, shield, javelins, priest’s pack, holy symbol.',items:['armor:chainMail','weapon:longsword','armor:shield','gear:javelin5','gear:priestPack','gear:holySymbol']},
    {id:'great-weapon',name:'Great weapon',summary:'Chain mail, greatsword, javelins, explorer’s pack, holy symbol.',items:['armor:chainMail','weapon:greatsword','gear:javelin5','gear:explorerPack','gear:holySymbol']}
  ],
  ranger:[
    {id:'archer',name:'Archer',summary:'Scale mail, two shortswords, shortbow + 20 arrows, explorer’s pack.',items:['armor:scaleMail','weapon:shortsword','weapon:shortsword','weapon:shortbow','gear:arrows20','gear:explorerPack']},
    {id:'light-archer',name:'Light-armored archer',summary:'Leather armor, shortsword, shortbow + 20 arrows, explorer’s pack.',items:['armor:leather','weapon:shortsword','weapon:shortbow','gear:arrows20','gear:explorerPack']}
  ],
  bard:[
    {id:'rapier-diplomat',name:'Rapier & diplomat',summary:'Leather armor, rapier, dagger, diplomat’s pack.',items:['armor:leather','weapon:rapier','weapon:dagger','gear:diplomatPack']},
    {id:'rapier-entertainer',name:'Rapier & entertainer',summary:'Leather armor, rapier, dagger, entertainer’s pack.',items:['armor:leather','weapon:rapier','weapon:dagger','gear:entertainerPack']}
  ],
  druid:[
    {id:'scimitar-shield',name:'Scimitar & shield',summary:'Leather armor, shield, scimitar, explorer’s pack, druidic focus.',items:['armor:leather','armor:shield','weapon:scimitar','gear:explorerPack','gear:druidicFocus']},
    {id:'staff-shield',name:'Quarterstaff & shield',summary:'Leather armor, shield, quarterstaff, explorer’s pack, druidic focus.',items:['armor:leather','armor:shield','weapon:quarterstaff','gear:explorerPack','gear:druidicFocus']}
  ],
  sorcerer:[
    {id:'crossbow-focus',name:'Crossbow & focus',summary:'Light crossbow + 20 bolts, two daggers, arcane focus, dungeoneer’s pack.',items:['weapon:lightCrossbow','gear:bolts20','weapon:dagger','weapon:dagger','gear:arcaneFocus','gear:dungeoneerPack']},
    {id:'crossbow-components',name:'Crossbow & components',summary:'Light crossbow + 20 bolts, two daggers, component pouch, explorer’s pack.',items:['weapon:lightCrossbow','gear:bolts20','weapon:dagger','weapon:dagger','gear:componentPouch','gear:explorerPack']}
  ],
  warlock:[
    {id:'crossbow-focus',name:'Crossbow & focus',summary:'Leather armor, light crossbow + 20 bolts, dagger, arcane focus, scholar’s pack.',items:['armor:leather','weapon:lightCrossbow','gear:bolts20','weapon:dagger','gear:arcaneFocus','gear:scholarPack']},
    {id:'melee-components',name:'Melee & components',summary:'Leather armor, rapier, dagger, component pouch, dungeoneer’s pack.',items:['armor:leather','weapon:rapier','weapon:dagger','gear:componentPouch','gear:dungeoneerPack']}
  ]
};
function v45Kits(classId){return V45_KITS[classId]||[];}
function v45Kit(classId,id){const a=v45Kits(classId);return a.find(x=>x.id===id)||a[0]||null;}
function v45Clone(token){const [type,key]=String(token).split(':');const src=type==='weapon'?(STARTER_WEAPONS[key]||V45_WEAPONS[key]):type==='armor'?ARMOR[key]:V45_GEAR[key];if(!src)return null;const x=structuredClone(src);x.instanceId=uid();return x;}
function v45Inventory(classId,kitId){const kit=v45Kit(classId,kitId);return kit?kit.items.map(v45Clone).filter(Boolean):[];}

const v44MakeCharacter=makeCharacter;
makeCharacter=function(classId,options={}){const c=v44MakeCharacter(classId,options),kit=v45Kit(classId,options.equipmentKit);if(kit){c.inventory.items=v45Inventory(classId,kit.id);c.progression.equipmentKitId=kit.id;}return c;};

const v44ValidateCreatorDraft=validateCreatorDraft;
validateCreatorDraft=function(draft){const errors=v44ValidateCreatorDraft(draft);const kits=v45Kits(draft.classId||'fighter');if(kits.length&&!kits.some(k=>k.id===draft.equipmentKit))errors.push('Choose a valid starting equipment package.');return errors;};

function v45EquipmentMarkup(classId){const kits=v45Kits(classId),kit=kits[0];if(!kit)return '';return `<label>Starting equipment</label><select id="c-equipment-kit">${kits.map((k,i)=>`<option value="${k.id}" ${i===0?'selected':''}>${esc(k.name)}</option>`).join('')}</select><p id="equipment-help" class="muted tiny">${esc(kit.summary)}</p>`;}
const v44CreatorDynamic=creatorDynamic;
creatorDynamic=function(classId){return v44CreatorDynamic(classId)+v45EquipmentMarkup(classId);};

function v45CollectDraft(){const abilityScores={};document.querySelectorAll('.ability-input').forEach(i=>abilityScores[i.dataset.ability]=Number(i.value));const skillChoices=[...document.querySelectorAll('input[name="skill"]:checked')].map(i=>i.value),classId=document.querySelector('#c-class')?.value||'fighter',raceId=document.querySelector('#c-race')?.value||'human-standard',backgroundId=document.querySelector('#c-background')?.value||'custom',raceChoices={},backgroundChoices={};if(raceId==='dragonborn')raceChoices.ancestry=document.querySelector('#c-ancestry')?.value||'red';if(raceId==='half-elf'){raceChoices.abilityBonuses=[document.querySelector('#c-half-ability-1')?.value,document.querySelector('#c-half-ability-2')?.value];raceChoices.skills=[document.querySelector('#c-half-skill-1')?.value,document.querySelector('#c-half-skill-2')?.value];}if(backgroundId==='custom')backgroundChoices.customSkills=[document.querySelector('#c-bg-custom-1')?.value,document.querySelector('#c-bg-custom-2')?.value];else backgroundChoices.replacements=[document.querySelector('#c-bg-repl-1')?.value,document.querySelector('#c-bg-repl-2')?.value];const expertiseChoices=[...document.querySelectorAll('input[name="expertise"]:checked')].map(i=>i.value),classChoices={};if(classId==='ranger'){classChoices.favoredEnemy=document.querySelector('#c-favored-enemy')?.value;classChoices.favoredTerrain=document.querySelector('#c-favored-terrain')?.value;}if(classId==='sorcerer')classChoices.dragonAncestor=document.querySelector('#c-sorc-ancestor')?.value||'red';return{classId,raceId,backgroundId,raceChoices,backgroundChoices,expertiseChoices,classChoices,name:document.querySelector('#c-name')?.value||'',playerName:document.querySelector('#c-player')?.value||'',abilityScores,skillChoices,fightingStyle:document.querySelector('#c-style')?.value||'defense',armorChoice:document.querySelector('#c-armor')?.value||'chain',weaponChoice:document.querySelector('#c-weapon')?.value||'longsword',shield:document.querySelector('#c-shield')?.checked??true,equipmentKit:document.querySelector('#c-equipment-kit')?.value||v45Kits(classId)[0]?.id||null};}
function v45Validation(d){const errors=validateCreatorDraft(d),method=document.querySelector('#c-method')?.value||'standard';if(method==='pointBuy'){const pb=validatePointBuy(d.abilityScores);if(!pb.valid)errors.push(`Point Buy must spend exactly 27 points with scores from 8 to 15 (currently ${pb.cost}/27).`);}return errors;}
function v45Ability(d,a){let v=Number(d.abilityScores?.[a]||0)+Number(getRace(d.raceId).abilityBonuses?.[a]||0);if(d.raceId==='half-elf'&&(d.raceChoices?.abilityBonuses||[]).includes(a))v++;return v;}
function v45RefreshReview(){const box=document.querySelector('#creator-review');if(!box)return;const d=v45CollectDraft(),errors=v45Validation(d),kit=v45Kit(d.classId,d.equipmentKit),race=getRace(d.raceId),bg=getBackground(d.backgroundId),info=CLASS_INFO[d.classId];box.innerHTML=`<div class="between row"><strong>Review & validation</strong><span class="pill ${errors.length?'bad':'good'}">${errors.length?`${errors.length} issue${errors.length===1?'':'s'}`:'Ready'}</span></div><div class="review-grid"><div><small class="muted">Character</small><br>${esc(d.name||'Unnamed')} · ${esc(race.name)} · ${esc(info.name)} 1</div><div><small class="muted">Background</small><br>${esc(bg.name)}</div><div><small class="muted">Abilities</small><br>${ABILITIES.map(a=>`${a.toUpperCase()} ${v45Ability(d,a)}`).join(' · ')}</div><div><small class="muted">Class skills</small><br>${d.skillChoices.length?d.skillChoices.map(x=>esc(SKILL_LABELS[x])).join(', '):'None selected'}</div><div><small class="muted">Equipment</small><br>${esc(kit?.name||'—')}<br><span class="tiny muted">${esc(kit?.summary||'')}</span></div></div>${errors.length?`<div class="error review-errors">${errors.map(x=>`<div>• ${esc(x)}</div>`).join('')}</div>`:'<div class="good-text tiny" style="margin-top:10px">All required creator choices are valid.</div>'}`;const btn=document.querySelector('[data-act="finish-create"]');if(btn)btn.disabled=errors.length>0;}

const v44CreatorScreen=creatorScreen;
creatorScreen=function(){let html=v44CreatorScreen();html=html.replace('Core v4.4 supports all twelve 2014 classes at character creation; Fighter/Wizard/Cleric progress to level 5 while the other classes currently have a level-1 vertical slice.','Core v4.5 adds class-specific starting equipment packages plus live Review & Validation. All twelve 2014 classes are available at creation; Fighter/Wizard/Cleric progress to level 5 while the other classes currently have a level-1 vertical slice.');return html.replace('<div id="creator-errors" class="error"></div>','<section class="card" id="creator-review"></section><div id="creator-errors" class="error"></div>');};

const v44Bind=bind;
bind=function(){v44Bind();if(state.screen!=='create')return;const equipment=document.querySelector('#c-equipment-kit');if(equipment)equipment.addEventListener('change',()=>{const kit=v45Kit(document.querySelector('#c-class')?.value||'fighter',equipment.value),help=document.querySelector('#equipment-help');if(help)help.textContent=kit?.summary||'';v45RefreshReview();});document.querySelectorAll('#app input,#app select').forEach(el=>{el.addEventListener('change',()=>queueMicrotask(v45RefreshReview),{once:false});el.addEventListener('input',()=>queueMicrotask(v45RefreshReview),{once:false});});queueMicrotask(v45RefreshReview);};

finishCreate=async function(){const draft=v45CollectDraft(),errors=v45Validation(draft),method=document.querySelector('#c-method')?.value||'standard';if(errors.length){document.querySelector('#creator-errors').innerHTML=errors.map(x=>`<p>${esc(x)}</p>`).join('');v45RefreshReview();return;}const c=newCharacter(draft.classId,draft);c.abilities.generationMethod=method;await saveCharacter(c);state.active=c;state.screen=isSpellcaster(c)?'spells':'sheet';render();toast('Character saved');};
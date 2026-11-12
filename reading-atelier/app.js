(function () {
  'use strict';
  var STORE = 'reading-atelier-v1';
  var DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  var MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var BOOKS = [
    {id:'solaris',title:'Солярис',author:'Станислав Лем',status:'reading',page:0,total:0,
     description:'Атмосфера, память, любовь и пределы человеческого понимания. Уже начатую книгу легче продолжить, чем начинать с чистого листа.',
     question:'Что мы видим в Другом — его самого или собственные ожидания?',level:'Атмосфера и философия'},
    {id:'salamanders',title:'Война с саламандрами',author:'Карел Чапек',status:'planned',page:0,total:0,
     description:'Ироничный, острый роман о цивилизации, выгоде и слепоте общества. Удобный следующий шаг после Лема: форма живая, темы серьёзные.',
     question:'В какой момент обычная выгода превращается в коллективную катастрофу?',level:'Сатира и идеи'},
    {id:'left-hand',title:'Левая рука тьмы',author:'Урсула Ле Гуин',status:'planned',page:0,total:0,
     description:'Неспешное исследование чужой культуры, доверия и того, как привычные категории мешают понимать людей.',
     question:'Какие собственные представления я принимаю за универсальные?',level:'Культура и эмпатия'},
    {id:'blindsight',title:'Ложная слепота',author:'Питер Уоттс',status:'planned',page:0,total:0,
     description:'Плотная и требовательная научная фантастика о сознании, интеллекте и границах восприятия. Оставлена на этап устойчивого интереса.',
     question:'Может ли интеллект существовать без субъективного переживания?',level:'Сложное чтение'}
  ];
  function makeDefault() {return {version:1,books:JSON.parse(JSON.stringify(BOOKS)),activeBook:'solaris',sessions:[],notes:[],reviews:[],weekPlans:{},weekDefault:[8,12,0,8,0,15,0],gentle:true,snooze:{}};}
  function loadState() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return makeDefault();
      var obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.books) || !Array.isArray(obj.sessions)) return makeDefault();
      var def = makeDefault();
      return Object.assign(def,obj,{
        books:obj.books.filter(function(x){return x&&typeof x.id==='string'&&typeof x.title==='string';}),
        sessions:obj.sessions.filter(function(x){return x&&typeof x.book==='string'&&Number.isFinite(Number(x.minutes));}),
        notes:Array.isArray(obj.notes)?obj.notes:[],
        reviews:Array.isArray(obj.reviews)?obj.reviews:[],
        weekPlans:obj.weekPlans&&typeof obj.weekPlans==='object'?obj.weekPlans:{},
        weekDefault:Array.isArray(obj.weekDefault)&&obj.weekDefault.length===7?obj.weekDefault:def.weekDefault,
        snooze:obj.snooze&&typeof obj.snooze==='object'?obj.snooze:{}
      });
    } catch(e){return makeDefault();}
  }
  var state=loadState();
  var timer={initial:8,remaining:480,end:0,interval:null,running:false};
  var toastTimer=null;
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
  function fmtDate(d){var x=new Date(d);return x.getDate()+' '+MONTHS[x.getMonth()];}
  function iso(d){var x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');}
  function parseDay(s){return new Date(String(s).slice(0,10)+'T12:00:00');}
  function dayOffset(s, n){var x=parseDay(s);x.setDate(x.getDate()+n);return iso(x);}
  function monday(date){var d=parseDay(date||iso(new Date()));d.setDate(d.getDate()-((d.getDay()+6)%7));return iso(d);}
  function sameWeek(date){return monday(date)===monday(iso(new Date()));}
  function formatDate(s){if(!s)return '—';var d=parseDay(s);return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear();}
  function n(x){return Math.max(0,Math.round(Number(x)||0));}
  function book(id){return state.books.find(function(b){return b.id===id;})||null;}
  function active(){return book(state.activeBook)||state.books.find(function(b){return b.status==='reading';})||state.books[0];}
  function statusName(s){return {reading:'Читаю сейчас',planned:'В планах',paused:'На паузе',finished:'Прочитано'}[s]||'В планах';}
  function minutes(s){return state.sessions.filter(function(x){return !s||x.mode===s;}).reduce(function(a,x){return a+n(x.minutes);},0);}
  function pages(s){return s.mode==='read'&&Number.isFinite(Number(s.from))&&Number.isFinite(Number(s.to))&&s.from!==''&&s.to!==''?Math.max(0,Number(s.to)-Number(s.from)):0;}
  function latest(id){return state.sessions.filter(function(s){return s.book===id;}).sort(function(a,b){return String(b.date).localeCompare(String(a.date));})[0]||null;}
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){toast('Не удалось сохранить данные в браузере. Скачайте резервную копию.');}}
  function toast(t){var el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove('show');},3500);}
  function safeId(){return 'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
  function sumOf(arr,fn){return arr.reduce(function(a,x){return a+fn(x);},0);}
  function thisWeekSessions(){var start=monday(iso(new Date()));var end=dayOffset(start,6);return state.sessions.filter(function(s){return s.date>=start&&s.date<=end;});}
  function lastSeven(){var now=iso(new Date());return state.sessions.filter(function(s){return s.date>=dayOffset(now,-6)&&s.date<=now;});}
  function numberBox(value,label){return '<div class="stat"><div class="number">'+esc(value)+'</div><small>'+esc(label)+'</small></div>';}
  function go(name){
    if(!document.getElementById(name)||!document.getElementById(name).classList.contains('page'))return;
    document.querySelectorAll('.page').forEach(function(el){el.classList.toggle('active',el.id===name);});
    document.querySelectorAll('.nav-link').forEach(function(el){el.classList.toggle('active',el.dataset.nav===name);});
    history.replaceState(null,'','#'+name);
    if(name==='week')renderWeek();
    if(name==='review')renderReview();
    if(name==='notes')renderNotes();
    if(name==='session')populateBookSelects();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function renderHome(){
    var b=active();if(!b)return;
    var allPages=sumOf(state.sessions,pages);
    var weekly=thisWeekSessions();
    $('quickStats').innerHTML=numberBox(sumOf(weekly.filter(function(s){return s.mode==='read';}),function(s){return n(s.minutes);})+' мин','Чтение на этой неделе')+
      numberBox(sumOf(weekly.filter(function(s){return s.mode==='audio';}),function(s){return n(s.minutes);})+' мин','Аудио на этой неделе')+
      numberBox(allPages,'Страниц за всё время')+
      numberBox(state.sessions.length,'Всего встреч с книгами');
    $('currentBookName').textContent=b.title;
    $('currentBookDesc').textContent=b.description||'Открывайте книгу в своём темпе — здесь не нужно сдавать нормативы.';
    var pct=b.total>0?Math.min(100,Math.round((b.page||0)/b.total*100)):0;
    var note=b.total>0?(n(b.page)+' / '+n(b.total)+' страниц · '+pct+'%'):(b.page>0?'Сейчас на странице '+n(b.page)+' · общий объём можно указать на полке':'Страница ещё не указана — введите её в разделе «Маршрут книг»');
    $('currentBookMeta').innerHTML='<div class="progress-track"><div class="progress-fill" style="width:'+pct+'%"></div></div><div class="text-line"><span>'+esc(note)+'</span><span>'+esc(statusName(b.status))+'</span></div>';
    renderReminders();
  }
  function renderReminders(){
    var today=iso(new Date()),html='',incomplete=state.books.filter(function(b){return b.status==='reading'||b.status==='paused';});
    incomplete.forEach(function(b){
      if(state.snooze[b.id]&&state.snooze[b.id]>today)return;
      var last=latest(b.id),anchor=last?last.date:(b.startedAt||today);
      var age=Math.max(0,Math.floor((parseDay(today)-parseDay(anchor))/86400000));
      var note=b.status==='paused'?'Стоит на паузе — можно вернуться, когда захотите.':last&&age>=10?'Последняя встреча была '+age+' дн. назад. Начать можно с 5 минут.':last?'Продолжение ждёт. Без сроков и обязательств.':'Можно просто открыть на знакомом месте и прочесть одну страницу.';
      html+='<div class="reminder"><strong>'+esc(b.title)+'</strong><p>'+esc(note)+'</p><div class="flex-actions"><button class="link-btn" data-start-book="'+esc(b.id)+'">Продолжить ↗</button><button class="link-btn" data-snooze="'+esc(b.id)+'">Отложить на 7 дней</button><button class="link-btn" data-cal="'+esc(b.id)+'">В календарь ↓</button></div></div>';
    });
    $('reminderList').innerHTML=html||'<div class="empty">Все напоминания отложены. Книги подождут.</div>';
  }
  function renderBooks(){
    var out='';
    state.books.forEach(function(b,i){
      var pct=b.total>0?Math.min(100,Math.round(n(b.page)/n(b.total)*100)):0;
      out+='<article class="book-card '+(active()&&active().id===b.id?'active-book':'')+'">'+
        '<div class="book-numeral">'+String(i+1).padStart(2,'0')+' <span style="font-size:12px;font-style:normal;color:#9bac9d">/ КНИГА</span></div>'+
        '<span class="book-status">'+esc(statusName(b.status))+'</span>'+
        '<h2>'+esc(b.title)+'</h2><div class="book-author">'+esc(b.author)+' · '+esc(b.level||'Мой маршрут')+'</div>'+
        '<p>'+esc(b.description||'Ваша книга — ваш собственный маршрут.')+'</p>'+
        (b.question?'<div class="book-question">Вопрос для чтения: '+esc(b.question)+'</div>':'')+
        '<div class="progress-track"><div class="progress-fill" style="width:'+pct+'%"></div></div>'+
        '<div class="book-page-input"><label>Страница <input aria-label="Текущая страница '+esc(b.title)+'" type="number" min="0" max="999999" value="'+n(b.page)+'" data-page="'+esc(b.id)+'"></label><label>Всего <input aria-label="Всего страниц в '+esc(b.title)+'" type="number" min="0" max="999999" value="'+n(b.total)+'" data-total="'+esc(b.id)+'"></label></div>'+
        '<div class="book-actions">'+
        '<button class="btn small '+(b.status==='reading'?'soft':'primary')+'" data-start-book="'+esc(b.id)+'">'+(b.status==='reading'?'Продолжить':'Начать читать')+'</button>'+
        '<button class="btn small ghost" data-finish="'+esc(b.id)+'">Прочитана ✓</button>'+
        '<select class="subtle-select" aria-label="Статус книги '+esc(b.title)+'" data-status="'+esc(b.id)+'">'+
        ['planned','reading','paused','finished'].map(function(s){return '<option value="'+s+'" '+(b.status===s?'selected':'')+'>'+statusName(s)+'</option>';}).join('')+'</select></div>'+
        '</article>';
    });
    $('bookGrid').innerHTML=out;
  }
  function populateBookSelects(){
    var selectors=[$('sessionBook'),$('noteBook')];
    selectors.forEach(function(el){
      if(!el)return;
      var keep=el.value||state.activeBook;
      el.innerHTML=state.books.map(function(b){return '<option value="'+esc(b.id)+'">'+esc(b.title)+'</option>';}).join('');
      el.value=book(keep)?keep:(active()?active().id:'');
    });
    updatePagesFromBook();
  }
  function updatePagesFromBook(){
    var b=book($('sessionBook').value);
    $('pageFrom').value=b&&b.page>0?b.page:'';
    $('pageTo').value='';
  }
  function planForWeek(){
    var key=monday(iso(new Date()));
    var plan=state.weekPlans[key];
    return Array.isArray(plan)&&plan.length===7?plan:state.weekDefault.slice();
  }
  function renderWeek(){
    var key=monday(iso(new Date()));
    var plan=planForWeek();
    $('weekDates').textContent=fmtDate(parseDay(key))+' — '+fmtDate(parseDay(dayOffset(key,6)));
    $('gentleToggle').checked=!!state.gentle;
    var week=thisWeekSessions(),hits=0,planned=0;
    var html=plan.map(function(value,i){
      var date=dayOffset(key,i),onDate=week.filter(function(s){return s.date===date;});
      var readMin=sumOf(onDate.filter(function(s){return s.mode==='read';}),function(s){return n(s.minutes);});
      var audioMin=sumOf(onDate.filter(function(s){return s.mode==='audio';}),function(s){return n(s.minutes);});
      if(readMin>0)hits++;
      if(n(value)>0)planned++;
      return '<div class="day-card '+(date===iso(new Date())?'today':'')+'"><div class="dow">'+DAYS[i]+'</div>'+
        '<div class="day-num">'+parseDay(date).getDate()+'</div><span class="day-min">'+(n(value)?'Цель '+n(value)+' м':'Свободно')+'</span>'+
        '<input type="number" min="0" max="240" step="1" aria-label="План минут на '+DAYS[i]+'" value="'+n(value)+'" data-week-day="'+i+'">'+
        '<div class="day-done">'+(readMin?'✓ '+readMin+' м чт.':audioMin?'♫ '+audioMin+' м аудио':'&nbsp;')+'</div></div>';
    }).join('');
    $('weekGrid').innerHTML=html;
    $('weekDone').textContent=state.gentle?'Встреч с чтением: '+hits+' · запланировано дней: '+planned+'. Без долгов за пропуски.':'Сессий чтения по дням: '+hits+' / '+planned+' запланированных.';
  }
  function renderRecent(){
    var arr=state.sessions.slice().sort(function(a,b){return (String(b.date)+String(b.id)).localeCompare(String(a.date)+String(a.id));}).slice(0,12);
    $('recentSessions').innerHTML=arr.map(function(s){
      return '<div class="session-row"><div class="session-date">'+esc(fmtDate(parseDay(s.date)))+'</div><div class="session-body"><strong>'+esc(book(s.book)?book(s.book).title:'Книга')+'</strong><p>'+
       n(s.minutes)+' мин · '+(s.mode==='audio'?'прослушивание':'чтение')+(pages(s)?' · '+pages(s)+' стр.':'')+
       (s.feeling?' · '+esc(s.feeling):'')+'</p></div><span class="session-mode">'+(s.mode==='audio'?'♫ аудио':'▤ текст')+'</span><button aria-label="Удалить запись" class="delete-btn" data-delete-session="'+esc(s.id)+'">×</button></div>';
    }).join('')||'<p class="empty">Первая запись появится после вашей первой встречи с книгой.</p>';
  }
  function renderNotes(){
    $('notesCount').textContent=state.notes.length+' заметок';
    var sorted=state.notes.slice().sort(function(a,b){return (String(b.date)+String(b.id)).localeCompare(String(a.date)+String(a.id));});
    $('notesList').innerHTML=sorted.map(function(note){
      return '<div class="note-card"><div class="small-tag">'+esc(formatDate(note.date))+' · '+esc(book(note.book)?book(note.book).title:'Книга')+'</div><strong>'+esc(note.chapter)+'</strong>'+
       (note.happened?'<p><b>Сюжет:</b> '+esc(note.happened)+'</p>':'')+
       (note.emotion?'<p><b>Эмоция:</b> '+esc(note.emotion)+'</p>':'')+
       (note.thought?'<p><b>Мысль:</b> '+esc(note.thought)+'</p>':'')+
       (note.question?'<p><b>Вопрос:</b> '+esc(note.question)+'</p>':'')+
       '<div class="note-actions"><button class="link-btn" data-copy-note="'+esc(note.id)+'">Скопировать</button><button class="link-btn" data-delete-note="'+esc(note.id)+'">Удалить</button></div></div>';
    }).join('')||'<p class="empty">Здесь появятся ваши мысли по главам. Можно начать с одного предложения.</p>';
  }
  function getMean(arr,key){return arr.length?(sumOf(arr,function(x){return n(x[key]);})/arr.length):null;}
  function compareRow(label,arr,key,color){
    var v=getMean(arr,key);return '<div class="comp-line"><span>'+esc(label)+'</span><div class="comp-track"><div class="comp-fill" style="background:'+color+';width:'+(v==null?0:(v/5*100).toFixed(1))+'%"></div></div><b>'+(v==null?'—':v.toFixed(1))+'</b></div>';
  }
  function renderReview(){
    var week=thisWeekSessions(),last=lastSeven(),r=last.filter(function(s){return s.mode==='read';}),a=last.filter(function(s){return s.mode==='audio';});
    $('reviewStats').innerHTML=numberBox(sumOf(week.filter(function(s){return s.mode==='read';}),function(s){return n(s.minutes);})+' мин','Чтение за текущую неделю')+
      numberBox(sumOf(week.filter(function(s){return s.mode==='audio';}),function(s){return n(s.minutes);})+' мин','Аудио за текущую неделю')+
      numberBox(sumOf(week,pages),'Страниц на этой неделе')+
      numberBox(new Set(week.filter(function(s){return s.mode==='read';}).map(function(s){return s.date;})).size,'Дней с чтением');
    var days=[];for(var i=6;i>=0;i--)days.push(dayOffset(iso(new Date()),-i));
    var max=Math.max(15,...days.map(function(day){return sumOf(last.filter(function(s){return s.date===day;}),function(s){return n(s.minutes);});}));
    $('weeklyBars').innerHTML=days.map(function(day){
      var cur=last.filter(function(s){return s.date===day;});
      var readMin=sumOf(cur.filter(function(s){return s.mode==='read';}),function(s){return n(s.minutes);});
      var audioMin=sumOf(cur.filter(function(s){return s.mode==='audio';}),function(s){return n(s.minutes);});
      return '<div class="bar-col" title="'+esc(day+': чтение '+readMin+' мин, аудио '+audioMin+' мин')+'"><div class="bar-heights">'+
        '<div class="bar-read" style="height:'+(readMin/max*142).toFixed(1)+'px"></div><div class="bar-audio" style="height:'+(audioMin/max*142).toFixed(1)+'px"></div></div><small>'+DAYS[(parseDay(day).getDay()+6)%7]+'</small></div>';
    }).join('');
    $('comparison').innerHTML='<div class="comp-title">▤ Чтение · '+r.length+' сесс.</div>'+
      compareRow('Вовлечённость',r,'eng','#5d8a70')+compareRow('Понимание',r,'under','#5d8a70')+compareRow('Удовольствие',r,'joy','#5d8a70')+
      '<div class="comp-title">♫ Аудиокниги · '+a.length+' сесс.</div>'+
      compareRow('Вовлечённость',a,'eng','#d5af8b')+compareRow('Понимание',a,'under','#d5af8b')+compareRow('Удовольствие',a,'joy','#d5af8b');
    var current=state.reviews.find(function(x){return x.week===monday(iso(new Date()));});
    var form=$('reviewForm');
    ['highlight','context','next'].forEach(function(k){form.elements[k].value=current?String(current[k]||''):'';});
    $('pastReviews').innerHTML=state.reviews.slice().sort(function(a,b){return String(b.week).localeCompare(String(a.week));}).slice(0,8).map(function(x){
      return '<div class="review-saved"><h3>Неделя от '+esc(formatDate(x.week))+'</h3>'+
        (x.highlight?'<p><b>Запомнилось:</b> '+esc(x.highlight)+'</p>':'')+
        (x.context?'<p><b>Удобно:</b> '+esc(x.context)+'</p>':'')+
        (x.next?'<p><b>Следующий шаг:</b> '+esc(x.next)+'</p>':'')+'</div>';
    }).join('')||'<p class="empty">Вы ещё не писали недельный обзор. Он не обязателен.</p>';
  }
  function renderAll(){renderHome();renderBooks();populateBookSelects();renderWeek();renderRecent();renderNotes();renderReview();}
  function selectBook(id,open){
    var b=book(id);if(!b)return;
    if(b.status!=='finished')b.status='reading';
    b.startedAt=b.startedAt||iso(new Date());state.activeBook=id;
    persist();renderAll();toast('Книга выбрана. Не нужно начинать с первой страницы.');
    if(open)go('session');
  }
  function setStatus(id,status){
    var b=book(id);if(!b)return;
    b.status=status;
    if(status==='reading'){state.activeBook=id;b.startedAt=b.startedAt||iso(new Date());}
    if(status==='finished'&&b.total>0)b.page=b.total;
    persist();renderAll();toast(status==='finished'?'Книга прочитана. Можно дать ей немного отзвучать.':'Статус книги обновлён.');
  }
  function updateSessionMode(){
    var audio=$('sessionMode').value==='audio';
    $('pagesRow').hidden=audio;
    if(audio){$('pageFrom').value='';$('pageTo').value='';}
    else updatePagesFromBook();
  }
  function recordSession(e){
    e.preventDefault();
    var f=e.target,fd=new FormData(f),mode=fd.get('mode'),id=String(fd.get('book')||'');
    var min=n(fd.get('minutes')),from=String(fd.get('from')||''),to=String(fd.get('to')||''),d=String(fd.get('date')||'');
    if(!book(id)||min<1||min>600||!(/^\d{4}-\d{2}-\d{2}$/.test(d))){
      $('sessionFeedback').textContent='Проверьте книгу, дату и количество минут.';return;
    }
    if(mode==='read'&&((from===''&&to!=='')||(from!==''&&to==='')||(from!==''&&Number(to)<Number(from)))){
      $('sessionFeedback').textContent='Для подсчёта страниц укажите начало и конец, либо оставьте оба поля пустыми.';return;
    }
    var rec={id:safeId(),book:id,date:d,mode:mode,minutes:min,from:mode==='read'&&from!==''?Number(from):'',to:mode==='read'&&to!==''?Number(to):'',
      wellbeing:String(fd.get('wellbeing')),place:String(fd.get('place')),eng:n(fd.get('eng')),under:n(fd.get('under')),joy:n(fd.get('joy')),feeling:String(fd.get('feeling')||'').slice(0,600)};
    state.sessions.push(rec);
    var b=book(id);
    if(b){if(mode==='read'&&to!=='')b.page=Math.max(n(b.page),n(to));if(b.status==='planned')b.status='reading';}
    state.activeBook=id;
    persist();
    f.elements.feeling.value='';$('sessionFeedback').textContent='Сохранено. Спасибо за время, которое вы подарили истории.';
    renderAll();
    $('sessionFeedback').textContent='Сохранено. Спасибо за время, которое вы подарили истории.';
    toast('Встреча с книгой сохранена ✺');
  }
  function deleteSession(id){
    if(!confirm('Удалить эту запись о сессии?'))return;
    state.sessions=state.sessions.filter(function(s){return s.id!==id;});
    persist();renderAll();toast('Запись удалена.');
  }
  function recordNote(e){
    e.preventDefault();var f=e.target,fd=new FormData(f);
    var note={id:safeId(),date:iso(new Date()),book:String(fd.get('book')),chapter:String(fd.get('chapter')||'').trim().slice(0,120),
      happened:String(fd.get('happened')||'').slice(0,2500),emotion:String(fd.get('emotion')||'').slice(0,2500),
      thought:String(fd.get('thought')||'').slice(0,2500),question:String(fd.get('question')||'').slice(0,2500)};
    if(!note.chapter){$('noteFeedback').textContent='Назовите главу или фрагмент.';return;}
    state.notes.push(note);persist();f.reset();populateBookSelects();renderNotes();
    $('noteFeedback').textContent='Заметка сохранена. Необязательно писать длинно.';
    toast('Заметка сохранена ✎');
  }
  function noteText(x){
    return [book(x.book)?book(x.book).title:'Книга','Глава: '+x.chapter,'Что произошло: '+(x.happened||'—'),'Эмоция: '+(x.emotion||'—'),'Мысль: '+(x.thought||'—'),'Вопрос: '+(x.question||'—')].join('\n');
  }
  function copyText(text){
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){toast('Текст скопирован.');}).catch(function(){window.prompt('Скопируйте текст:',text);});
    else window.prompt('Скопируйте текст:',text);
  }
  function saveReview(e){
    e.preventDefault();var f=e.target,fd=new FormData(f),week=monday(iso(new Date()));
    var r={week:week,highlight:String(fd.get('highlight')||'').slice(0,2500),context:String(fd.get('context')||'').slice(0,2500),next:String(fd.get('next')||'').slice(0,2500)};
    state.reviews=state.reviews.filter(function(x){return x.week!==week;});state.reviews.push(r);persist();renderReview();
    $('reviewFeedback').textContent='Обзор сохранён. Это история интереса, а не отчёт.';
  }
  function download(content,name,type){
    var url=URL.createObjectURL(new Blob([content],{type:type||'text/plain;charset=utf-8'}));
    var link=document.createElement('a');link.href=url;link.download=name;link.style.display='none';document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},2000);
  }
  function exportData(){download(JSON.stringify(state,null,2),'reading-atelier-'+iso(new Date())+'.json','application/json;charset=utf-8');toast('Резервная копия скачана.');}
  function calendarReminder(id){
    var b=book(id);if(!b)return;
    var d=new Date();d.setDate(d.getDate()+7);d.setHours(19,30,0,0);
    function stamp(t){return new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}
    function icsEscape(t){return String(t).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
    var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Reading Atelier//RU','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+safeId()+'@reading-atelier','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(d),'DTEND:'+stamp(d.getTime()+600000),'SUMMARY:'+icsEscape('5 минут с книгой «'+b.title+'»'),'DESCRIPTION:'+icsEscape('Мягкое приглашение вернуться к незавершённой книге. Без обязательств.'),'BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY','DESCRIPTION:Время побыть с книгой','END:VALARM','END:VEVENT','END:VCALENDAR'];
    download(lines.join('\r\n'),'chitat-'+id+'.ics','text/calendar;charset=utf-8');toast('Файл календаря скачан. Добавьте событие в календарь.');
  }
  function timerDraw(){
    var s=Math.max(0,timer.remaining);
    $('timerDisplay').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    $('timerStart').textContent=timer.running?'Пауза':s<timer.initial*60?'Продолжить':'Начать';
  }
  function timerStop(){if(timer.interval)clearInterval(timer.interval);timer.interval=null;timer.running=false;timerDraw();}
  function timerTick(){
    if(!timer.running)return;
    timer.remaining=Math.max(0,Math.ceil((timer.end-Date.now())/1000));
    if(timer.remaining===0){
      timerStop();$('sessionMinutes').value=timer.initial;$('timerHint').textContent='Время вышло. Хотите — сохраните сессию. Продолжать необязательно.';
      toast('Короткая сессия завершена. Можно остановиться или продолжить.');
    }else timerDraw();
  }
  function timerStart(){
    if(timer.running){timer.remaining=Math.max(0,Math.ceil((timer.end-Date.now())/1000));timerStop();}
    else{if(timer.remaining<=0)timer.remaining=timer.initial*60;timer.end=Date.now()+timer.remaining*1000;timer.running=true;timer.interval=setInterval(timerTick,300);timerDraw();}
  }
  function timerReset(){timerStop();timer.remaining=timer.initial*60;timerDraw();$('timerHint').textContent='Когда время выйдет, можно остановиться посреди главы. Это нормально.';}
  function initEvents(){
    document.addEventListener('click',function(e){
      var el=e.target.closest('button,[data-go]');
      if(!el)return;
      if(el.dataset.go){go(el.dataset.go);return;}
      if(el.dataset.startBook){selectBook(el.dataset.startBook,true);return;}
      if(el.dataset.finish){setStatus(el.dataset.finish,'finished');return;}
      if(el.dataset.snooze){state.snooze[el.dataset.snooze]=dayOffset(iso(new Date()),7);persist();renderReminders();toast('Напоминание спрятано на неделю.');return;}
      if(el.dataset.cal){calendarReminder(el.dataset.cal);return;}
      if(el.dataset.deleteSession){deleteSession(el.dataset.deleteSession);return;}
      if(el.dataset.deleteNote){if(confirm('Удалить эту заметку?')){state.notes=state.notes.filter(function(x){return x.id!==el.dataset.deleteNote;});persist();renderNotes();}return;}
      if(el.dataset.copyNote){var no=state.notes.find(function(x){return x.id===el.dataset.copyNote;});if(no)copyText(noteText(no));return;}
      if(el.dataset.vibe){
        document.querySelectorAll('.choice').forEach(function(x){x.classList.toggle('selected',x===el);});
        var hint={gentle:'Продолжите «Солярис» с небольшой сцены или вернитесь на несколько страниц назад без чувства вины.',ideas:'«Война с саламандрами» и «Левая рука тьмы» хорошо подходят, чтобы размышлять о нашем обществе.',intense:'«Ложная слепота» лучше зайдёт в спокойные часы, когда хочется сложного текста без спешки.'};
        $('vibeHint').textContent=hint[el.dataset.vibe]||'';return;
      }
      if(el.dataset.time){timer.initial=n(el.dataset.time);document.querySelectorAll('.time-pill').forEach(function(x){x.classList.toggle('selected',x===el);});timerReset();$('sessionMinutes').value=timer.initial;return;}
    });
    document.addEventListener('change',function(e){
      var el=e.target;
      if(el.dataset.status){setStatus(el.dataset.status,el.value);return;}
      if(el.dataset.page){var b=book(el.dataset.page);if(b){b.page=n(el.value);if(b.total>0)b.page=Math.min(b.page,b.total);persist();renderAll();}return;}
      if(el.dataset.total){var t=book(el.dataset.total);if(t){t.total=n(el.value);persist();renderAll();}return;}
      if(el.dataset.weekDay!==undefined){var plan=planForWeek(),index=Number(el.dataset.weekDay);if(index>=0&&index<=6){plan[index]=Math.min(240,n(el.value));state.weekPlans[monday(iso(new Date()))]=plan;persist();renderWeek();}return;}
    });
    $('sessionBook').addEventListener('change',updatePagesFromBook);
    $('sessionMode').addEventListener('change',updateSessionMode);
    ['eng','under','joy'].forEach(function(id){$(id).addEventListener('input',function(){$(id==='eng'?'engOut':id==='under'?'underOut':'joyOut').textContent=$(id).value;});});
    $('sessionForm').addEventListener('submit',recordSession);
    $('noteForm').addEventListener('submit',recordNote);
    $('reviewForm').addEventListener('submit',saveReview);
    $('addBookForm').addEventListener('submit',function(e){
      e.preventDefault();var fd=new FormData(e.target),title=String(fd.get('title')||'').trim(),author=String(fd.get('author')||'').trim();
      if(!title||!author)return;
      state.books.push({id:safeId(),title:title.slice(0,120),author:author.slice(0,100),description:'Книга на вашей личной полке.',question:'Что я хочу найти в этой истории?',level:'Свой выбор',status:'planned',page:0,total:0});
      e.target.reset();persist();renderAll();toast('Книга добавлена на полку.');
    });
    $('gentleToggle').addEventListener('change',function(e){state.gentle=e.target.checked;persist();renderWeek();toast(state.gentle?'Мягкий режим включён.':'Можно следить за выполнением плана, но без штрафов.');});
    $('resetWeek').addEventListener('click',function(){delete state.weekPlans[monday(iso(new Date()))];persist();renderWeek();toast('Мягкий план возвращён.');});
    $('timerStart').addEventListener('click',timerStart);$('timerReset').addEventListener('click',timerReset);
    $('copyDiscussion').addEventListener('click',function(){
      var b=active();
      copyText('Хочу обсудить прочитанное без спойлеров дальнейшего сюжета. Книга: '+(b?b.title:'моя книга')+
        '. Помоги мне разобраться в собственных впечатлениях: 1) Какую сцену я запомнил и почему? 2) Что я чувствовал и как это связано с героями? 3) Какой выбор героя я не понимаю? 4) Как книга проверяет мои привычные взгляды? Задавай по одному вопросу, не пересказывай сюжет вперёд.');
    });
    $('backupBtn').addEventListener('click',exportData);$('exportBtn').addEventListener('click',exportData);
    $('importFile').addEventListener('change',function(e){
      var f=e.target.files&&e.target.files[0];if(!f)return;
      if(f.size>3000000){toast('Файл слишком большой для импорта.');e.target.value='';return;}
      var reader=new FileReader();
      reader.onload=function(){
        try{
          var obj=JSON.parse(reader.result);
          if(!obj||!Array.isArray(obj.books)||!Array.isArray(obj.sessions)||obj.books.some(function(b){return !b||typeof b.id!=='string'||typeof b.title!=='string';}))throw new Error('Неверный формат');
          if(!confirm('Заменить текущие записи данными из резервной копии?'))return;
          localStorage.setItem(STORE,JSON.stringify(obj));state=loadState();renderAll();toast('Данные импортированы.');go('home');
        }catch(err){toast('Не удалось импортировать JSON: проверьте файл.');}
        e.target.value='';
      };reader.readAsText(f,'UTF-8');
    });
    window.addEventListener('hashchange',function(){var name=location.hash.slice(1);if(document.getElementById(name)&&document.getElementById(name).classList.contains('page'))go(name);});
  }
  function init(){
    $('todayLabel').textContent=formatDate(iso(new Date()));
    $('sessionDate').value=iso(new Date());
    initEvents();renderAll();updateSessionMode();timerDraw();
    var initial=location.hash.replace('#','');go(initial&&document.getElementById(initial)&&document.getElementById(initial).classList.contains('page')?initial:'home');
    if('serviceWorker' in navigator&&location.protocol==='https:'){
      navigator.serviceWorker.register('./sw.js').catch(function(){});
    }
  }
  document.addEventListener('DOMContentLoaded',init);
})();
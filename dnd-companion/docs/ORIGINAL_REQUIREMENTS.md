Создай полноценное мобильное офлайн HTML/PWA-приложение для создания, ведения и использования персонажей **Dungeons & Dragons 5th Edition по правилам 2014 года**.

Приложение должно совмещать:

- конструктор персонажа;
- интерактивный character sheet;
- автоматический rules engine;
- dice roller;
- spellbook;
- справочник правил;
- менеджер состояния персонажа;
- режим боя;
- режим игровой сессии;
- инвентарь;
- журнал действий;
- импорт/экспорт персонажей;
- поддержку пользовательского контента.

Главная цель:

**создать удобного мобильного офлайн-помощника игрока D&D 5e 2014, который максимально автоматизирует расчёты, но не принимает решения за Dungeon Master.**

---

# 1. Правила

Используй именно:

**Dungeons & Dragons 5th Edition — правила 2014 года.**

Не смешивай механику с Player's Handbook 2024.

Все формулы и игровые механики должны соответствовать D&D 5e 2014.

Это касается:

- Ability Scores;
- Ability Modifiers;
- Proficiency Bonus;
- Skills;
- Saving Throws;
- Armor Class;
- Hit Points;
- Hit Dice;
- Initiative;
- Speed;
- Attacks;
- Critical Hits;
- Spellcasting;
- Spell Slots;
- Concentration;
- Short Rest;
- Long Rest;
- Conditions;
- Death Saving Throws;
- Exhaustion;
- Multiclass;
- Level Up;
- Temporary HP;
- Resistances;
- Vulnerabilities;
- Immunities;
- Advantage;
- Disadvantage;
- Inspiration;
- Class Resources;
- Carrying Capacity;
- Passive Checks;
- другие механики редакции 2014.

Создай единый Rules Engine.

Не дублируй игровую логику в разных частях приложения.

---

# 2. Общий принцип автоматизации

Если результат однозначно определяется:

- правилами D&D 5e 2014;
- характеристиками персонажа;
- экипировкой;
- активными эффектами;
- состояниями;
- выбором пользователя;

приложение должно рассчитать его автоматически.

Если для результата нужна неизвестная приложению информация игрового мира, приложение должно запросить её или оставить решение игроку.

Не придумывай самостоятельно:

- AC противника;
- расстояние до цели;
- видимость;
- Cover;
- позицию существ;
- реакцию NPC;
- успешность социальных действий;
- решения Dungeon Master.

---

# 3. Технологии

Используй:

- HTML;
- CSS;
- JavaScript.

Приложение должно полностью работать локально.

Не использовать обязательные:

- API;
- сервер;
- CDN;
- внешние библиотеки;
- внешние шрифты;
- интернет-запросы.

После установки приложение должно работать при полном отсутствии интернета.

---

# 4. PWA

Реализуй приложение как Progressive Web App.

Необходимы:

- manifest.json;
- service-worker.js;
- offline cache;
- иконки;
- возможность установки на Android;
- полноэкранный режим;
- корректная работа после закрытия браузера.

Приложение должно позднее без изменения архитектуры работать через GitHub Pages.

---

# 5. Хранение данных

Используй IndexedDB или другую подходящую локальную систему хранения.

После каждого значимого действия автоматически сохранять персонажа.

Поддерживать:

- несколько персонажей;
- автоматическое сохранение;
- резервные копии;
- экспорт JSON;
- импорт JSON.

Добавь versioning структуры сохранений.

Например:

schemaVersion: 1

Архитектура должна позволять выполнять миграции сохранений после будущих обновлений приложения.

Старые персонажи не должны исчезать после обновления версии.

---

# 6. Архитектура

Раздели приложение как минимум логически на:

- UI;
- Character State;
- Rules Engine;
- Dice Engine;
- Effects Engine;
- Content Database;
- Storage;
- Import/Export;
- Session Manager;
- Action History.

Не смешивай игровую механику непосредственно с DOM-кодом.

Пример файловой структуры:

/index.html

/css/
app.css

/js/
app.js
rules.js
character.js
dice.js
effects.js
storage.js
content.js
session.js
history.js

/manifest.json

/service-worker.js

/assets/

Если предложишь более качественную структуру — используй её.

---

# 7. Создание персонажа

Создай пошаговый Character Creator.

Интерфейс должен подходить в том числе новичку.

---

# 8. Основная информация

Позволить ввести:

- имя персонажа;
- имя игрока;
- портрет;
- уровень;
- класс;
- расу;
- предысторию;
- alignment;
- заметки.

---

# 9. Выбор расы

Показывать доступные варианты из встроенного разрешённого контента.

При выборе автоматически применять механические особенности.

Показывать пользователю:

- что изменилось;
- какие бонусы получены;
- какие способности добавлены.

---

# 10. Класс

При выборе класса автоматически определить:

- Hit Die;
- Saving Throw Proficiencies;
- Armor Proficiencies;
- Weapon Proficiencies;
- Tool Proficiencies;
- доступные навыки;
- стартовое оборудование;
- Class Features;
- Spellcasting;
- Class Resources.

---

# 11. Ability Scores

Поддерживать:

- Standard Array;
- Point Buy;
- Dice Roll;
- ручной ввод.

Характеристики:

STR
DEX
CON
INT
WIS
CHA

Автоматически рассчитывать Ability Modifier.

Все зависимые показатели должны пересчитываться автоматически.

---

# 12. Навыки

Поддерживать все навыки D&D 5e 2014.

Учитывать:

- Proficiency;
- Expertise;
- Ability Modifier;
- дополнительные бонусы;
- временные эффекты.

Не позволять в Strict Mode выбирать незаконное количество Proficiencies.

---

# 13. Saving Throws

Автоматически рассчитывать Saving Throws.

Учитывать:

- Ability Modifier;
- Proficiency;
- Class Features;
- Feats;
- Items;
- Effects.

---

# 14. Стартовое снаряжение

При создании персонажа дать выбрать допустимые варианты стартового оборудования.

После выбора автоматически:

- добавить предметы;
- экипировать выбранную броню;
- добавить оружие;
- рассчитать AC;
- рассчитать атаки;
- рассчитать Carry Weight.

---

# 15. Spellcasting

Для spellcasting-классов автоматически рассчитывать:

- Spellcasting Ability;
- Spell Save DC;
- Spell Attack Bonus;
- Spell Slots;
- Cantrips;
- Known Spells;
- Prepared Spells.

Учитывать уровень класса и Multiclass.

---

# 16. Проверка готовности персонажа

Перед завершением создания персонажа показать:

**Проверка персонажа**

Если есть проблемы:

**Персонаж пока не готов**

и список причин.

Например:

- не выбран навык;
- выбрано слишком много навыков;
- не выбрано оборудование;
- слишком много подготовленных заклинаний;
- пропущен обязательный выбор;
- нарушено правило Point Buy.

В режиме Homebrew разрешить продолжить.

---

# 17. Strict Rules и Homebrew

Добавить режим:

**STRICT RULES**

и

**HOMEBREW**

Strict Rules:

- проверять ограничения;
- не позволять явно незаконные комбинации;
- предупреждать о проблемах.

Homebrew:

- разрешать ручное изменение параметров;
- создавать пользовательские классы;
- создавать заклинания;
- создавать предметы;
- создавать Features;
- изменять характеристики.

Homebrew-изменения должны иметь визуальную отметку.

---

# 18. Multiclass

Поддерживать Multiclass.

Например:

Fighter 3 / Wizard 4

Общий уровень:

7

Правильно рассчитывать:

- Proficiency Bonus;
- HP;
- Hit Dice;
- Spell Slots;
- Class Features;
- Class Resources;
- требования для Multiclass;
- Spellcasting.

---

# 19. Level Up

Добавить кнопку:

**LEVEL UP**

Создать отдельный мастер повышения уровня.

Приложение должно определить:

- изменение HP;
- новый Hit Die;
- Proficiency Bonus;
- новые Class Features;
- Subclass Features;
- Spell Slots;
- Spells;
- ASI;
- Feats;
- новые ресурсы.

После завершения показать:

**Что изменилось**

Например:

HP 31 → 38

Proficiency +2 → +3

New Feature: Extra Attack

---

# 20. Главный Character Sheet

Основной экран персонажа должен содержать:

Имя

Class / Level

Race

Background

крупно:

HP

Temp HP

AC

Speed

Initiative

Proficiency Bonus

ниже:

STR
DEX
CON
INT
WIS
CHA

Также:

- Saving Throws;
- Skills;
- Passive Perception;
- Conditions;
- Concentration;
- Inspiration.

---

# 21. Session Mode

Добавь отдельный режим:

**SESSION MODE**

Этот режим предназначен для использования непосредственно во время партии.

Скрыть второстепенные настройки.

Основные игровые функции должны быть доступны максимум за 1–2 нажатия.

---

# 22. Session Home

Показывать крупно:

HP

Temp HP

AC

Speed

Initiative

Conditions

Concentration

Resources

Также быстрые кнопки:

- Attack;
- Spell;
- Skill;
- Saving Throw;
- Damage;
- Heal;
- Ability;
- Item;
- Condition;
- Rest;
- Dice.

---

# 23. Нижняя навигация

На смартфоне использовать фиксированную Bottom Navigation.

Например:

Sheet

Combat

Spells

Actions

More

---

# 24. Quick Bar

Позволить закрепить 4–8 часто используемых действий.

Например:

Stealth

Perception

Longbow

Sneak Attack

Fireball

Healing Word

Second Wind

Potion

Quick Bar должна быть доступна на основном экране сессии.

---

# 25. Favorites

Позволить добавлять в избранное:

- Actions;
- Skills;
- Attacks;
- Spells;
- Items;
- Rules.

---

# 26. Dice Roller

Встроить Dice Engine.

Поддерживать:

d4

d6

d8

d10

d12

d20

d100

и выражения:

2d6+3

1d20+5

4d8

2d10+1d6+4

Показывать отдельные выпавшие кубы и итог.

---

# 27. Advantage / Disadvantage

Для d20 поддерживать:

Normal

Advantage

Disadvantage

При Advantage бросать 2d20 и брать большее.

При Disadvantage — меньшее.

---

# 28. Advantage / Disadvantage Engine

Все источники Advantage и Disadvantage должны проходить через единый механизм.

Например:

Advantage:

Invisible

Disadvantage:

Poisoned

Результат:

Normal Roll

Согласно правилам D&D 5e 2014 один источник Advantage и один источник Disadvantage полностью отменяют друг друга независимо от их количества.

Показывать пользователю причины.

---

# 29. Skills

Показывать:

Acrobatics

Animal Handling

Arcana

Athletics

Deception

History

Insight

Intimidation

Investigation

Medicine

Nature

Perception

Performance

Persuasion

Religion

Sleight of Hand

Stealth

Survival

и итоговый Bonus.

При нажатии автоматически выполнять:

1d20 + Skill Modifier.

---

# 30. Ability Checks

Добавить отдельные:

STR Check

DEX Check

CON Check

INT Check

WIS Check

CHA Check

---

# 31. Saving Throws

По нажатию на Saving Throw выполнять:

1d20 + Saving Throw Modifier.

---

# 32. Атаки

Создать вкладку:

**ATTACKS**

Для каждой атаки показывать:

Name

Attack Bonus

Damage

Damage Type

Range

Properties

Например:

Longsword

+6 to hit

1d8+4 Slashing

---

# 33. Attack Roll

При атаке:

Normal

Advantage

Disadvantage

После броска показать:

d20

Modifier

Total

Например:

14 + 6

TOTAL 20

Не определять попадание без AC противника.

Если пользователь введёт Enemy AC, показать:

HIT

или

MISS.

---

# 34. Damage Roll

После попадания предложить:

**ROLL DAMAGE**

Показать:

Dice

Modifier

Total Damage

Damage Type.

---

# 35. Critical Hit

При Natural 20:

**CRITICAL HIT**

Корректно применить правила 2014.

Удваивать Damage Dice.

Не удваивать статический Modifier.

Например:

1d8 + 4

становится:

2d8 + 4.

---

# 36. Natural 1

Natural 1:

**AUTOMATIC MISS**

Не добавлять таблицу Critical Failure без отдельного Homebrew-переключателя.

---

# 37. Spellbook

Создать отдельный экран:

**SPELLS**

Показывать:

- Cantrips;
- Known Spells;
- Prepared Spells;
- Spell Slots.

---

# 38. Spell Slots

Визуально показывать доступные и использованные slots.

Например:

Level 1

● ● ○ ○

Level 2

● ○ ○

Позволить вручную исправить состояние слотов.

---

# 39. Cast Spell

У каждого заклинания:

**CAST**

После нажатия приложение определяет:

- доступные уровни Slot;
- Upcasting;
- Spell Attack;
- Save DC;
- Damage;
- Healing;
- Concentration.

---

# 40. Upcasting

Если заклинание поддерживает Upcasting, автоматически менять соответствующие параметры.

Например:

Fireball

Level 3 → 8d6

Level 4 → 9d6

Level 5 → 10d6.

---

# 41. Spell Attack

Для заклинаний с Attack Roll показывать:

Spell Attack Bonus

и кнопки:

Normal

Advantage

Disadvantage.

---

# 42. Saving Throw Spell

Для заклинания с Saving Throw показывать:

например:

DEX Save DC 15.

Если заклинание наносит половину Damage после успешного Save:

показывать:

Full Damage

Half Damage.

---

# 43. Concentration

При касте Concentration Spell предложить:

**Start Concentration**

Если Concentration уже активна:

показать существующее заклинание.

Например:

Current:

Hunter's Mark

New:

Bless

Показать предупреждение, что начало новой концентрации завершит предыдущую.

---

# 44. Concentration Check

Если персонаж получает Damage во время Concentration:

автоматически предложить Constitution Saving Throw.

DC:

max(10, floor(damage / 2))

по правилам D&D 5e 2014.

После провала предложить завершить Concentration.

---

# 45. Class Features

Создать раздел:

**MY ABILITIES**

Показывать:

- Race Features;
- Class Features;
- Subclass Features;
- Feats;
- Special Actions;
- Passive Abilities.

Для каждой способности обозначать тип:

Action

Bonus Action

Reaction

Passive

Special.

---

# 46. Активные способности

Для способности, имеющей ресурс, добавить:

**USE**

Например:

Second Wind

1 / 1

Bonus Action

Healing:

1d10 + Fighter Level.

После использования:

- бросить Healing;
- восстановить HP;
- потратить ресурс;
- добавить запись в журнал.

---

# 47. Class Resources

Создай универсальную систему ресурсов.

Например:

Second Wind

1 / 1

Action Surge

1 / 1

Superiority Dice

3 / 4

Bardic Inspiration

2 / 4

Ki

4 / 5

У ресурса должны быть:

- Current;
- Maximum;
- Recovery Type.

Recovery:

Short Rest

Long Rest

Dawn

Manual

Custom.

---

# 48. Actions

Создать раздел:

**ACTIONS**

Содержит общие действия D&D и специальные Actions персонажа.

---

# 49. Bonus Actions

Создать:

**BONUS ACTIONS**

Показывать только те Bonus Actions, которые потенциально доступны персонажу.

---

# 50. Reactions

Создать:

**REACTIONS**

Например:

Opportunity Attack

Shield

Counterspell

Class Reaction.

---

# 51. Что я могу сделать?

Добавить кнопку:

**WHAT CAN I DO?**

Показывать:

### Action

Attack

Cast a Spell

Dash

Disengage

Dodge

Help

Hide

Ready

Search

Use an Object

и способности персонажа.

### Bonus Action

Показывать доступные персонажу варианты.

### Reaction

Показывать возможные реакции.

### Movement

Показывать Speed.

Не утверждать, что контекстное действие точно доступно, если приложение не знает положение персонажей.

---

# 52. Получение урона

Добавить:

**DAMAGE**

Пользователь вводит:

Amount

Damage Type.

Например:

18

Fire.

Rules Engine должен учитывать:

- Resistance;
- Immunity;
- Vulnerability;
- Temporary HP.

---

# 53. Damage Result

Например:

18 Fire Damage

Resistance: Fire

Final Damage: 9

Temp HP:

5 → 0

HP:

41 → 37.

---

# 54. Temporary HP

Temporary HP должны работать по правилам D&D 5e 2014.

Они не складываются.

Если текущие:

5

а получено:

8

предложить заменить 5 на 8.

Если получено 3:

показать, что текущие 5 выгоднее.

---

# 55. Healing

Добавить:

**HEAL**

HP не могут превышать Maximum HP.

Например:

Current:

17 / 43

Healing:

12

Result:

29 / 43.

---

# 56. 0 HP

При достижении 0 HP автоматически перейти в режим:

**UNCONSCIOUS / DEATH SAVES**

---

# 57. Death Saving Throws

Показывать:

Success

○ ○ ○

Failures

○ ○ ○

Кнопка:

**ROLL DEATH SAVE**

Правила:

Natural 1 → 2 failures

Natural 20 → 1 HP

10–19 → success

2–9 → failure

3 successes → Stable

3 failures → Dead.

---

# 58. Damage at 0 HP

Если персонаж получает Damage при 0 HP:

помочь применить соответствующие последствия.

Если атака была Critical Hit, корректно учитывать дополнительные Failed Death Saves.

Не определять Critical Hit самостоятельно без информации пользователя.

---

# 59. Instant Death

Если оставшийся Damage потенциально приводит к Instant Death по правилам D&D 5e 2014:

выполнить проверку и предупредить пользователя.

---

# 60. Conditions

Поддерживать:

Blinded

Charmed

Deafened

Frightened

Grappled

Incapacitated

Invisible

Paralyzed

Petrified

Poisoned

Prone

Restrained

Stunned

Unconscious.

---

# 61. Condition Manager

Добавить кнопку:

**CONDITIONS**

Позволить:

- добавить Condition;
- убрать Condition;
- открыть описание.

Активные Conditions должны быть хорошо заметны.

---

# 62. Автоматическое влияние Conditions

Rules Engine должен автоматически применять те эффекты состояния, которые можно однозначно определить.

Например:

Poisoned

→ Disadvantage on Attack Rolls and Ability Checks.

---

# 63. Short Rest

Добавить:

**SHORT REST**

Показать:

Available Hit Dice.

Игрок может тратить их по одному.

Автоматически бросать:

Hit Die + CON Modifier

если это применимо.

После отдыха восстановить соответствующие Class Resources.

---

# 64. Short Rest Summary

Показать:

HP

до / после

Hit Dice

до / после

Restored Resources.

---

# 65. Long Rest

Добавить:

**LONG REST**

Перед применением показать Preview.

Например:

HP:

18 → 44

Spell Slots:

Restore All

Hit Dice:

2 / 8 → 6 / 8

Second Wind:

Restore

Action Surge:

Restore.

После подтверждения применить правила D&D 5e 2014.

---

# 66. Inspiration

Добавить состояние:

**INSPIRATION**

ON / OFF.

Перед расходованием Inspiration запросить подтверждение.

---

# 67. Inventory

Создать:

**INVENTORY**

Категории:

Weapons

Armor

Consumables

Tools

Magic Items

Other.

---

# 68. Предмет

Каждый предмет должен иметь:

Name

Quantity

Weight

Category

Equipped

Notes

Description

Effects.

---

# 69. Carrying Capacity

Автоматически рассчитывать Carrying Capacity.

При необходимости позволить отключить Encumbrance Rules.

---

# 70. Деньги

Добавить кошелёк:

CP

SP

EP

GP

PP.

---

# 71. Пользовательские предметы

Позволить создать собственный предмет.

Предмет может иметь механический эффект.

Например:

Boots of Speed

Speed +10 ft.

После экипировки Rules Engine должен автоматически применить эффект.

---

# 72. Effects Engine

Создать универсальную систему:

**EFFECTS**

Эффекты могут быть:

Permanent

Temporary

Equipped Item

Condition

Spell

Feature

Manual.

---

# 73. Механические эффекты

Effect может изменять:

- Ability Score;
- Ability Modifier;
- AC;
- Speed;
- HP;
- Max HP;
- Attack Bonus;
- Damage;
- Saving Throw;
- Skill;
- Spell Save DC;
- Spell Attack;
- Resistance;
- Immunity;
- Vulnerability;
- Advantage;
- Disadvantage.

---

# 74. Duration

Эффект может иметь Duration:

Rounds

Minutes

Hours

Until Rest

Until Short Rest

Until Long Rest

Manual.

---

# 75. Активные эффекты

На основном экране показывать важные активные эффекты.

Позволить:

- включить;
- выключить;
- удалить;
- открыть описание.

---

# 76. Справочник

Добавить полноценный офлайн-раздел:

**REFERENCE**

Категории:

- Spells;
- Classes;
- Subclasses;
- Races;
- Backgrounds;
- Feats;
- Weapons;
- Armor;
- Equipment;
- Conditions;
- Skills;
- Damage Types;
- Combat Rules;
- Actions;
- Rest;
- Concentration;
- Death;
- Multiclass;
- Level Up;
- General Rules.

---

# 77. Правовая часть справочника

Не копируй незаконно закрытый контент коммерческих книг.

Используй встроенный контент:

- SRD 5.1;
- открытые материалы;
- другой легально распространяемый контент.

Для закрытого контента создай систему пользовательского добавления данных.

---

# 78. Spell Reference

Для каждого заклинания хранить структурированные данные:

Name

Level

School

Ritual

Casting Time

Range

Components

Verbal

Somatic

Material

Material Description

Duration

Concentration

Damage

Damage Type

Saving Throw

Attack Roll

Classes

Description

Upcasting.

---

# 79. Поиск заклинаний

Фильтры:

Level

Class

School

Concentration

Ritual

Casting Time

Damage Type.

Добавить текстовый поиск.

---

# 80. Связь Spellbook и Reference

Если игрок нажимает на заклинание в своём Spellbook:

открыть соответствующую запись справочника.

Кнопки:

Cast

Upcast

Favorite

Description.

---

# 81. Глобальный поиск

Добавить глобальный Offline Search.

Пользователь может искать:

концентрация

prone

Opportunity Attack

падение

укрытие

две руки

fire

и получать соответствующие записи справочника.

---

# 82. Краткий и полный режим справки

Для правил создать два режима:

**Quick**

**Full**

Quick должен показывать только основную механику, необходимую во время игры.

---

# 83. Контекстная помощь

Рядом со сложными параметрами добавить:

`?`

Например:

AC [?]

Concentration [?]

Death Save [?]

После нажатия открыть короткое объяснение.

---

# 84. Beginner Mode

Добавить:

**BEGINNER MODE**

В этом режиме:

- чаще показывать подсказки;
- объяснять термины;
- показывать, откуда берётся Bonus;
- объяснять последствия выбора;
- показывать подсказки при Level Up.

Не перегружать экран текстом.

---

# 85. Откуда взялось значение

Для важных параметров добавить возможность открыть Calculation Breakdown.

Например:

AC 17

нажатие:

Base: 10

DEX: +3

Armor: +2

Shield: +2

Total: 17.

Аналогично:

Attack Bonus

Skill Bonus

Save Bonus

Spell DC

HP

Initiative.

---

# 86. Content Packs

Создать систему:

**CONTENT PACKS**

Например:

SRD 5.1

My Homebrew

Campaign Content.

Content Pack можно:

- включить;
- выключить;
- импортировать;
- экспортировать.

Формат:

JSON.

---

# 87. Пользовательский контент

Позволить создать:

- Race;
- Class;
- Subclass;
- Background;
- Feat;
- Spell;
- Weapon;
- Armor;
- Item;
- Feature;
- Resource;
- Rule;
- Effect.

---

# 88. Несколько персонажей

Стартовый экран:

**MY CHARACTERS**

Карточки:

Portrait

Name

Class

Level

Кнопки:

Continue

Duplicate

Export

Delete.

Также:

Create Character

Import Character.

---

# 89. Журнал действий

Хранить локальный журнал игровой сессии.

Например:

19:42

Longsword Attack

21

19:42

Damage Roll

9 Slashing

19:45

Damage Received

14 Fire

Resistance → 7

HP 31 → 24

19:48

Second Wind

+9 HP

19:51

Fireball Level 3

Spell Slot 3:

3 → 2.

---

# 90. Undo

Добавить Undo для действий, меняющих состояние персонажа.

Хранить минимум последние 20 операций.

Undo должен работать для:

- Damage;
- Healing;
- Temp HP;
- Spell Slot;
- Resource;
- Condition;
- Item Use;
- Rest;
- Concentration;
- Effects.

Не нужно делать Undo обычного Dice Roll, если он не изменил состояние.

---

# 91. Initiative

Добавить:

**ROLL INITIATIVE**

Roll:

d20 + Initiative Modifier.

Учитывать эффекты и Features.

---

# 92. Combat Screen

Создать отдельный:

**COMBAT MODE**

Показывать одновременно:

HP

Temp HP

AC

Conditions

Concentration

Attacks

Favorite Spells

Class Resources.

Основные действия должны быть доступны одной рукой на смартфоне.

---

# 93. Дизайн

Mobile First.

Минимальная ширина:

320 px.

Интерфейс должен хорошо работать на современных Android-смартфонах.

Использовать:

- крупные Touch Targets;
- минимум мелких кнопок;
- минимум горизонтальной прокрутки;
- Bottom Navigation;
- Cards;
- Bottom Sheets;
- Modal Panels.

Не использовать интерфейс, зависящий от Hover.

---

# 94. Стиль

Современный минималистичный дизайн с лёгкой атмосферой Fantasy.

Не имитировать буквально бумажный Character Sheet.

Приоритет:

**удобство > декоративность.**

---

# 95. Темы

Поддерживать:

Dark Mode

Light Mode

System Mode.

---

# 96. Визуальные состояния

HP должны быть визуально заметны.

Low HP должен иметь отдельное состояние.

Использованные ресурсы должны хорошо отличаться от доступных.

Conditions и Concentration должны быть видны, но не перегружать экран.

---

# 97. Доступность

Использовать:

- хороший Contrast;
- крупные шрифты;
- понятные иконки;
- текстовые подписи;
- достаточные области нажатия.

Не использовать только цвет для передачи критической информации.

---

# 98. Ошибки пользователя

Не допускать потери данных при случайном:

- закрытии;
- обновлении;
- переходе назад;
- повороте экрана.

Опасные действия подтверждать.

Например:

Delete Character.

---

# 99. Автотесты Rules Engine

Создай набор тестов.

Проверить:

Ability Modifier

Proficiency Bonus

Skill

Expertise

Saving Throw

AC

HP

Initiative

Spell Save DC

Spell Attack

Attack Bonus

Critical Hit

Temporary HP

Resistance

Vulnerability

Immunity

Advantage

Disadvantage

Concentration DC

Death Save

Short Rest

Long Rest

Multiclass

Spell Slots

Level Up

Effects.

---

# 100. Обязательные тестовые персонажи

Для разработки создай несколько тестовых персонажей.

Например:

Human Fighter 1

Elf Rogue 3

Dwarf Cleric 5

Wizard 5

Fighter 3 / Wizard 4.

Использовать их для проверки Rules Engine.

---

# 101. Тестовый игровой сценарий

Обязательно протестируй вручную следующий сценарий:

1. создать персонажа первого уровня;
2. сохранить;
3. закрыть приложение;
4. открыть снова;
5. проверить сохранение;
6. сделать Skill Check;
7. сделать Saving Throw;
8. сделать Attack Roll;
9. бросить Damage;
10. получить Damage;
11. получить Temporary HP;
12. получить Healing;
13. добавить Condition;
14. использовать Class Feature;
15. использовать Spell Slot;
16. использовать Concentration Spell;
17. получить Damage;
18. сделать Concentration Check;
19. провести Short Rest;
20. провести Long Rest;
21. получить 0 HP;
22. сделать Death Saves;
23. выполнить Level Up;
24. экспортировать персонажа;
25. удалить персонажа;
26. импортировать персонажа обратно;
27. перезапустить приложение без интернета.

Все найденные ошибки исправить до финальной выдачи.

---

# 102. Не делать фальшивый функционал

Не создавать:

- декоративные кнопки без действия;
- placeholder-функции;
- псевдокод вместо реализации;
- элементы интерфейса, которые ничего не сохраняют;
- формы, данные которых пропадают после закрытия.

Если функция включена в интерфейс — она должна работать.

---

# 103. Этап разработки

Не начинай сразу писать весь код.

Сначала выдай:

### Этап 1

Архитектура проекта.

### Этап 2

Модель данных Character State.

### Этап 3

Модель Content Database.

### Этап 4

Rules Engine.

### Этап 5

Effects Engine.

### Этап 6

Storage и Versioning.

### Этап 7

Wireframe основных экранов.

### Этап 8

Только после этого — реализация.

---

# 104. Приоритет первой версии

Если весь проект слишком большой для одной итерации, не делай плохую реализацию всего сразу.

Сначала создай полностью рабочее ядро:

1. Character Creator;
2. Character Sheet;
3. Rules Engine;
4. Session Mode;
5. Dice Roller;
6. Combat;
7. HP / Damage / Healing;
8. Skills;
9. Saving Throws;
10. Attacks;
11. Spell Slots;
12. Conditions;
13. Concentration;
14. Rest;
15. Resources;
16. Local Storage;
17. Export / Import;
18. Undo.

После этого расширяй справочник и пользовательский контент.

Но архитектура с самого начала должна предусматривать все функции этого технического задания.

---

# 105. Финальный результат

В результате создай полностью рабочий проект.

Я должен иметь возможность:

1. скачать файлы;
2. открыть приложение;
3. создать персонажа;
4. закрыть браузер;
5. снова открыть приложение;
6. продолжить играть;
7. использовать приложение без интернета;
8. установить его на Android как PWA;
9. позже разместить проект на GitHub Pages.

---

# 106. Критерий качества

Считай приложение успешным, если во время реальной D&D-сессии игроку практически не требуется отдельно открывать Character Sheet, калькулятор и справочник.

Приложение должно отвечать на три основных вопроса:

**Что умеет мой персонаж?**

**Что я сейчас могу сделать?**

**Как изменилось состояние моего персонажа после этого действия?**

При этом все вычисления должны соответствовать D&D 5e 2014.
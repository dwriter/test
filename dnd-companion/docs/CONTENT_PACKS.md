# Пакеты контента

Импорт: «Ещё → Домашние правила и пакеты → Импорт пакета JSON».

Верхний уровень: `schemaVersion: 1`, уникальный `id`, начинающийся с `custom-`, `name`, `enabled`, `content`.

Категории: races, subraces, classes, subclasses, backgrounds, feats, spells, equipment, features, resources, rule-sections, effects, levels, traits. Не более 3000 записей. Для каждой нужны `name` и `index`, начинающийся с полного id пакета и дефиса.

Схемы базовых записей следуют JSON SRD в data/. Ссылки имеют вид `{index,name}`. Дополнительные ключи сохраняются. Это формат данных, он не выполняет код и не превращает произвольное текстовое умение в автоматическую механику.

- equipment: карточка SRD плюс `effects`. При добавлении создаётся независимая копия предмета.
- spells: `level` 0–9, `classes` как массив ссылок, `school`, `casting_time`, `range`, `duration`, `components`, `desc`; опциональные ritual/concentration. Damage — массив с `damage_type` и таблицей `damage_at_slot_level` или `damage_at_character_level`. Healing: `heal_at_slot_level`.
- races/subraces: speed, size, ability_bonuses и ссылки на traits.
- classes: hit_die, proficiencies, saving_throws, proficiency_choices, starting_equipment, starting_equipment_options, subclasses; progression в levels с index вида `<class-index>-<level>`. Базовое создание и HP работают; автоматическая нестандартная магия и ресурсы требуют расширения правил или ручных счётчиков.
- resources/effects: библиотечные определения. Для конкретного персонажа добавьте их через формы ресурса и эффекта. Импорт не накладывает их на всех персонажей.

## Эффекты предмета

```json
[
  {"name":"Лёгкий шаг","target":"speed","operation":"add","value":10},
  {"name":"Защита","target":"ac","operation":"add","value":1}
]
```

Полезные target: ability.str/dex/con/int/wis/cha; hp.max; ac; speed; initiative; attack; damage; save; save.dex; skill.stealth; passive.perception; spell.attack; spell.dc; concentration; resistance; vulnerability; immunity.

Операции: add (число), set (задать число), dice (например 1d4 к attack/save/skill), advantage, disadvantage; для сопротивлений — trait и value: идентификатор типа урона или all.

Duration: permanent, rounds, minutes, hours, short, long, rest. В модели `remaining` всегда в секундах; форма переводит минуты/часы автоматически. Время продвигается новым ходом, отдыхом или вручную. Длительность не зависит от реального времени закрытого браузера.

Пример `samples/custom-pack.json` можно импортировать без изменения. Он добавляет ботинки со скоростью +10 и собственное заклинание. Выключение пакета убирает справочные записи, но сохраняет предметы и прочие копии в персонаже.

# D&D 5e 2014 Player — Core v2

Mobile-first offline PWA for D&D 5e (2014 rules).

## Core v2 implemented
- Standard Human Fighter creation
- Standard Array, Point Buy, manual scores, 4d6 drop lowest
- Fighter skill choices and all six 2014 Fighting Styles
- Fighter levels 1–5
- Second Wind and Action Surge resources
- Champion at level 3 with Improved Critical (19–20)
- Ability Score Improvement at Fighter 4
- Extra Attack at Fighter 5
- AC, skills, saves, initiative, attacks and calculation breakdowns
- Damage, healing, temporary HP
- 0 HP / Unconscious state, Death Saves, damage at 0 HP, Instant Death
- Short Rest with Hit Dice spent one at a time
- Long Rest preview and resource/Hit Dice restoration
- Conditions, dice roller, action history, Undo
- IndexedDB autosave, JSON import/export, schema migration from Core v1
- PWA service worker and offline cache

## Still planned
Spellcasting, concentration workflow, spell slots, Wizard/Cleric, multiclass, full SRD reference, content packs, fuller inventory and effects UI.

## Run locally
Use an HTTP server (service workers do not run from `file://`):

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

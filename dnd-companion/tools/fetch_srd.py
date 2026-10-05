import urllib.request,concurrent.futures,pathlib,json
root=pathlib.Path(__file__).resolve().parents[1]
names=['Classes','Subclasses','Races','Subraces','Backgrounds','Features','Traits','Equipment','Magic-Items','Spells','Conditions','Skills','Damage-Types','Rules','Rule-Sections','Feats','Levels','Proficiencies','Weapon-Properties','Languages','Ability-Scores','Magic-Schools']
def get(name):
 p=root/'data'/f'{name.lower()}.json'
 if p.exists():return name,len(json.loads(p.read_text()))
 url=f'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-{name}.json'
 data=urllib.request.urlopen(url,timeout=40).read();json.loads(data);p.write_bytes(data);return name,len(json.loads(data))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
 for r in ex.map(get,names):print(*r,flush=True)
d={p.stem:json.loads(p.read_text()) for p in (root/'data').glob('*.json')}
(root/'js'/'srd-data.js').write_text('globalThis.SRD='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
try:(root/'docs'/'SRD_CC_v5.1.pdf').write_bytes(urllib.request.urlopen('https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf',timeout=40).read())
except Exception as e:print('PDF',str(e))
for name in ['LICENSE','LICENSE.md']:
 try:(root/'docs'/'5e-bits-LICENSE.txt').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/5e-bits/5e-database/main/'+name,timeout=20).read());break
 except:pass

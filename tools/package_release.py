"""Build separate offline demo and complete course archives, without npm caches."""
from pathlib import Path
import zipfile,hashlib,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'deliverables'
OUT.mkdir(exist_ok=True)

def pack(name,entries):
    target=OUT/(name+'.zip');manifest=[]
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p,relative in sorted(entries,key=lambda item:item[1]):
            data=p.read_bytes();manifest.append({'path':relative,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()});z.writestr(name+'/'+relative,data)
        z.writestr(name+'/PACKAGE_MANIFEST.json',json.dumps({'kind':name,'files':manifest},ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(target) as z:assert z.testzip() is None
    print(f'{target.name}: {len(manifest)} files, {target.stat().st_size/1024/1024:.1f} MiB; CRC pass')
    return {'file':target.name,'files':len(manifest),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}

artifacts=[]
if not __import__('sys').argv[1:] or '--demo' in __import__('sys').argv:
    demo=[(p,str(p.relative_to(ROOT))) for p in (ROOT/'app/dist').rglob('*') if p.is_file()]
    demo.extend((ROOT/'app'/p,'app/'+p) for p in ['scripts/start-demo.mjs','scripts/serve.mjs','scripts/check-assets.mjs','scripts/asset-manifest.mjs','package.json','start-demo.sh','start-demo.bat'])
    demo.append((OUT/'离线演示_启动说明.txt','README.txt'))
    artifacts.append(pack('入画_离线演示包',demo))
if not __import__('sys').argv[1:] or '--course' in __import__('sys').argv:
    entries=[]
    for directory in ['app','deliverables','evidence','tools','.github']:
        for p in (ROOT/directory).rglob('*'):
            if not p.is_file() or set(p.parts)&{'node_modules','__pycache__','.git','history'} or p.suffix in {'.zip','.pyc'}:continue
            if p.parent==ROOT/'evidence/recording' and p.suffix=='.webm':continue
            if p.name in {'release-archives.json','SHA256SUMS.txt'}:continue
            if p.parent==ROOT/'evidence/unpacked-browser' and p.name!='acceptance.json':continue
            entries.append((p,str(p.relative_to(ROOT))))
    for p in ROOT.iterdir():
        if p.is_file() and (p.suffix in {'.md','.txt','.pdf','.pptx'} or p.name in {'.gitignore','.gitattributes'}):entries.append((p,p.name))
    artifacts.append(pack('名画仿拍_完整结课包',entries))
existing={}
if (ROOT/'evidence/release-archives.json').exists():existing={x['file']:x for x in json.loads((ROOT/'evidence/release-archives.json').read_text())}
for x in artifacts:existing[x['file']]=x
(ROOT/'evidence').mkdir(exist_ok=True)
(ROOT/'evidence/release-archives.json').write_text(json.dumps(list(existing.values()),ensure_ascii=False,indent=2)+'\n')
(OUT/'SHA256SUMS.txt').write_text(''.join(f"{item['sha256']}  {item['file']}\n" for item in existing.values()))

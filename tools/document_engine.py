"""Small dependency-free PDF / editable PPTX renderer for this course project.

Uses original RGB PNG/JPEG bytes without editing the images. Text remains text.
PDF embeds the local Apache-2.0 CJK font; PPTX uses Microsoft YaHei on Windows.
"""
from pathlib import Path
import struct, zlib, zipfile, html, re

ROOT=Path(__file__).resolve().parents[1]
FONT=ROOT/'app/public/artworks/CJK.ttf'
PAPER='#f6f2e9'; INK='#282e29'; RED='#a34c38'; MUTED='#747b6b'

def rgb(value): return tuple(int(value.lstrip('#')[i:i+2],16)/255 for i in (0,2,4))
def xml(value): return html.escape(str(value),quote=True)
def dimensions(file):
    data=(ROOT/Path(file)).read_bytes()
    if data[:8]==b'\x89PNG\r\n\x1a\n': return struct.unpack('>II',data[16:24])
    i=2
    while i<len(data):
        if data[i]!=255: i+=1;continue
        marker=data[i+1];i+=2
        if marker in (0xd8,0xd9):continue
        size=struct.unpack('>H',data[i:i+2])[0]
        if marker in (0xc0,0xc1,0xc2):
            h,w=struct.unpack('>HH',data[i+3:i+7]);return w,h
        i+=size
    raise ValueError(f'Unsupported image {file}')
def wrap(text,width,size):
    lines=[]
    for paragraph in str(text).split('\n'):
        row='';used=0
        for ch in paragraph:
            advance=size*(.54 if ord(ch)<128 else 1)
            if used+advance>width and row:lines.append(row);row='';used=0
            row+=ch;used+=advance
        lines.append(row)
    return lines
def text(s,x,y,w,size=18,color=INK,line=1.5):return {'kind':'text','text':s,'x':x,'y':y,'w':w,'size':size,'color':color,'line':line}
def rect(x,y,w,h,color):return {'kind':'rect','x':x,'y':y,'w':w,'h':h,'color':color}
def image(file,x,y,w,h):
    iw,ih=dimensions(file);scale=min(w/iw,h/ih);nw,nh=iw*scale,ih*scale
    return {'kind':'image','file':str(Path(file).relative_to(ROOT)),'x':x+(w-nw)/2,'y':y+(h-nh)/2,'w':nw,'h':nh}

class PDF:
    def __init__(self): self.objects=[];self.image_ids={};self.width_maps={}
    def obj(self,data=b''):
        if isinstance(data,str):data=data.encode()
        self.objects.append(data);return len(self.objects)
    def stream(self,data,extra=''):
        compressed=zlib.compress(data)
        return self.obj(f'<< /Length {len(compressed)} /Filter /FlateDecode {extra} >>\nstream\n'.encode()+compressed+b'\nendstream')
    def font(self,characters,fontfile=FONT):
        fontname=fontfile.stem;data=fontfile.read_bytes();n=struct.unpack('>H',data[4:6])[0];tables={}
        for i in range(n):
            tag,_,offset,length=struct.unpack('>4sIII',data[12+i*16:28+i*16]);tables[tag.decode()]=data[offset:offset+length]
        cmap=tables['cmap'];count=struct.unpack('>H',cmap[2:4])[0];mapping={};best=None
        for i in range(count):
            platform,encoding,offset=struct.unpack('>HHI',cmap[4+i*8:12+i*8]);fmt=struct.unpack('>H',cmap[offset:offset+2])[0]
            if fmt==12:best=(12,offset);break
            if fmt==4:best=(4,offset)
        fmt,o=best
        if fmt==12:
            groups=struct.unpack('>I',cmap[o+12:o+16])[0]
            for i in range(groups):
                start,end,gid=struct.unpack('>III',cmap[o+16+i*12:o+28+i*12])
                for code in range(start,min(end,65535)+1):mapping[code]=gid+code-start
        else:
            count=struct.unpack('>H',cmap[o+6:o+8])[0]//2;ends=o+14;starts=ends+2*count+2;deltas=starts+2*count;ranges=deltas+2*count
            for i in range(count):
                start=struct.unpack('>H',cmap[starts+2*i:starts+2*i+2])[0];end=struct.unpack('>H',cmap[ends+2*i:ends+2*i+2])[0]
                delta=struct.unpack('>h',cmap[deltas+2*i:deltas+2*i+2])[0];off=struct.unpack('>H',cmap[ranges+2*i:ranges+2*i+2])[0]
                for code in range(start,end+1):
                    if off:
                        address=ranges+2*i+off+2*(code-start);g=struct.unpack('>H',cmap[address:address+2])[0];g=(g+delta)&65535 if g else 0
                    else:g=(code+delta)&65535
                    mapping[code]=g
        units=struct.unpack('>H',tables['head'][18:20])[0];bbox=struct.unpack('>hhhh',tables['head'][36:44]);asc,desc=struct.unpack('>hh',tables['hhea'][4:8]);num=struct.unpack('>H',tables['hhea'][34:36])[0]
        widths={};last=struct.unpack('>H',tables['hmtx'][4*(num-1):4*(num-1)+2])[0]
        for code in characters:
            gid=mapping.get(code,0);adv=struct.unpack('>H',tables['hmtx'][gid*4:gid*4+2])[0] if gid<num else last;widths[code]=round(adv/units*1000)
        self.width_maps[str(fontfile)]=widths
        cid=bytearray(65536*2)
        for code,gid in mapping.items():
            if code<65536 and gid<65536:struct.pack_into('>H',cid,code*2,gid)
        file_id=self.stream(data,f'/Length1 {len(data)}');cid_id=self.stream(bytes(cid))
        desc_id=self.obj(f'<< /Type /FontDescriptor /FontName /{fontname} /Flags 4 /FontBBox [{" ".join(str(round(v/units*1000)) for v in bbox)}] /ItalicAngle 0 /Ascent {round(asc/units*1000)} /Descent {round(desc/units*1000)} /CapHeight 880 /StemV 80 /FontFile2 {file_id} 0 R >>')
        width_spec=' '.join(f'{c} [{w}]' for c,w in sorted(widths.items()))
        descendant=self.obj(f'<< /Type /Font /Subtype /CIDFontType2 /BaseFont /{fontname} /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor {desc_id} 0 R /DW 1000 /W [{width_spec}] /CIDToGIDMap {cid_id} 0 R >>')
        unicode=self.stream(b'/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n1 beginbfrange\n<0000> <FFFF> <0000>\nendbfrange\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend')
        cjk=self.obj(f'<< /Type /Font /Subtype /Type0 /BaseFont /{fontname} /Encoding /Identity-H /DescendantFonts [{descendant} 0 R] /ToUnicode {unicode} 0 R >>')
        return cjk
    def add_image(self,file):
        if file in self.image_ids:return self.image_ids[file]
        data=(ROOT/Path(file)).read_bytes();w,h=dimensions(file)
        if data[:8]==b'\x89PNG\r\n\x1a\n':
            depth,ctype=data[24:26]
            if depth!=8 or ctype!=2:raise ValueError('Expected RGB 8-bit PNG')
            pos=8;idat=b''
            while pos<len(data):
                length=struct.unpack('>I',data[pos:pos+4])[0];kind=data[pos+4:pos+8]
                if kind==b'IDAT':idat+=data[pos+8:pos+8+length]
                pos+=12+length
            body=idat;filter='/FlateDecode';params=f'/DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns {w} >>'
        else:body=data;filter='/DCTDecode';params=''
        oid=self.obj(f'<< /Type /XObject /Subtype /Image /Width {w} /Height {h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter {filter} {params} /Length {len(body)} >>\nstream\n'.encode()+body+b'\nendstream');self.image_ids[file]=oid;return oid
    def write(self,pages,file,width,height):
        chars={ord(c) for page in pages for e in page if e['kind']=='text' for c in e['text'] if ord(c)<65536}
        cjk=self.font(chars);latin=self.font(chars|set(range(128)),ROOT/'app/public/artworks/Latin.ttf');catalog=self.obj();page_tree=self.obj();page_ids=[]
        for page in pages:
            commands=[];resources={}
            for e in page:
                kind=e['kind'];x,y=e['x'],e['y']
                if kind=='rect':commands.append(f'{" ".join(map(str,rgb(e["color"])))} rg {x} {height-y-e["h"]} {e["w"]} {e["h"]} re f')
                elif kind=='image':
                    iid=self.add_image(e['file']);name=f'Im{iid}';resources[name]=iid;commands.append(f'q {e["w"]} 0 0 {e["h"]} {x} {height-y-e["h"]} cm /{name} Do Q')
                else:
                    size=e['size'];color=' '.join(map(str,rgb(e['color'])))
                    for n,line in enumerate(wrap(e['text'],e['w'],size)):
                        offset=x;baseline=height-y-size-n*size*e['line']
                        for run in re.findall(r'[\x00-\u2fff]+|[^\x00-\u2fff]+',line):
                            ascii_run=ord(run[0])<0x3000;font='F2' if ascii_run else 'F1';encoded=run.encode('utf-16-be').hex()
                            
                            commands.append(f'BT {color} rg /{font} {size} Tf 1 0 0 1 {offset} {baseline} Tm <{encoded}> Tj ET')
                            metrics=self.width_maps[str(ROOT/'app/public/artworks/Latin.ttf' if ascii_run else FONT)]
                            offset+=sum(metrics.get(ord(c),1000)*size/1000 for c in run)
            content=self.stream('\n'.join(commands).encode());xobjects=' '.join(f'/{name} {oid} 0 R' for name,oid in resources.items())
            page_ids.append(self.obj(f'<< /Type /Page /Parent {page_tree} 0 R /MediaBox [0 0 {width} {height}] /Resources << /Font << /F1 {cjk} 0 R /F2 {latin} 0 R >> /XObject << {xobjects} >> >> /Contents {content} 0 R >>'))
        self.objects[page_tree-1]=f'<< /Type /Pages /Count {len(page_ids)} /Kids [{" ".join(f"{i} 0 R" for i in page_ids)}] >>'.encode();self.objects[catalog-1]=f'<< /Type /Catalog /Pages {page_tree} 0 R >>'.encode()
        output=bytearray(b'%PDF-1.7\n%\xe2\xe3\xcf\xd3\n');offsets=[0]
        for i,obj in enumerate(self.objects,1):offsets.append(len(output));output+=f'{i} 0 obj\n'.encode()+obj+b'\nendobj\n'
        start=len(output);output+=f'xref\n0 {len(offsets)}\n0000000000 65535 f \n'.encode()
        for offset in offsets[1:]:output+=f'{offset:010d} 00000 n \n'.encode()
        output+=f'trailer\n<< /Size {len(offsets)} /Root {catalog} 0 R >>\nstartxref\n{start}\n%%EOF'.encode();Path(file).write_bytes(output)

def pptx(pages,file,width=960,height=540):
    ns='http://schemas.openxmlformats.org/presentationml/2006/main';a='http://schemas.openxmlformats.org/drawingml/2006/main';r='http://schemas.openxmlformats.org/officeDocument/2006/relationships';rel='http://schemas.openxmlformats.org/package/2006/relationships'
    def emu(n):return round(n*12700)
    def relation(items):return f'<Relationships xmlns="{rel}">'+''.join(f'<Relationship Id="{i}" Type="{r}/{t}" Target="{xml(v)}"/>' for i,t,v in items)+'</Relationships>'
    def group():return '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
    overrides=[('/ppt/presentation.xml','application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'),('/ppt/slideMasters/slideMaster1.xml','application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'),('/ppt/slideLayouts/slideLayout1.xml','application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'),('/ppt/theme/theme1.xml','application/vnd.openxmlformats-officedocument.theme+xml')]
    with zipfile.ZipFile(file,'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('_rels/.rels',relation([('rId1','officeDocument','ppt/presentation.xml')]))
        pres=f'<p:presentation xmlns:p="{ns}" xmlns:a="{a}" xmlns:r="{r}"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>'+''.join(f'<p:sldId id="{255+i}" r:id="rId{i+1}"/>' for i in range(1,len(pages)+1))+f'</p:sldIdLst><p:sldSz cx="{emu(width)}" cy="{emu(height)}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>'
        z.writestr('ppt/presentation.xml',pres);z.writestr('ppt/_rels/presentation.xml.rels',relation([('rId1','slideMaster','slideMasters/slideMaster1.xml')]+[(f'rId{i+1}','slide',f'slides/slide{i}.xml') for i in range(1,len(pages)+1)]))
        master=f'<p:sldMaster xmlns:p="{ns}" xmlns:a="{a}" xmlns:r="{r}"><p:cSld><p:spTree>{group()}</p:spTree></p:cSld><p:clrMap accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" bg1="lt1" bg2="lt2" folHlink="folHlink" hlink="hlink" tx1="dk1" tx2="dk2"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>'
        z.writestr('ppt/slideMasters/slideMaster1.xml',master);z.writestr('ppt/slideMasters/_rels/slideMaster1.xml.rels',relation([('rId1','slideLayout','../slideLayouts/slideLayout1.xml'),('rId2','theme','../theme/theme1.xml')]))
        z.writestr('ppt/slideLayouts/slideLayout1.xml',f'<p:sldLayout xmlns:p="{ns}" xmlns:a="{a}" xmlns:r="{r}" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>{group()}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>');z.writestr('ppt/slideLayouts/_rels/slideLayout1.xml.rels',relation([('rId1','slideMaster','../slideMasters/slideMaster1.xml')]))
        # Reuse the course deck's valid theme only; no original slides are modified.
        original=next(ROOT.glob('*.pptx'))
        with zipfile.ZipFile(original) as old:z.writestr('ppt/theme/theme1.xml',old.read('ppt/theme/theme1.xml'))
        image_count=0
        for i,page in enumerate(pages,1):
            shapes=[group()];relations=[('rId1','slideLayout','../slideLayouts/slideLayout1.xml')]
            for number,e in enumerate(page,2):
                x,y,w=e['x'],e['y'],e['w'];h=e.get('h',len(wrap(e.get('text',''),w,e.get('size',18)))*e.get('size',18)*e.get('line',1.5)+8)
                transform=f'<a:xfrm><a:off x="{emu(x)}" y="{emu(y)}"/><a:ext cx="{emu(w)}" cy="{emu(h)}"/></a:xfrm>'
                if e['kind']=='image':
                    image_count+=1;ext=Path(e['file']).suffix[1:];target=f'image{image_count}.{ext}';rid=f'rId{len(relations)+1}';relations.append((rid,'image','../media/'+target));z.write(ROOT/e['file'],'ppt/media/'+target)
                    shapes.append(f'<p:pic><p:nvPicPr><p:cNvPr id="{number}" name="Image {number}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>{transform}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>');continue
                prefix=f'<p:sp><p:nvSpPr><p:cNvPr id="{number}" name="Shape {number}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>{transform}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
                if e['kind']=='rect':shapes.append(prefix+f'<a:solidFill><a:srgbClr val="{e["color"][1:]}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>');continue
                paras=[]
                for line in wrap(e['text'],w,e['size']):paras.append(f'<a:p><a:pPr><a:lnSpc><a:spcPts val="{round(e["size"]*e["line"]*100)}"/></a:lnSpc></a:pPr><a:r><a:rPr lang="zh-CN" sz="{round(e["size"]*100)}"><a:solidFill><a:srgbClr val="{e["color"][1:]}"/></a:solidFill><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/></a:rPr><a:t>{xml(line)}</a:t></a:r><a:endParaRPr lang="zh-CN" sz="{round(e["size"]*100)}"/></a:p>')
                shapes.append(prefix+'<a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="t"/><a:lstStyle/>'+''.join(paras)+'</p:txBody></p:sp>')
            z.writestr(f'ppt/slides/slide{i}.xml',f'<p:sld xmlns:p="{ns}" xmlns:a="{a}" xmlns:r="{r}"><p:cSld><p:spTree>{"".join(shapes)}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>');z.writestr(f'ppt/slides/_rels/slide{i}.xml.rels',relation(relations));overrides.append((f'/ppt/slides/slide{i}.xml','application/vnd.openxmlformats-officedocument.presentationml.slide+xml'))
        types='<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/>'+''.join(f'<Override PartName="{p}" ContentType="{t}"/>' for p,t in overrides)+'</Types>';z.writestr('[Content_Types].xml',types)

from pathlib import Path
import json, html, re
from document_engine import PDF,pptx,text,rect,image,wrap,ROOT,PAPER,INK,RED,MUTED

OUT=ROOT/'deliverables';OUT.mkdir(exist_ok=True)
data=json.loads((OUT/'report-source.json').read_text())
PUBLIC=ROOT/'app/public';ART=PUBLIC/'artworks';DEMO=PUBLIC/'demo'

def slide(title,number,kicker='把自己放进画里 / 艺术 × AI'):
    return [rect(0,0,960,540,PAPER),text(kicker,44,24,800,10,RED),text(title,44,60,870,28,INK,1.3),rect(44,112,872,1,'#dcd5c6'),text('朱昭荣 · 宋琪语   |   离线 MVP · AI 合成示例 · 未开展真人试用',44,510,800,9,MUTED),text(f'{number:02d} / 12',866,510,70,9,MUTED)]

slides=[]
p=slide('把自己放进画里',1)
p.extend([text('AI 辅助的名画仿拍',46,135,430,24,RED),text('用自己的身体和日常物品，\n重新发现画面的安排。',46,192,390,21,INK,1.8),text('上传照片 → 看见差异 → 再次尝试',46,307,390,14,MUTED),text('可运行的离线创作室\n22 项单元 / 36 项浏览器检查通过\n保留真实推理与导出证据',46,371,390,13,MUTED),image(DEMO/'desperate-after.png',505,135,411,335),text('AI 合成演示素材 · 非真人参与者',537,476,370,10,MUTED)])
slides.append(p)
p=slide('从“看过”到“亲手观察”',2)
p.extend([text('我们的问题',44,147,350,15,RED),text('具体的图像反馈，能否帮助我们\n在再次拍摄时看得更仔细？',44,183,800,27,INK,1.6)])
for i,(title,body) in enumerate([('姿态','肩、肘、腕怎样形成方向？'),('构图','人物放在哪里，占多大？'),('配色','哪些色块让人物更突出？')]):
    x=44+i*300;p.extend([rect(x,322,272,132,'#ebe5d8'),text(title,x+20,342,230,20,RED),text(body,x+20,385,230,13,MUTED)])
slides.append(p)
p=slide('已有工具，让我们集中做观察体验',3)
rows=[('MediaPipe 官方示例','复用单张图姿态识别、Worker 与骨架绘制。Apache-2.0。'),('Color Thief','提取主色与色板比例，保留白色区域。MIT。'),('布拉格博物馆项目','参考名画模仿体验；未复制无明确许可的代码。'),('我们补充的部分','观察卡、参考点、比较规则、重拍记录与解释。')]
for i,(title,body)in enumerate(rows):
    y=143+i*77;p.extend([text(f'0{i+1}',44,y,48,18,RED),text(title,105,y,280,18),text(body,390,y+2,500,13,MUTED),rect(105,y+57,785,1,'#dfd7c9')])
slides.append(p)
p=slide('三幅画，三种观看方式',4)
for i,(name,file,caption)in enumerate([('打哈欠的自画像','yawning.jpg','不对称伸展与身体倾斜'),('绝望的人','desperate.jpg','双臂的折线与紧凑取景'),('吹笛少年','fifer.jpg','完整人物与主要色块')]):
    x=44+i*300;p.extend([rect(x,138,272,260,'#e8e0d1'),image(ART/file,x,138,272,260),text(name,x,414,272,18),text(caption,x,451,272,12,MUTED)])
slides.append(p)
p=slide('拍一次，再带着新的观察拍一次',5)
steps=[('01 选一幅画','阅读观察卡和道具提示'),('02 上传照片','保留最初的尝试'),('03 看差异','关键点、构图与配色'),('04 再拍一次','一次只调整一两件事'),('05 写下想法','也记录有意保留的不同'),('06 保存对比','本机记录、PNG 与 JSON')]
for i,(title,body)in enumerate(steps):
    x=44+(i%3)*300;y=150+(i//3)*160;p.extend([rect(x,y,272,130,'#ebe5d8'),text(title,x+20,y+19,235,19,RED),text(body,x+20,y+67,235,13,MUTED)])
slides.append(p)
p=slide('AI 找位置，规则解释差异',6)
p.extend([text('照片',55,158,145,22),text('MediaPipe\n本地 Worker',265,158,235,22,RED),text('肩、肘、腕\n及置信度',610,158,260,22),text('→',195,175,60,25,MUTED),text('→',525,175,60,25,MUTED),rect(44,268,872,1,'#dcd5c6'),text('原画：人工近似标点',54,306,365,20),text('姿态比较  /  构图比较  /  配色观察',54,353,800,20,RED),text('失败时说明无法判断；不填入模拟关键点或分数。\n固定模型与 WASM 随包提供；照片仅在本机处理。',54,410,830,13,MUTED,1.7)])
slides.append(p)
p=slide('把姿态与人物远近分开比较',7)
p.extend([text('姿态',44,147,400,21,RED),text('保持图像宽高比例\n以肩部中心对齐\n以肩宽消除等比例远近变化\n保留身体倾斜与手臂方向',44,195,395,18,INK,1.9),rect(469,146,1,302,'#d5cbbc'),text('构图',513,147,400,21,RED),text('比较肩部中心在画幅中的位置\n比较肩宽占画幅的比例\n明确这只是人物大小的近似\n颜色展示差异，不评艺术好坏',513,195,395,18,INK,1.9),text('数值越小只表示几何关系更近，不等于作品更好。',44,464,850,13,MUTED)])
slides.append(p)
p=slide('实测案例：双臂如何围住头部？',8)
for i,(file,label)in enumerate([('desperate-before.png','第一次：肘部下垂 / 误差 0.89 肩宽'),('desperate-after.png','第二次：双肘展开 / 误差 0.29 肩宽')]):
    x=44+i*445;p.extend([image(DEMO/file,x,139,425,310),text(label,x,460,425,16)])
p.append(text('AI 合成照片，经真实模型识别；只比较共同可见的肘腕。这不是学习效果数据。',44,488,865,10,MUTED));slides.append(p)
p=slide('演示案例：人物在画面中的大小',9)
for i,(file,label)in enumerate([('fifer-before.png','第一次：人物较小、偏右'),('fifer-after.png','第二次：人物更大、接近中心')]):
    x=44+i*445;p.extend([image(DEMO/file,x,139,425,310),text(label,x,460,425,16)])
p.append(text('AI 合成演示：姿态误差 0.70 → 0.68 肩宽，判为接近。取景变化与姿态变化分别解释。',44,488,865,10,MUTED));slides.append(p)
p=slide('功能验证通过，结论保留边界',10)
p.extend([text('实际通过',44,147,410,20,RED),text('22 项单元测试 + 静态类型检查\n36 项真实浏览器检查\n三幅画 / 六张照片完成推理\n保存、恢复、删除、镜像与导出',44,194,405,17,INK,1.9),text('空缓存 / 阻断外网',514,147,395,20,RED),text('全部运行资源从本机加载\n0 个外部域名请求\n无照片上传请求\n多人、损坏图、模型缺失有提示',514,194,395,17,INK,1.9),rect(44,414,872,55,'#ebdfcf'),text('本次六图 detect 调用约 40—259 ms；不含模型加载，不推广为所有设备的性能。',60,431,840,12,MUTED)])
slides.append(p)
p=slide('学习效果，需要真实体验来回答',11)
p.extend([text('后续可邀请 3—5 位同学',44,149,825,24,RED),text('每人一幅画、两次照片、一句新发现。',44,197,825,19),text('记录采纳的建议，也记录没有帮助的建议。\n询问理解程度、调整过程与新注意到的画面关系。\n保留识别失败和没有改善的案例。\n小规模体验用于发现问题，不推广为普遍教学效果。',44,261,845,18,INK,1.8),text('当前没有进行真人试用，AI 合成示例不能替代真实体验数据。',44,459,850,13,MUTED)])
slides.append(p)
p=slide('让每条反馈，都能回到画面里',12)
p.extend([text('已经留下',44,149,380,19,RED),text('网页源码与构建版本\n参考点、观察卡和演示素材\n测试记录、报告与可编辑 PPT\n完整离线包、真实录屏与试用表',44,195,400,18,INK,1.9),text('下一步研究',520,149,380,19,RED),text('邀请真人完成两次拍摄\n记录建议的理解与采用\n改进遮挡与透视情况下的反馈\n检验是否促进了具体观察',520,195,380,18,INK,1.9),text('相似程度是观察线索。你自己的选择，也属于这幅作品。',44,450,870,18,RED)])
slides.append(p)

(OUT/'slides-source.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2)+'\n')
PDF().write(slides,OUT/'答辩演示_最终版.pdf',960,540)
pptx(slides,OUT/'答辩演示_最终版.pptx')

# Report pagination: text uses real embedded Unicode glyphs; selectable/searchable.
pages=[];page=[];y=0
def new_report_page():
    global page,y
    if page:pages.append(page)
    n=len(pages)+1;page=[rect(0,0,595.28,841.89,'#fffdf8'),text('把自己放进画里  /  项目报告 · 离线 MVP',48,27,490,9,RED),rect(48,49,499,1,'#ded7c8'),text(f'朱昭荣 · 宋琪语    |    {n}',48,805,499,9,MUTED)];y=70
new_report_page()
page.extend([text(data['title'],48,y,499,22,INK,1.5)]);y+=105
page.append(text(data['authors']+'  ·  2026 年 11 月',48,y,499,11,MUTED));y+=33
for line in wrap(data['status'],475,10.5):page.append(text(line,60,y,475,10.5,RED));y+=17
y+=25
for section in data['sections']:
    if y+88>775:new_report_page()
    page.append(text(section['title'],48,y,499,15,RED));y+=35
    for para in section['text'].split('\n'):
        for line in wrap(para,499,11.5):
            if y+20>775:new_report_page()
            page.append(text(line,48,y,499,11.5,INK));y+=19
        y+=10
    y+=10
if y+110>775:new_report_page()
page.append(text('参考资料与复现信息',48,y,499,15,RED));y+=32
for ref in data['references']:
    for line in wrap(ref,499,9):
        if y+18>775:new_report_page()
        page.append(text(line,48,y,499,9,MUTED));y+=15
    y+=8
pages.append(page)
PDF().write(pages,OUT/'项目报告_最终版.pdf',595.28,841.89)
body=''.join('<section><h2>'+html.escape(s['title'])+'</h2>'+''.join('<p>'+html.escape(p)+'</p>' for p in s['text'].split('\n'))+'</section>' for s in data['sections'])
report_html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>'+data['title']+'</title><style>body{max-width:800px;margin:55px auto;padding:0 24px;color:#282e29;background:#fffdf8;font:16px/1.9 "Microsoft YaHei",sans-serif}h1{font-size:29px;line-height:1.5}h2{font-size:21px;color:#a34c38;margin-top:32px}p{margin:12px 0}.status{border-left:3px solid #a34c38;padding:15px;background:#f6efe4}.refs{font-size:12px;overflow-wrap:anywhere}@media print{body{margin:0}h2{break-after:avoid}p{orphans:3;widows:3}}</style><h1>'+html.escape(data['title'])+'</h1><p>'+data['authors']+'</p><p class="status">'+html.escape(data['status'])+'</p>'+body+'<h2>参考资料</h2><div class="refs">'+''.join('<p>'+html.escape(r)+'</p>' for r in data['references'])+'</div></html>'
(OUT/'项目报告_可编辑源稿.html').write_text(report_html)

form=[rect(0,0,595.28,841.89,'#fffdf8'),text('名画仿拍体验记录表',45,40,505,23,RED),text('用于后续真人试用；当前尚未填写参与者数据。',45,82,505,11,MUTED)]
fields=[('基本信息','匿名编号：____________  日期：____________\n选择画作：____________  记录者：____________'),('第一次观察','拍摄前，你首先注意到原画中的什么？\n__________________________________________________'),('查看反馈','哪条建议容易理解？哪条不清楚或不准确？\n__________________________________________________'),('第二次尝试','你采用了哪条建议？有意保留了哪些不同？\n__________________________________________________'),('拍摄之后','请说出一个新注意到的姿态、构图或配色关系。\n__________________________________________________'),('简短评价','建议易懂程度：1  2  3  4  5    建议有帮助程度：1  2  3  4  5\n识别失败或没有改善的情况：________________________'),('素材记录','第一次照片文件名：__________ 第二次照片文件名：__________\n是否同意匿名用于课程展示：是 / 否（不同意不影响体验）')]
for i,(heading,body)in enumerate(fields):
    y=130+i*88;form.extend([text(heading,45,y,505,13,RED),text(body,45,y+27,505,10,INK,1.9)])
PDF().write([form],OUT/'后续真人试用记录表.pdf',595.28,841.89)
(OUT/'后续真人试用记录表.txt').write_text('\n\n'.join(h+'\n'+b for h,b in fields)+'\n')
print(f'Generated 12 slides; report {len(pages)} pages; editable PPTX/HTML + PDFs.')

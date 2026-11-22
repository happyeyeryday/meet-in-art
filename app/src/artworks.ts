import type { Artwork } from './types.ts';

/* 按时期组织的人物画：每个时期 3–5 幅，地点 id 与 countries.ts 对应 */
const blank = { reference: {}, frame: { width: 1, height: 1 }, annotated: false };

export const artworks: Artwork[] = [
  /* ---------- 01 远古与古典 ---------- */
  {
    id: 'fayum', title: '法尤姆木乃伊肖像', englishTitle: 'Fayum Mummy Portrait',
    artist: '佚名', year: '约 1–3 世纪', country: 'egypt-e1', level: 1, people: '1 人',
    image: '/artworks/fayum.jpg', museum: '多馆藏',
    source: 'https://en.wikipedia.org/wiki/Fayum_mummy_portraits',
    imageSource: 'https://en.wikipedia.org/wiki/Fayum_mummy_portraits', license: '原作公版；数字图来源见链接。',
    focus: '一双直视的眼睛，如何让逝者留在人间',
    observation: '木板上的一张脸，眼睛睁得很大，像是从两千年前看过来。',
    observations: ['正面构图，头部占据画面绝大部分。', '眼睛被刻意放大，是整张脸的焦点。', '金色与深色形成强烈对比，像圣像也像活人。'],
    props: ['深色头巾', '亚麻布', '金色背景板'], ...blank
  },
  {
    id: 'pompeii', title: '庞贝壁画人物', englishTitle: 'Pompeii Fresco Figure',
    artist: '佚名', year: '约 1 世纪', country: 'rome-e1', level: 2, people: '1–2 人',
    image: '/artworks/pompeii.jpg', museum: '庞贝古城',
    source: 'https://en.wikipedia.org/wiki/Pompeii',
    imageSource: 'https://en.wikipedia.org/wiki/Pompeii', license: '原作公版；数字图来源见链接。',
    focus: '侧身与手势，如何讲一个神话瞬间',
    observation: '墙面上的一个人物，身体转向一侧，手势停在半空。',
    observations: ['人物多取侧面或四分之三侧，动作明确。', '背景是平涂的色块，人物像被剪下来贴在墙上。', '衣褶用线勾勒，颜色朴素。'],
    props: ['单色披布', '陶罐', '素色背景墙'], ...blank
  },
  {
    id: 'terracotta', title: '秦始皇兵马俑', englishTitle: 'Terracotta Army',
    artist: '佚名', year: '秦代', country: 'china-e1', level: 1, people: '1 人',
    image: '/artworks/terracotta.jpg', museum: '秦始皇陵博物院',
    source: 'https://en.wikipedia.org/wiki/Terracotta_Army',
    imageSource: 'https://en.wikipedia.org/wiki/Terracotta_Army', license: '原作公版；数字图来源见链接。',
    focus: '站姿与铠甲，如何撑起一个人的威严',
    observation: '一个陶土士兵正面站着，发髻、铠甲和手势都被仔细区分。',
    observations: ['站姿笔直，重心平均落在两脚之间。', '铠甲与发髻是身份线索。', '面部各不相同，但都朝同一个方向。'],
    props: ['深色外套', '发髻或帽子', '长棍'], ...blank
  },

  /* ---------- 02 中古 ---------- */
  {
    id: 'theodora', title: '狄奥多拉皇后马赛克', englishTitle: 'Empress Theodora',
    artist: '佚名', year: '约 547', country: 'byzantium-e2', level: 2, people: '1–3 人',
    image: '/artworks/theodora.jpg', museum: '拉文纳圣维塔莱教堂',
    source: 'https://en.wikipedia.org/wiki/Basilica_of_San_Vitale',
    imageSource: 'https://en.wikipedia.org/wiki/Basilica_of_San_Vitale', license: '原作公版；数字图来源见链接。',
    focus: '正面与金色，如何把权力变成神圣',
    observation: '皇后正面站立，金色背景把人和现实隔开。',
    observations: ['人物正面站立，视线不与人交流。', '金色背景营造非现实空间。', '服饰与随从的大小体现等级。'],
    props: ['金色背景布', '深紫披风', '头冠'], ...blank
  },
  {
    id: 'emperors', title: '历代帝王图', englishTitle: 'Thirteen Emperors Scroll',
    artist: '阎立本（传）', year: '唐', country: 'china-e2', level: 3, people: '3–6 人',
    image: '/artworks/emperors.jpg', museum: '波士顿美术馆',
    source: 'https://www.mfa.org/',
    imageSource: 'https://en.wikipedia.org/wiki/Thirteen_Emperors_Scroll', license: '原作公版；数字图来源见链接。',
    focus: '端坐与笏板，如何排出一列等级',
    observation: '一排帝王端坐，宽袖垂落，每人手里都有一块笏板。',
    observations: ['人物横向排列，座次即等级。', '宽袖与冠冕用线描出层次。', '面部刻画克制，靠服饰区分身份。'],
    props: ['宽袖长袍', '笏板', '深色座椅'], ...blank
  },
  {
    id: 'shunoku', title: '春屋妙葩像', englishTitle: "Portrait of Shun'oku Myōha",
    artist: '佚名', year: '14 世纪', country: 'japan-e2', level: 1, people: '1 人',
    image: '/artworks/shunoku.jpg', museum: '京都妙智院',
    source: 'https://en.wikipedia.org/wiki/Shun%27oku_My%C5%8Dha',
    imageSource: 'https://en.wikipedia.org/wiki/Shun%27oku_My%C5%8Dha', license: '原作公版；数字图来源见链接。',
    focus: '正面端坐，如何画出精神气质',
    observation: '僧人正面端坐，手持法器，衣纹像水一样垂下。',
    observations: ['正面端坐，身体几乎对称。', '僧服与法器交代身份。', '面部表情安静，强调内在。'],
    props: ['深色僧袍', '法器或经卷', '素色背景'], ...blank
  },

  /* ---------- 03 文艺复兴 ---------- */
  {
    id: 'monalisa', title: '蒙娜丽莎', englishTitle: 'Mona Lisa',
    artist: '列奥纳多·达·芬奇', year: '1503–1519', country: 'italy-e3', level: 2, people: '1 人',
    image: '/artworks/monalisa.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/en/explore/the-palace/mona-lisa',
    imageSource: 'https://en.wikipedia.org/wiki/Mona_Lisa', license: '原作公版；数字图来源见链接。',
    focus: '没有硬边的轮廓，如何让表情变得含混',
    observation: '一个微笑，让五百年来的观众不断回头。',
    observations: ['轮廓没有硬边，像被雾化开。', '双手是全身最亮的部分之一。', '背景左右的地平线高度并不一致。'],
    props: ['深色上衣', '薄纱', '椅子'], ...blank
  },
  {
    id: 'redturban', title: '戴红头巾的男子', englishTitle: 'Man in a Red Turban',
    artist: '扬·凡·艾克', year: '1433', country: 'flanders-e3', level: 1, people: '1 人',
    image: '/artworks/redturban.jpg', museum: '英国国家美术馆',
    source: 'https://www.nationalgallery.org.uk/paintings/jan-van-eyck-portrait-of-a-man-self-portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_a_Man_(Self-Portrait%3F)', license: '原作公版；数字图来源见链接。',
    focus: '直视与红头巾，如何让一张脸成立',
    observation: '近距离的一张脸，红头巾把视线全部推到眼睛上。',
    observations: ['正面近距离，几乎没有背景。', '红头巾是画面唯一的强色。', '皮肤与布料的质感被画到极致。'],
    props: ['红色头巾', '深色外套', '深色背景'], ...blank
  },
  {
    id: 'durer', title: '穿着毛边长袍的自画像', englishTitle: 'Self-Portrait in a Fur-Collared Robe',
    artist: '阿尔布雷希特·丢勒', year: '1500', country: 'germany-e3', level: 1, people: '1 人',
    image: '/artworks/durer.jpg', museum: '慕尼黑老绘画陈列馆',
    source: 'https://www.sammlung.pinakothek.de/',
    imageSource: 'https://en.wikipedia.org/wiki/Self-Portrait_(D%C3%BCrer,_1500)', license: '原作公版；数字图来源见链接。',
    focus: '正面与毛边，如何把自己画成圣像',
    observation: '画家把自己画成正面的、近乎对称的一张圣像。',
    observations: ['构图近乎对称，像宗教画。', '毛边长袍的质感是重点。', '长发与手势让画面安静下来。'],
    props: ['深色长袍', '毛边领', '长发'], ...blank
  },

  /* ---------- 04 巴洛克与古典主义 ---------- */
  {
    id: 'innocent', title: '教皇英诺森十世肖像', englishTitle: 'Portrait of Innocent X',
    artist: '委拉斯开兹', year: '1650', country: 'spain-e4', level: 2, people: '1 人',
    image: '/artworks/innocent.jpg', museum: '罗马多利亚·潘菲利美术馆',
    source: 'https://en.wikipedia.org/wiki/Portrait_of_Innocent_X',
    imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_Innocent_X', license: '原作公版；数字图来源见链接。',
    focus: '红色与侧目，如何画出权力和警觉',
    observation: '红衣教皇坐在椅中，眼睛从画面里斜看过来。',
    observations: ['身体侧转，头部回望，形成张力。', '红色衣袍被集中照明。', '背景深暗，人物像浮出来。'],
    props: ['红色披肩', '座椅', '深色背景'], ...blank
  },
  {
    id: 'blueboy', title: '蓝衣少年', englishTitle: 'The Blue Boy',
    artist: '托马斯·庚斯博罗', year: '约 1770', country: 'england-e4', level: 2, people: '1 人',
    image: '/artworks/blueboy.jpg', museum: '亨廷顿图书馆',
    source: 'https://www.huntington.org/',
    imageSource: 'https://en.wikipedia.org/wiki/The_Blue_Boy', license: '原作公版；数字图来源见链接。',
    focus: '一身蓝，如何站出贵族的气度',
    observation: '少年全身站立，一手叉腰，蓝色丝绸从画面里发光。',
    observations: ['全身像，姿态舒展。', '蓝色服装占据视觉中心。', '背景风景压低，衬托人物。'],
    props: ['蓝色外套', '帽子', '浅色背景'], ...blank
  },
  {
    id: 'pompadour', title: '蓬巴杜夫人肖像', englishTitle: 'Madame de Pompadour',
    artist: '弗朗索瓦·布歇', year: '1756', country: 'france-e4', level: 2, people: '1 人',
    image: '/artworks/pompadour.jpg', museum: '慕尼黑老绘画陈列馆',
    source: 'https://www.sammlung.pinakothek.de/',
    imageSource: 'https://en.wikipedia.org/wiki/Madame_de_Pompadour', license: '原作公版；数字图来源见链接。',
    focus: '柔光与装饰，如何把肖像变成品味',
    observation: '夫人坐在室内，礼服、书籍和花卉一起构成她的品味。',
    observations: ['柔和光线让丝绸发光。', '书籍与花卉是身份的注脚。', '姿态放松，身体微微侧转。'],
    props: ['浅色礼服', '书籍', '花卉'], ...blank
  },
  {
    id: 'xiaozhuang', title: '孝庄文皇后像', englishTitle: 'Portrait of Empress Dowager Xiaozhuang',
    artist: '佚名', year: '清', country: 'china-e4', level: 1, people: '1 人',
    image: '/artworks/xiaozhuang.jpg', museum: '故宫博物院',
    source: 'https://www.dpm.org.cn/',
    imageSource: 'https://en.wikipedia.org/wiki/Empress_Dowager_Xiaozhuang', license: '原作公版；数字图来源见链接。',
    focus: '正面端坐，如何用服饰写出礼制',
    observation: '皇后正面端坐，头饰与礼服把身份一层层堆起来。',
    observations: ['构图对称，人物居中。', '头饰与珠宝是等级线索。', '背景简洁，突出人物。'],
    props: ['宫廷礼服', '头饰', '深色背景'], ...blank
  },
  {
    id: 'mughal', title: '莫卧儿宫廷人物肖像', englishTitle: 'Mughal Court Portrait',
    artist: '佚名', year: '约 17 世纪', country: 'india-e4', level: 1, people: '1 人',
    image: '/artworks/mughal.jpg', museum: '多馆藏',
    source: 'https://en.wikipedia.org/wiki/Mughal_painting',
    imageSource: 'https://en.wikipedia.org/wiki/Mughal_painting', license: '原作公版；数字图来源见链接。',
    focus: '侧面轮廓与花枝，如何摆出宫廷的等级',
    observation: '人物侧身站立，手持花朵，背景是细致的花园。',
    observations: ['侧面或四分之三侧，轮廓清晰。', '珠宝与头巾显示身份。', '背景纹样填满画面。'],
    props: ['长袍', '头巾', '一朵花'], ...blank
  },

  /* ---------- 05 近代 ---------- */
  {
    id: 'desperate', title: '绝望的人', englishTitle: 'The Desperate Man',
    artist: '居斯塔夫·库尔贝', year: '约 1843—1845', country: 'france-e5', level: 2, people: '1 人',
    image: '/artworks/desperate.jpg', museum: '奥赛博物馆',
    source: 'https://www.musee-orsay.fr/fr/oeuvres/autoportrait-de-lartiste-dit-aussi-desespoir-ou-encore-le-desespere-272956',
    imageSource: 'https://commons.wikimedia.org/wiki/Category:Le_Désespéré_(Courbet)', license: '原作公版；数字图为原作复制，取得路径见来源清单。',
    focus: '用双臂围住一个紧张的表情',
    observation: '试着用手臂在头部周围形成折线，观察肘部离脸多远。画面边缘与手臂之间的距离，同样影响紧张感。',
    observations: ['双手靠近头发，手肘向两边展开。', '人物上半身占据大部分画面，留白很少。', '浅色衣袖与深色背景对比，让手臂的轮廓更明显。'],
    props: ['浅色宽松衬衫', '深色背景', '一侧的窗光'],
    frame: { width: 1500, height: 1228 },
    reference: { 11: { x: .72, y: .69 }, 12: { x: .28, y: .67 }, 13: { x: .92, y: .45 }, 14: { x: .04, y: .52 }, 15: { x: .565, y: .135 }, 16: { x: .18, y: .355 } },
    demo: ['/demo/desperate-before.png', '/demo/desperate-after.png'], annotated: true
  },
  {
    id: 'parasol', title: '撑阳伞的女人', englishTitle: 'Woman with a Parasol',
    artist: '克劳德·莫奈', year: '1875', country: 'france-e5', level: 2, people: '1–2 人',
    image: '/artworks/parasol.jpg', museum: '华盛顿国家美术馆',
    source: 'https://www.nga.gov/',
    imageSource: 'https://en.wikipedia.org/wiki/Woman_with_a_Parasol', license: '原作公版；数字图来源见链接。',
    focus: '回头的瞬间，如何被光留住',
    observation: '女子撑伞站在草地上，回头的一瞬被风与光同时抓住。',
    observations: ['人物身体侧转，头部回望。', '衣裙和面纱在风里飘动。', '天空与草地用松动的笔触铺开。'],
    props: ['阳伞', '浅色长裙', '草地背景'], ...blank
  },
  {
    id: 'gaoyong', title: '高邕小像', englishTitle: 'Portrait of Gao Yong',
    artist: '任伯年', year: '1887', country: 'china-e5', level: 1, people: '1 人',
    image: '/artworks/gaoyong.jpg', museum: '浙江省博物馆',
    source: 'https://www.zhejiangmuseum.com/',
    imageSource: 'https://en.wikipedia.org/wiki/Ren_Bonian', license: '原作公版；数字图来源见链接。',
    focus: '侧影与竹杖，如何用留白写人',
    observation: '人物侧身拄杖，背景大片留白，只留下轮廓。',
    observations: ['侧面轮廓，身体微微倚靠。', '衣着朴素，面部刻画细致。', '背景留白，靠线条撑住画面。'],
    props: ['长衫', '竹杖', '留白背景'], ...blank
  },

  /* ---------- 06 现代与当代 ---------- */
  {
    id: 'soldier', title: '士兵自画像', englishTitle: 'Self-Portrait as a Soldier',
    artist: '恩斯特·路德维希·基尔希纳', year: '1915', country: 'germany-e6', level: 2, people: '1 人',
    image: '/artworks/soldier.jpg', museum: '欧柏林艾伦纪念美术馆',
    source: 'https://allenartcollection.oberlin.edu/',
    imageSource: 'https://en.wikipedia.org/wiki/Ernst_Ludwig_Kirchner', license: '原作公版；数字图来源见链接。',
    focus: '变形的身体，如何画出战争的焦虑',
    observation: '军装里的身体僵硬，脸和手被画得尖锐而变形。',
    observations: ['姿态僵硬，像被制服固定。', '色彩刺目，形体不协调。', '空荡的手臂暗示失去。'],
    props: ['军装', '深色背景', '短棍'], ...blank
  },
  {
    id: 'jeanne', title: '珍妮·赫布特尼肖像', englishTitle: 'Portrait of Jeanne Hébuterne',
    artist: '阿梅代奥·莫迪利亚尼', year: '约 1918', country: 'france-e6', level: 2, people: '1 人',
    image: '/artworks/jeanne.jpg', museum: '多馆藏',
    source: 'https://en.wikipedia.org/wiki/Jeanne_H%C3%A9buterne',
    imageSource: 'https://en.wikipedia.org/wiki/Jeanne_H%C3%A9buterne', license: '原作公版；数字图来源见链接。',
    focus: '拉长的脖颈，如何把肖像变成气质',
    observation: '脖颈被拉长，五官简化，整个人安静得近乎忧郁。',
    observations: ['脖颈与脸被拉长，比例被有意改变。', '五官简化成几条线。', '色彩柔和，背景几乎空。'],
    props: ['深色上衣', '素色背景', '耳环'], ...blank
  },
  {
    id: 'frida', title: '戴荆棘项链和蜂鸟的自画像', englishTitle: 'Self-Portrait with Thorn Necklace and Hummingbird',
    artist: '弗里达·卡罗', year: '1940', country: 'mexico-e6', level: 2, people: '1 人',
    image: '/artworks/frida.jpg', museum: '哈里·兰塞姆中心',
    source: 'https://www.hrc.utexas.edu/',
    imageSource: 'https://en.wikipedia.org/wiki/Self-Portrait_with_Thorn_Necklace_and_Hummingbird', license: '原作公版；数字图来源见链接。',
    focus: '荆棘与蜂鸟，如何把经历戴在身上',
    observation: '正面半身，荆棘项链、猴子和黑猫把画面填满。',
    observations: ['正面直视，几乎没有背景空间。', '象征物围绕人物排列。', '绿色与深色形成强对比。'],
    props: ['深色上衣', '项链', '绿植背景'], ...blank
  },
  {
    id: 'father', title: '父亲', englishTitle: 'Father',
    artist: '罗中立', year: '1980', country: 'china-e6', level: 1, people: '1 人',
    image: '/artworks/father.jpg', museum: '中国美术馆',
    source: 'https://www.namoc.org/',
    imageSource: 'https://en.wikipedia.org/wiki/Luo_Zhongli', license: '原作版权归艺术家；仅作课程学习使用。',
    focus: '一张放大的脸，如何让普通人成为纪念碑',
    observation: '一张老农民的脸被放大到几乎占满画面，手里端着一只茶碗。',
    observations: ['面部特写，毛孔与皱纹都被画出来。', '茶碗是唯一的道具。', '背景是土地的颜色。'],
    props: ['白色头巾', '茶碗', '深色背景'], ...blank
  },
  {
    id: 'vase', title: '陶瓶人物画', englishTitle: 'Greek Vase Painting',
    artist: '佚名', year: '约公元前 6 世纪', country: 'egypt-e1', level: 2, people: '1–2 人',
    image: '/artworks/vase.jpg', museum: '多馆藏',
    source: 'https://en.wikipedia.org/wiki/Ancient_Greek_pottery',
    imageSource: 'https://en.wikipedia.org/wiki/Ancient_Greek_pottery', license: '原作公版；数字图来源见链接。',
    focus: '黑绘与红绘，如何用剪影讲神话',
    observation: '陶瓶上的人物是纯色剪影，动作被压成最清楚的轮廓。',
    observations: ['人物取侧面，动作夸张明确。', '黑绘与红绘靠底色反转。', '瓶身弧面把构图拉长。'],
    props: ['深色披布', '陶罐', '素色背景'], ...blank
  },
  {
    id: 'christ', title: '西奈山基督圣像', englishTitle: 'Christ Pantocrator of Sinai',
    artist: '佚名', year: '6 世纪', country: 'byzantium-e2', level: 1, people: '1 人',
    image: '/artworks/christ.jpg', museum: '圣凯瑟琳修道院',
    source: 'https://en.wikipedia.org/wiki/Christ_Pantocrator_(Sinai)',
    imageSource: 'https://en.wikipedia.org/wiki/Christ_Pantocrator_(Sinai)', license: '原作公版；数字图来源见链接。',
    focus: '正面与不对称的眼神，如何画出神性',
    observation: '一张正面的脸，两只眼睛却像在看不同的方向。',
    observations: ['正面构图，头部几乎占满画面。', '金色背景压平空间。', '面部不对称，制造威严感。'],
    props: ['深色长袍', '金色背景板', '经书'], ...blank
  },
  {
    id: 'kubilai', title: '忽必烈皇后察必像', englishTitle: 'Portrait of Empress Chabi',
    artist: '佚名', year: '元', country: 'china-e2', level: 1, people: '1 人',
    image: '/artworks/kubilai.jpg', museum: '故宫博物院',
    source: 'https://www.dpm.org.cn/',
    imageSource: 'https://en.wikipedia.org/wiki/Chabi', license: '原作公版；数字图来源见链接。',
    focus: '头饰与珠宝，如何标出草原皇后的身份',
    observation: '皇后正面端坐，高高的头饰把身份直接写在头上。',
    observations: ['正面端坐，构图对称。', '头饰与珠宝是身份核心。', '服饰纹样细密。'],
    props: ['高头饰', '深色礼服', '素色背景'], ...blank
  },
  {
    id: 'ife', title: '伊费铜合金头像', englishTitle: 'Ife Head',
    artist: '佚名', year: '12–15 世纪', country: 'westafrica-e2', level: 1, people: '1 人',
    image: '/artworks/ife.jpg', museum: '大英博物馆等',
    source: 'https://en.wikipedia.org/wiki/Ife_head',
    imageSource: 'https://en.wikipedia.org/wiki/Ife_head', license: '原作公版；数字图来源见链接。',
    focus: '比例与光泽，如何让一张脸安静下来',
    observation: '一张金属的脸，五官比例克制，表面有柔和的光。',
    observations: ['正面头像，五官比例协调。', '金属光泽代替了肤色。', '表情平静，几乎不带情绪。'],
    props: ['深色披布', '素色背景', '金属头饰'], ...blank
  },
  {
    id: 'maya', title: '亚什奇兰 26 号门楣', englishTitle: 'Yaxchilan Lintel 26',
    artist: '佚名', year: '约 8 世纪', country: 'maya-e2', level: 2, people: '1 人',
    image: '/artworks/maya.jpg', museum: '墨西哥国家人类学博物馆',
    source: 'https://en.wikipedia.org/wiki/Yaxchilan',
    imageSource: 'https://en.wikipedia.org/wiki/Yaxchilan', license: '原作公版；数字图来源见链接。',
    focus: '侧脸与头饰，如何把人物嵌进仪式',
    observation: '侧面的人物被复杂的头饰和铭文包围，像一场仪式的一帧。',
    observations: ['人物取侧面，轮廓清晰。', '头饰与服装极其复杂。', '人物与文字、神灵并置。'],
    props: ['羽毛头饰', '深色披布', '石质背景'], ...blank
  },
  {
    id: 'urbino', title: '乌尔比诺公爵夫妇肖像', englishTitle: 'Diptych of the Duke and Duchess of Urbino',
    artist: '皮耶罗·德拉·弗朗切斯卡', year: '约 1473–1475', country: 'italy-e3', level: 2, people: '2 人',
    image: '/artworks/urbino.jpg', museum: '乌菲齐美术馆',
    source: 'https://www.uffizi.it/en/artworks',
    imageSource: 'https://en.wikipedia.org/wiki/Diptych_of_Urbino', license: '原作公版；数字图来源见链接。',
    focus: '两幅侧脸，如何面对面对话',
    observation: '公爵与夫人分列两幅画，侧脸相对，背景是同一片山水。',
    observations: ['双人侧面，视线相对。', '背景山水连续，构图对称。', '服饰与首饰强调贵族身份。'],
    props: ['深色礼服', '头饰', '山水背景板'], ...blank
  },
  {
    id: 'castiglione', title: '巴尔达萨雷·卡斯蒂廖内肖像', englishTitle: 'Portrait of Baldassare Castiglione',
    artist: '拉斐尔', year: '约 1514–1515', country: 'italy-e3', level: 1, people: '1 人',
    image: '/artworks/castiglione.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/',
    imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_Baldassare_Castiglione', license: '原作公版；数字图来源见链接。',
    focus: '半身与交叠的双手，如何画出克制',
    observation: '人物微微侧身，双手交叠，深色衣服把脸衬得更安静。',
    observations: ['半身构图，身体略侧。', '双手交叠，动作克制。', '深色服装与浅色背景对比。'],
    props: ['深色上衣', '帽子', '浅色背景'], ...blank
  },
  {
    id: 'arnolfini', title: '阿尔诺芬尼夫妇像', englishTitle: 'The Arnolfini Portrait',
    artist: '扬·凡·艾克', year: '1434', country: 'flanders-e3', level: 3, people: '2 人',
    image: '/artworks/arnolfini.jpg', museum: '英国国家美术馆',
    source: 'https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Arnolfini_Portrait', license: '原作公版；数字图来源见链接。',
    focus: '并肩站立与手势，如何把婚礼变成证词',
    observation: '夫妻并肩站在室内，一只手举起，镜子里映出见证者。',
    observations: ['双人全身，并肩站立。', '手势是画面的核心动作。', '镜子、吊灯等物件都有含义。'],
    props: ['深色长袍', '头巾', '室内背景'], ...blank
  },
  {
    id: 'durer2', title: '自画像', englishTitle: 'Self-Portrait (1498)',
    artist: '阿尔布雷希特·丢勒', year: '1498', country: 'germany-e3', level: 1, people: '1 人',
    image: '/artworks/durer2.jpg', museum: '普拉多博物馆',
    source: 'https://www.museodelprado.es/',
    imageSource: 'https://en.wikipedia.org/wiki/Self-Portrait_(D%C3%BCrer,_1498)', license: '原作公版；数字图来源见链接。',
    focus: '窗边的侧身，如何把画家放进风景',
    observation: '画家坐在窗边，手扶栏杆，窗外是一片阿尔卑斯山。',
    observations: ['三分之四侧身，身体朝向窗外。', '窗户与远景交代空间。', '服饰与手套显示身份。'],
    props: ['浅色外套', '手套', '窗景背景'], ...blank
  },
  {
    id: 'meninas', title: '宫娥', englishTitle: 'Las Meninas',
    artist: '委拉斯开兹', year: '1656', country: 'spain-e4', level: 3, people: '3–6 人',
    image: '/artworks/meninas.jpg', museum: '普拉多博物馆',
    source: 'https://www.museodelprado.es/',
    imageSource: 'https://en.wikipedia.org/wiki/Las_Meninas', license: '原作公版；数字图来源见链接。',
    focus: '镜面与视线，如何把观看者拉进画里',
    observation: '小公主站在中间，画家在左侧，镜子里的国王夫妇看着我们。',
    observations: ['多人分层站立，视线交错。', '镜子把画外的人拉进画面。', '光线从右侧照进来。'],
    props: ['浅色长裙', '画架', '深色背景'], ...blank
  },
  {
    id: 'nightwatch', title: '夜巡', englishTitle: 'The Night Watch',
    artist: '伦勃朗', year: '1642', country: 'netherlands-e4', level: 3, people: '4–8 人',
    image: '/artworks/nightwatch.jpg', museum: '荷兰国立博物馆',
    source: 'https://www.rijksmuseum.nl/en/collection/SK-C-5',
    imageSource: 'https://en.wikipedia.org/wiki/The_Night_Watch', license: '原作公版；数字图来源见链接。',
    focus: '一束光，如何把群像变成舞台',
    observation: '民兵队走出门廊的一瞬，被伦勃朗拍成了一出戏。',
    observations: ['光集中在队长、副官和小女孩身上。', '人物层层叠叠，制造纵深。', '暗部仍能看清布料质地。'],
    props: ['深色外套', '旗杆', '长棍'], ...blank
  },
  {
    id: 'charles1', title: '查理一世狩猎像', englishTitle: 'Charles I at the Hunt',
    artist: '安东尼·凡·戴克', year: '约 1635', country: 'england-e4', level: 2, people: '1 人',
    image: '/artworks/charles1.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/',
    imageSource: 'https://en.wikipedia.org/wiki/Charles_I_at_the_Hunt', license: '原作公版；数字图来源见链接。',
    focus: '树与马，如何撑起国王的从容',
    observation: '国王侧身站在树下，马和侍从在旁，风景替他撑住气度。',
    observations: ['全身像，身体自然侧立。', '树木与远景拉高画面。', '服饰与手套显示身份。'],
    props: ['深色外套', '手套', '树林背景'], ...blank
  },
  {
    id: 'strawhat', title: '戴草帽的自画像', englishTitle: 'Self-Portrait in a Straw Hat',
    artist: '伊丽莎白·维热·勒布伦', year: '1782', country: 'france-e4', level: 1, people: '1 人',
    image: '/artworks/strawhat.jpg', museum: '英国国家美术馆',
    source: 'https://www.nationalgallery.org.uk/',
    imageSource: 'https://en.wikipedia.org/wiki/Self-Portrait_in_a_Straw_Hat', license: '原作公版；数字图来源见链接。',
    focus: '草帽与调色板，如何把画家画成自己',
    observation: '女画家戴着草帽，手拿调色板，回头看向观者。',
    observations: ['半身像，头部微微回望。', '草帽把光线挡在脸上。', '调色板交代画家身份。'],
    props: ['草帽', '调色板', '浅色背景'], ...blank
  },
  {
    id: 'lavoisier', title: '拉瓦锡夫妇肖像', englishTitle: 'Portrait of Antoine-Laurent and Marie-Anne Lavoisier',
    artist: '雅克-路易·大卫', year: '1788', country: 'france-e4', level: 2, people: '2 人',
    image: '/artworks/lavoisier.jpg', museum: '大都会艺术博物馆',
    source: 'https://www.metmuseum.org/',
    imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_Antoine_Laurent_and_Marie_Anne_Lavoisier', license: '原作公版；数字图来源见链接。',
    focus: '书桌与仪器，如何把职业画进肖像',
    observation: '丈夫坐在书桌前，妻子站在一侧，桌上摆满科学仪器。',
    observations: ['双人室内，身体朝向形成互动。', '仪器与文件交代职业。', '光线集中在两人面部与桌面。'],
    props: ['深色外套', '书桌', '实验仪器'], ...blank
  },
  {
    id: 'ancestor', title: '清代祖先肖像', englishTitle: 'Qing Ancestor Portrait',
    artist: '佚名', year: '清', country: 'china-e4', level: 1, people: '1 人',
    image: '/artworks/ancestor.jpg', museum: '多馆藏',
    source: 'https://en.wikipedia.org/wiki/Ancestor_portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Ancestor_portrait', license: '原作公版；数字图来源见链接。',
    focus: '正面端坐，如何让一个人留在家族里',
    observation: '人物正面端坐，礼服与冠帽一丝不苟，背景几乎空白。',
    observations: ['构图对称，人物居中。', '服饰与冠帽是身份线索。', '背景简洁，强调面容。'],
    props: ['正式礼服', '冠帽', '素色背景'], ...blank
  },
  {
    id: 'charles4', title: '查理四世一家像', englishTitle: 'The Family of Charles IV',
    artist: '弗朗西斯科·戈雅', year: '1800–1801', country: 'spain-e5', level: 3, people: '6–8 人',
    image: '/artworks/charles4.jpg', museum: '普拉多博物馆',
    source: 'https://www.museodelprado.es/',
    imageSource: 'https://en.wikipedia.org/wiki/Charles_IV_of_Spain_and_His_Family', license: '原作公版；数字图来源见链接。',
    focus: '一排人，如何画出各自的心思',
    observation: '王室成员排成一排，服饰华丽，表情却各不相同。',
    observations: ['多人分层站立，像舞台。', '珠宝与勋章细节丰富。', '人物表情不完全统一。'],
    props: ['华丽礼服', '勋章', '深色背景'], ...blank
  },
  {
    id: 'moitessier', title: '莫瓦特西埃夫人', englishTitle: 'Madame Moitessier',
    artist: '让-奥古斯特-多米尼克·安格尔', year: '1856', country: 'france-e5', level: 2, people: '1 人',
    image: '/artworks/moitessier.jpg', museum: '英国国家美术馆',
    source: 'https://www.nationalgallery.org.uk/',
    imageSource: 'https://en.wikipedia.org/wiki/Madame_Moitessier', license: '原作公版；数字图来源见链接。',
    focus: '坐姿与轮廓，如何把优雅画成线条',
    observation: '夫人坐着，身体侧转，脸朝向观者，轮廓干净利落。',
    observations: ['坐姿，身体与脸方向相反。', '礼服与珠宝细节丰富。', '轮廓线清晰，姿态端庄。'],
    props: ['华丽礼服', '珠宝', '室内背景'], ...blank
  },
  {
    id: 'vangogh', title: '自画像', englishTitle: 'Self-Portrait (1889)',
    artist: '文森特·梵高', year: '1889', country: 'france-e5', level: 1, people: '1 人',
    image: '/artworks/vangogh.jpg', museum: '奥赛博物馆',
    source: 'https://www.musee-orsay.fr/',
    imageSource: 'https://en.wikipedia.org/wiki/Self-Portrait_(Van_Gogh,_1889)', license: '原作公版；数字图来源见链接。',
    focus: '旋转的笔触，如何画出内在情绪',
    observation: '半身正面，蓝绿色背景像水一样流动，脸的笔触短而急。',
    observations: ['半身正面，直视观者。', '背景笔触旋转流动。', '面部用短笔触堆出情绪。'],
    props: ['深色外套', '蓝绿色背景', '帽子'], ...blank
  },
  {
    id: 'kahnweiler', title: '卡恩韦勒肖像', englishTitle: 'Portrait of Daniel-Henry Kahnweiler',
    artist: '巴勃罗·毕加索', year: '1910', country: 'france-e6', level: 3, people: '1 人',
    image: '/artworks/kahnweiler.jpg', museum: '芝加哥艺术博物馆',
    source: 'https://www.artic.edu/artworks/109275',
    imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_Daniel-Henry_Kahnweiler', license: '原作版权归艺术家；仅作课程学习使用。',
    focus: '拆解的脸，如何同时画出多个角度',
    observation: '人物的轮廓被拆成几何面，脸和身体同时从几个角度出现。',
    observations: ['形体被分解成几何面。', '正面与侧面同时出现。', '背景与人物互相穿插。'],
    props: ['深色西装', '素色背景', '几何道具'], ...blank
  }
];

/* 内置演示：保留带真实参考点与示例照片的作品，用于完整流程演示 */
export const demoArtworks: Artwork[] = [
  {
    id: 'yawning', title: '打哈欠的自画像', englishTitle: 'Self-Portrait, Yawning', artist: '约瑟夫·迪克勒', year: '不晚于 1783',
    image: '/artworks/yawning.jpg', source: 'https://www.getty.edu/cona/CONAFullSubject.aspx?subid=700006262',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Joseph_Ducreux_-_Self-Portrait,_Yawning_-_71.PA.56_-_J._Paul_Getty_Museum.jpg',
    license: '原作公版；Getty Open Content 数字图。详见来源清单。',
    focus: '手臂的方向，如何让画面动起来',
    observation: '先看向左上方伸出的手臂，再看向右打开的另一只手臂。两个方向与倾斜的身体形成了伸展的节奏。',
    observations: ['一只手臂向画面左上方伸展，另一只手臂在胸前弯曲。', '人物身体倾斜，头部和身体并不在同一条垂直线上。', '红色外衣从深色背景中突出，浅色领口把注意力带向脸。'],
    props: ['红色外套或背心', '白色毛巾', '深色背景布'],
    frame: { width: 300, height: 390 },
    reference: { 11: { x: .63, y: .49 }, 12: { x: .37, y: .44 }, 13: { x: .85, y: .35 }, 14: { x: .23, y: .24 }, 15: { x: .65, y: .39 }, 16: { x: .13, y: .10 } },
    demo: ['/demo/yawning-before.png', '/demo/yawning-after.png'], country: 'demo', annotated: true
  },
  {
    id: 'fifer', title: '吹笛少年', englishTitle: 'The Fifer', artist: '爱德华·马奈', year: '1866',
    image: '/artworks/fifer.jpg', source: 'https://www.musee-orsay.fr/fr/oeuvres/le-fifre-709',
    imageSource: 'https://commons.wikimedia.org/wiki/Category:The_Fifer_by_Édouard_Manet', license: '原作公版；数字图为原作复制，取得路径见来源清单。',
    focus: '人物大小与大色块的力量',
    observation: '背景的空间线索很少，人物的轮廓、黑色上衣和红色长裤格外醒目。先试着让人物占据相近的画面高度。',
    observations: ['完整站姿与大面积留白共同决定人物在画面中的存在感。', '手臂自然弯曲，双手在胸前靠近乐器。', '灰、黑、红几个主要色块，让画面保持简洁。'],
    props: ['黑色上衣', '红色长裤或红布', '笛子或简单长条道具'],
    frame: { width: 600, height: 1030 },
    reference: { 11: { x: .60, y: .305 }, 12: { x: .285, y: .305 }, 13: { x: .60, y: .425 }, 14: { x: .17, y: .375 }, 15: { x: .395, y: .275 }, 16: { x: .27, y: .28 } },
    demo: ['/demo/fifer-before.png', '/demo/fifer-after.png'], country: 'demo', annotated: true
  }
];

export const allArtworks: Artwork[] = [...artworks, ...demoArtworks];

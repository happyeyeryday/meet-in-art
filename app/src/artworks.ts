import type { Artwork } from './types.ts';

/* 20 幅可仿拍作品：5 个国家 × 4 幅。
   reference 暂未标注，标注后会启用姿态对比；image 指向 public/artworks/<id>.jpg。 */
const blank = { reference: {}, frame: { width: 1, height: 1 }, annotated: false };

export const artworks: Artwork[] = [
  /* ---------------- 法国 ---------------- */
  {
    id: 'liberty', title: '自由引导人民', englishTitle: 'Liberty Leading the People',
    artist: '欧仁·德拉克洛瓦', year: '1830', country: 'france', level: 3, people: '3–6 人',
    image: '/artworks/liberty.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/en/explore/the-palace/liberty-leading-the-people',
    imageSource: 'https://en.wikipedia.org/wiki/Liberty_Leading_the_People', license: '原作公版；数字图来源见链接。',
    focus: '旗帜的方向，如何把一群人拧成一股力',
    observation: '七月革命的街垒上，自由女神举旗前行，市民与倒地者在烟雾里交错。',
    observations: ['三角形构图：从旗帜顶端到前景的躯体形成稳定的三角。', '光从左上打下，脸与肩最亮。', '红白蓝三色反复出现，把视线拉向旗帜。'],
    props: ['旗帜', '旧衬衫或马甲', '木杆'], ...blank
  },
  {
    id: 'recamier', title: '雷卡米埃夫人像', englishTitle: 'Portrait of Madame Récamier',
    artist: '雅克-路易·大卫', year: '1800', country: 'france', level: 2, people: '1 人',
    image: '/artworks/recamier.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/', imageSource: 'https://en.wikipedia.org/wiki/Portrait_of_Madame_R%C3%A9camier',
    license: '原作公版；数字图来源见链接。',
    focus: '一条斜线，如何让静止的身体也流动',
    observation: '沙龙女主人斜倚长榻，用最少的动作完成了一次肖像革命。',
    observations: ['长榻的弧线与身体形成平行线。', '几乎没有背景，光从左侧铺满白裙。', '回望的眼神是画面唯一的方向感。'],
    props: ['白色长裙', '躺椅／沙发', '烛台'], ...blank
  },
  {
    id: 'moulin', title: '煎饼磨坊的舞会', englishTitle: 'Bal du moulin de la Galette',
    artist: '皮埃尔-奥古斯特·雷诺阿', year: '1876', country: 'france', level: 3, people: '3–8 人',
    image: '/artworks/moulin.jpg', museum: '奥赛博物馆',
    source: 'https://www.musee-orsay.fr/fr/oeuvres/bal-du-moulin-de-la-galette-1152',
    imageSource: 'https://en.wikipedia.org/wiki/Bal_du_moulin_de_la_Galette', license: '原作公版；数字图来源见链接。',
    focus: '树荫下的光斑，怎样落在人身上',
    observation: '蒙马特的露天舞会，阳光穿过树叶，落在跳舞的人身上。',
    observations: ['光斑像碎片一样落在衣服和脸上。', '近景清晰、远景虚化，形成空气感。', '人物不看镜头，各自沉浸。'],
    props: ['草帽', '长裙', '长椅'], ...blank
  },
  {
    id: 'olympia', title: '奥林匹亚', englishTitle: 'Olympia',
    artist: '爱德华·马奈', year: '1863', country: 'france', level: 2, people: '1–2 人',
    image: '/artworks/olympia.jpg', museum: '奥赛博物馆',
    source: 'https://www.musee-orsay.fr/fr/oeuvres/olympia-707',
    imageSource: 'https://en.wikipedia.org/wiki/Olympia_(Manet)', license: '原作公版；数字图来源见链接。',
    focus: '直视镜头的目光，如何改变观看的关系',
    observation: '一位巴黎女性直视观众，把古典的维纳斯换成了现实里的人。',
    observations: ['视线直白，拒绝被观看的顺从。', '黑色背景与浅色身体形成强对比。', '花束、黑猫、侍女三个细节各有暗示。'],
    props: ['深色靠垫', '花束', '黑猫玩偶'], ...blank
  },
  /* ---------------- 意大利 ---------------- */
  {
    id: 'monalisa', title: '蒙娜丽莎', englishTitle: 'Mona Lisa',
    artist: '列奥纳多·达·芬奇', year: '1503–1519', country: 'italy', level: 2, people: '1 人',
    image: '/artworks/monalisa.jpg', museum: '卢浮宫',
    source: 'https://www.louvre.fr/en/explore/the-palace/mona-lisa',
    imageSource: 'https://en.wikipedia.org/wiki/Mona_Lisa', license: '原作公版；数字图来源见链接。',
    focus: '没有硬边的轮廓，如何让表情变得含混',
    observation: '一个微笑，让五百年来的观众不断回头。',
    observations: ['轮廓没有硬边，像被雾化开。', '双手是全身最亮的部分之一。', '背景左右的地平线高度并不一致。'],
    props: ['深色上衣', '薄纱', '椅子'], ...blank
  },
  {
    id: 'ermine', title: '抱银貂的女子', englishTitle: 'Lady with an Ermine',
    artist: '列奥纳多·达·芬奇', year: '约 1490', country: 'italy', level: 2, people: '1 人',
    image: '/artworks/ermine.jpg', museum: '恰尔托雷斯基博物馆',
    source: 'https://pl.wikipedia.org/wiki/Dama_z_gronostajem',
    imageSource: 'https://en.wikipedia.org/wiki/Lady_with_an_Ermine', license: '原作公版；数字图来源见链接。',
    focus: '头与身体的反向，如何制造张力',
    observation: '切奇莉亚怀抱银貂回望，是文艺复兴肖像里最生动的一次转身。',
    observations: ['头部与身体方向相反，形成张力。', '手部与银貂的毛色彼此呼应。', '光从左上照亮脸与兽毛。'],
    props: ['白手套', '毛绒玩具', '深色背景布'], ...blank
  },
  {
    id: 'primavera', title: '春', englishTitle: 'Primavera',
    artist: '桑德罗·波提切利', year: '约 1480–1485', country: 'italy', level: 3, people: '3–6 人',
    image: '/artworks/primavera.jpg', museum: '乌菲齐美术馆',
    source: 'https://www.uffizi.it/en/artworks/botticelli-spring',
    imageSource: 'https://en.wikipedia.org/wiki/Primavera_(Botticelli)', license: '原作公版；数字图来源见链接。',
    focus: '横向的群像，如何像一幅挂毯',
    observation: '橘园里众神与春神同框，花朵铺满整个画面。',
    observations: ['横向展开的群像，像一幅挂毯。', '深色树丛把人物推向前景。', '衣褶与花枝的线条极其密集。'],
    props: ['花环', '浅色长裙', '假花'], ...blank
  },
  {
    id: 'venus', title: '维纳斯的诞生', englishTitle: 'The Birth of Venus',
    artist: '桑德罗·波提切利', year: '约 1485', country: 'italy', level: 2, people: '1–3 人',
    image: '/artworks/venus.jpg', museum: '乌菲齐美术馆',
    source: 'https://www.uffizi.it/en/artworks/botticelli-birth-of-venus',
    imageSource: 'https://en.wikipedia.org/wiki/The_Birth_of_Venus', license: '原作公版；数字图来源见链接。',
    focus: 'S 形的身体，如何站在贝壳上也不倒',
    observation: '维纳斯从海中诞生，站在贝壳上被风送上岸。',
    observations: ['人物被放在正中，左右近乎对称。', '头发与布料的线条呈 S 形。', '海面几乎平面化，像装饰。'],
    props: ['大贝壳（纸板）', '浅色长布', '花瓣'], ...blank
  },
  /* ---------------- 荷兰 ---------------- */
  {
    id: 'pearl', title: '戴珍珠耳环的少女', englishTitle: 'Girl with a Pearl Earring',
    artist: '约翰内斯·维米尔', year: '约 1665', country: 'netherlands', level: 1, people: '1 人',
    image: '/artworks/pearl.jpg', museum: '毛里茨豪斯',
    source: 'https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/',
    imageSource: 'https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring', license: '原作公版；数字图来源见链接。',
    focus: '一次回眸，如何把故事留在画外',
    observation: '一个回眸，把所有叙事都留在了画外。',
    observations: ['纯黑背景，没有环境线索。', '珍珠只有两点高光，却足够亮。', '头巾的蓝与披肩的黄互为补色。'],
    props: ['蓝色头巾', '黄色布', '珍珠耳环'], ...blank
  },
  {
    id: 'nightwatch', title: '夜巡', englishTitle: 'The Night Watch',
    artist: '伦勃朗', year: '1642', country: 'netherlands', level: 3, people: '4–8 人',
    image: '/artworks/nightwatch.jpg', museum: '荷兰国立博物馆',
    source: 'https://www.rijksmuseum.nl/en/collection/SK-C-5',
    imageSource: 'https://en.wikipedia.org/wiki/The_Night_Watch', license: '原作公版；数字图来源见链接。',
    focus: '一束光，如何把群像变成舞台',
    observation: '民兵队走出门廊的一瞬，被伦勃朗拍成了一出戏。',
    observations: ['光集中在队长、副官和小女孩身上。', '人物层层叠叠，制造出队伍的纵深。', '暗部仍能看清布料的质地。'],
    props: ['深色外套', '旗杆', '长棍'], ...blank
  },
  {
    id: 'milkmaid', title: '倒牛奶的女仆', englishTitle: 'The Milkmaid',
    artist: '约翰内斯·维米尔', year: '约 1658–1660', country: 'netherlands', level: 2, people: '1 人',
    image: '/artworks/milkmaid.jpg', museum: '荷兰国立博物馆',
    source: 'https://www.rijksmuseum.nl/en/collection/SK-A-2344',
    imageSource: 'https://en.wikipedia.org/wiki/The_Milkmaid_(Vermeer)', license: '原作公版；数字图来源见链接。',
    focus: '窗边的侧光，如何让日常变得安静',
    observation: '厨房里最普通的动作，被画成了安静的光。',
    observations: ['光从左上窗子进来，落在手臂与陶罐。', '桌面的面包与布褶极其细致。', '背景墙面斑驳，几乎抽象。'],
    props: ['陶罐', '白帽', '围裙'], ...blank
  },
  {
    id: 'jewishbride', title: '犹太新娘', englishTitle: 'The Jewish Bride',
    artist: '伦勃朗', year: '约 1665–1669', country: 'netherlands', level: 2, people: '2 人',
    image: '/artworks/jewishbride.jpg', museum: '荷兰国立博物馆',
    source: 'https://www.rijksmuseum.nl/en/collection/SK-C-216',
    imageSource: 'https://en.wikipedia.org/wiki/The_Jewish_Bride', license: '原作公版；数字图来源见链接。',
    focus: '手放在哪里，情感就落在哪里',
    observation: '一对爱人把手放在心口，胜过任何誓言。',
    observations: ['手的位置是全画的情感中心。', '金红颜料堆得很厚，像在发光。', '背景几乎融进黑暗。'],
    props: ['红色披肩', '金色布料'], ...blank
  },
  /* ---------------- 日本 ---------------- */
  {
    id: 'beauties', title: '当代三美人', englishTitle: 'Three Beauties of the Present Day',
    artist: '喜多川歌麿', year: '约 1793', country: 'japan', level: 2, people: '3 人',
    image: '/artworks/beauties.jpg', museum: '波士顿美术馆等',
    source: 'https://www.mfa.org/',
    imageSource: 'https://en.wikipedia.org/wiki/Three_Beauties_of_the_Present_Day', license: '原作公版；数字图来源见链接。',
    focus: '三张脸朝向不同方向，画面就有了风',
    observation: '三位江户美人同框，各自看向不同方向。',
    observations: ['三人脸型与发型各不相同。', '衣领的层次是身份线索。', '背景完全空白，靠人物撑住。'],
    props: ['和服', '发簪', '扇子'], ...blank
  },
  {
    id: 'sharaku', title: '三代目大谷鬼次饰奴江户兵卫', englishTitle: 'Ōtani Oniji III as Yakko Edobei',
    artist: '东洲斋写乐', year: '1794', country: 'japan', level: 1, people: '1 人',
    image: '/artworks/sharaku.jpg', museum: '多处藏',
    source: 'https://www.mfa.org/', imageSource: 'https://en.wikipedia.org/wiki/T%C5%8Dsh%C5%ABsai_Sharaku',
    license: '原作公版；数字图来源见链接。',
    focus: '手指的姿态，比脸更凶',
    observation: '演员的一个狠表情，被写乐画成了心理肖像。',
    observations: ['背景是云母黑，人物像浮在暗处。', '手指的姿态比脸更凶。', '衣纹用粗线勾勒。'],
    props: ['深色和服', '折扇', '夸张表情'], ...blank
  },
  {
    id: 'ohisa', title: '高岛屋久', englishTitle: 'Takashima Ohisa',
    artist: '喜多川歌麿', year: '约 1793', country: 'japan', level: 1, people: '1 人',
    image: '/artworks/ohisa.jpg', museum: '大都会艺术博物馆',
    source: 'https://www.metmuseum.org/', imageSource: 'https://en.wikipedia.org/wiki/Takashima_Ohisa',
    license: '原作公版；数字图来源见链接。',
    focus: '发型与衣领，如何交代身份',
    observation: '茶屋少女的日常一瞥，被歌麿画成了理想化的美人。',
    observations: ['发型结构清楚，是仿拍重点。', '和服纹样与季节有关。', '手部动作小而克制。'],
    props: ['团扇', '发簪', '和服'], ...blank
  },
  {
    id: 'snow', title: '雪中伞下的男女', englishTitle: 'Lovers Walking in the Snow',
    artist: '铃木春信', year: '约 1760 年代', country: 'japan', level: 2, people: '2 人',
    image: '/artworks/snow.jpg', museum: '大都会艺术博物馆',
    source: 'https://www.metmuseum.org/', imageSource: 'https://en.wikipedia.org/wiki/Suzuki_Harunobu',
    license: '原作公版；数字图来源见链接。',
    focus: '一把伞，如何把两个人围成一个小世界',
    observation: '雪中一把伞，把两个人变成一个小小的世界。',
    observations: ['伞面把画面切成上下两层。', '雪用留白表现，不画白颜料。', '两人的步伐是同一节奏。'],
    props: ['和伞', '和服', '木屐'], ...blank
  },
  /* ---------------- 美国 ---------------- */
  {
    id: 'gothic', title: '美国哥特式', englishTitle: 'American Gothic',
    artist: '格兰特·伍德', year: '1930', country: 'usa', level: 1, people: '2 人',
    image: '/artworks/gothic.jpg', museum: '芝加哥艺术博物馆',
    source: 'https://www.artic.edu/artworks/6565/american-gothic',
    imageSource: 'https://en.wikipedia.org/wiki/American_Gothic', license: '原作公版；数字图来源见链接。',
    focus: '两张不笑的脸，如何撑住一栋房子',
    observation: '一对衣阿华父女站在自家农舍前，成了美国最著名的面孔。',
    observations: ['尖拱窗在两人之间重复。', '草叉的三齿与窗框线条呼应。', '表情克制，几乎不笑。'],
    props: ['草叉', '围裙', '深色外套'], ...blank
  },
  {
    id: 'nighthawks', title: '夜游者', englishTitle: 'Nighthawks',
    artist: '爱德华·霍普', year: '1942', country: 'usa', level: 2, people: '4 人',
    image: '/artworks/nighthawks.jpg', museum: '芝加哥艺术博物馆',
    source: 'https://www.artic.edu/artworks/111628/nighthawks',
    imageSource: 'https://en.wikipedia.org/wiki/Nighthawks', license: '原作公版；数字图来源见链接。',
    focus: '玻璃把人关在光里，街道却是空的',
    observation: '深夜的餐馆里，四个人各自沉默。',
    observations: ['玻璃把人物关在光里，街道是空的。', '荧光灯的绿与室内的黄形成冷对比。', '没有入口，观众只能旁观。'],
    props: ['吧台', '咖啡杯', '深色帽子'], ...blank
  },
  {
    id: 'watson', title: '沃森与鲨鱼', englishTitle: 'Watson and the Shark',
    artist: '约翰·辛格尔顿·科普利', year: '1778', country: 'usa', level: 3, people: '6–8 人',
    image: '/artworks/watson.jpg', museum: '美国国家美术馆',
    source: 'https://www.nga.gov/artworks/56937-watson-and-the-shark',
    imageSource: 'https://en.wikipedia.org/wiki/Watson_and_the_Shark', license: '原作公版；数字图来源见链接。',
    focus: '所有手臂指向同一个人，紧张就成立了',
    observation: '少年落水、众人伸手、鲨鱼逼近，一幅画讲完一场营救。',
    observations: ['所有手臂指向落水者，形成放射线。', '船沿的对角线制造紧张。', '海面颜色从深到浅。'],
    props: ['纸板小船', '绳子', '蓝色布'], ...blank
  },
  {
    id: 'washington', title: '乔治·华盛顿肖像', englishTitle: 'George Washington (Vaughan type)',
    artist: '吉尔伯特·斯图尔特', year: '1795', country: 'usa', level: 1, people: '1 人',
    image: '/artworks/washington.jpg', museum: '美国国家肖像馆',
    source: 'https://npg.si.edu/', imageSource: 'https://en.wikipedia.org/wiki/Gilbert_Stuart',
    license: '原作公版；数字图来源见链接。',
    focus: '领巾的一小块白，如何点亮整张脸',
    observation: '美国国父的标准像，后来被印上了一美元纸币。',
    observations: ['领巾的褶是画面最亮的白。', '面部略不对称，显得真实。', '背景极暗，突出轮廓。'],
    props: ['黑色外套', '白领巾', '旧文件'], ...blank
  }
];

/* 内置演示：保留原有的三幅，带真实参考点与示例照片，用于完整流程演示。 */
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
    id: 'desperate', title: '绝望的人', englishTitle: 'The Desperate Man', artist: '居斯塔夫·库尔贝', year: '约 1843—1845',
    image: '/artworks/desperate.jpg', source: 'https://www.musee-orsay.fr/fr/oeuvres/autoportrait-de-lartiste-dit-aussi-desespoir-ou-encore-le-desespere-272956',
    imageSource: 'https://commons.wikimedia.org/wiki/Category:Le_Désespéré_(Courbet)', license: '原作公版；数字图为原作复制，取得路径见来源清单。',
    focus: '用双臂围住一个紧张的表情',
    observation: '试着用手臂在头部周围形成折线，观察肘部离脸多远。画面边缘与手臂之间的距离，同样影响紧张感。',
    observations: ['双手靠近头发，手肘向两边展开。', '人物上半身占据大部分画面，留白很少。', '浅色衣袖与深色背景对比，让手臂的轮廓更明显。'],
    props: ['浅色宽松衬衫', '深色背景', '一侧的窗光'],
    frame: { width: 1500, height: 1228 },
    reference: { 11: { x: .72, y: .69 }, 12: { x: .28, y: .67 }, 13: { x: .92, y: .45 }, 14: { x: .04, y: .52 }, 15: { x: .565, y: .135 }, 16: { x: .18, y: .355 } },
    demo: ['/demo/desperate-before.png', '/demo/desperate-after.png'], country: 'demo', annotated: true
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

import type { Country } from './types.ts';

/* 每个“地点”属于一个时期；地图上只显示当前时期的地点 */
export const countries: Country[] = [
  // 01 远古与古典
  { id: 'egypt-e1', name: 'EGYPT', zh: '埃及', flag: '🇪🇬', region: 'AFRICA', era: 'ANCIENT EGYPT', eraId: 'e1', dot: { x: 58.33, y: 36.81 }, desc: '法尤姆木乃伊肖像与墓室壁画，把人的脸留在通往另一个世界的路上。', artists: '无名工匠' },
  { id: 'rome-e1', name: 'ROME', zh: '罗马', flag: '🇮🇹', region: 'EUROPE', era: 'ROMAN EMPIRE', eraId: 'e1', dot: { x: 53.47, y: 29.24 }, desc: '庞贝壁画与罗马肖像，在日常生活与神话之间描摹身体。', artists: '无名工匠' },
  { id: 'china-e1', name: 'CHINA', zh: '中国', flag: '🇨🇳', region: 'ASIA', era: 'QIN DYNASTY', eraId: 'e1', dot: { x: 80.25, y: 34.51 }, desc: '兵马俑用陶土复制千万张不同的脸，秩序与个体同时存在。', artists: '无名工匠' },

  // 02 中古
  { id: 'byzantium-e2', name: 'BYZANTIUM', zh: '拜占庭', flag: '🇹🇷', region: 'EUROPE', era: 'BYZANTINE', eraId: 'e2', dot: { x: 58.06, y: 29.86 }, desc: '金色背景与正面站姿，把人物放进永恒的神圣空间。', artists: '拉文纳工匠' },
  { id: 'china-e2', name: 'CHINA', zh: '中国', flag: '🇨🇳', region: 'ASIA', era: 'TANG · SONG', eraId: 'e2', dot: { x: 80.25, y: 34.51 }, desc: '帝王与高僧的肖像，用线条、服饰和座次交代身份。', artists: '阎立本（传）' },
  { id: 'japan-e2', name: 'JAPAN', zh: '日本', flag: '🇯🇵', region: 'ASIA', era: 'KAMAKURA', eraId: 'e2', dot: { x: 87.72, y: 34.03 }, desc: '顶相与和绘，正面端坐，强调师承与精神气质。', artists: '无名画师' },

  // 03 文艺复兴
  { id: 'italy-e3', name: 'ITALY', zh: '意大利', flag: '🇮🇹', region: 'EUROPE', era: 'RENAISSANCE', eraId: 'e3', dot: { x: 53.47, y: 29.24 }, desc: '透视、解剖与个体意识，让人第一次成为画面的中心。', artists: 'Leonardo' },
  { id: 'flanders-e3', name: 'FLANDERS', zh: '尼德兰', flag: '🇧🇪', region: 'EUROPE', era: 'NORTHERN RENAISSANCE', eraId: 'e3', dot: { x: 51.10, y: 23.40 }, desc: '油画细节与镜面般的写实，把日常物件也画成证词。', artists: 'Van Eyck' },
  { id: 'germany-e3', name: 'GERMANY', zh: '德国', flag: '🇩🇪', region: 'EUROPE', era: 'NORTHERN RENAISSANCE', eraId: 'e3', dot: { x: 53.60, y: 22.40 }, desc: '自画像的诞生：艺术家把自己画成圣像，也画成普通人。', artists: 'Dürer' },

  // 04 巴洛克与古典主义
  { id: 'spain-e4', name: 'SPAIN', zh: '西班牙', flag: '🇪🇸', region: 'EUROPE', era: 'BAROQUE', eraId: 'e4', dot: { x: 48.89, y: 30.56 }, desc: '戏剧性的光与身体，让肖像带上权力与心理的重量。', artists: 'Velázquez' },
  { id: 'england-e4', name: 'ENGLAND', zh: '英国', flag: '🇬🇧', region: 'EUROPE', era: 'GRAND MANNER', eraId: 'e4', dot: { x: 49.44, y: 20.83 }, desc: '全身肖像与风景，用姿态和衣着经营贵族气度。', artists: 'Gainsborough' },
  { id: 'france-e4', name: 'FRANCE', zh: '法国', flag: '🇫🇷', region: 'EUROPE', era: 'ROCOCO', eraId: 'e4', dot: { x: 50.67, y: 25.97 }, desc: '洛可可的柔光与装饰，把肖像变成品味的展示。', artists: 'Boucher' },
  { id: 'china-e4', name: 'CHINA', zh: '中国', flag: '🇨🇳', region: 'ASIA', era: 'QING DYNASTY', eraId: 'e4', dot: { x: 80.25, y: 34.51 }, desc: '宫廷与祖先肖像，正面端坐，服饰即身份。', artists: '宫廷画师' },
  { id: 'india-e4', name: 'INDIA', zh: '印度', flag: '🇮🇳', region: 'ASIA', era: 'MUGHAL', eraId: 'e4', dot: { x: 71.94, y: 43.06 }, desc: '莫卧儿细密画，侧面轮廓、珠宝与花枝构成等级。', artists: '宫廷画师' },

  // 05 近代
  { id: 'france-e5', name: 'FRANCE', zh: '法国', flag: '🇫🇷', region: 'EUROPE', era: 'REALISM · IMPRESSIONISM', eraId: 'e5', dot: { x: 50.67, y: 25.97 }, desc: '从写实到印象派，肖像开始记录光、瞬间与个人情绪。', artists: 'Courbet · Monet' },
  { id: 'china-e5', name: 'CHINA', zh: '中国', flag: '🇨🇳', region: 'ASIA', era: 'LATE QING', eraId: 'e5', dot: { x: 80.56, y: 36.81 }, desc: '传统笔墨吸收西法，人物画走向现实与个体。', artists: '任伯年' },

  // 06 现代与当代
  { id: 'germany-e6', name: 'GERMANY', zh: '德国', flag: '🇩🇪', region: 'EUROPE', era: 'EXPRESSIONISM', eraId: 'e6', dot: { x: 52.78, y: 22.92 }, desc: '表现主义用变形与强色，把心理创伤画在脸上。', artists: 'Kirchner' },
  { id: 'france-e6', name: 'FRANCE', zh: '法国', flag: '🇫🇷', region: 'EUROPE', era: 'ÉCOLE DE PARIS', eraId: 'e6', dot: { x: 50.67, y: 25.97 }, desc: '拉长的脖颈与简化的五官，肖像变成气质的线条。', artists: 'Modigliani' },
  { id: 'mexico-e6', name: 'MEXICO', zh: '墨西哥', flag: '🇲🇽', region: 'AMERICAS', era: 'MODERNISM', eraId: 'e6', dot: { x: 21.67, y: 42.36 }, desc: '自画像里塞满象征物，个人经历就是画面本身。', artists: 'Frida Kahlo' },
  { id: 'china-e6', name: 'CHINA', zh: '中国', flag: '🇨🇳', region: 'ASIA', era: 'CONTEMPORARY', eraId: 'e6', dot: { x: 79.17, y: 34.03 }, desc: '照相写实与当代具象，把普通人的脸放大到纪念碑尺寸。', artists: '罗中立' }
,
  { id: 'westafrica-e2', name: 'WEST AFRICA', zh: '西非', flag: '🌍', region: 'AFRICA', era: 'IFE · BENIN', eraId: 'e2', dot: { x: 52.50, y: 52.78 }, desc: '伊费与贝宁的铜像，用金属铸造出理想化的脸。', artists: '宫廷工匠' },
  { id: 'maya-e2', name: 'MAYA', zh: '玛雅', flag: '🗿', region: 'AMERICAS', era: 'MAYA CLASSIC', eraId: 'e2', dot: { x: 25.00, y: 46.53 }, desc: '门楣浮雕里的人物、神灵与文字，一起记录政治事件。', artists: '无名工匠' },
  { id: 'netherlands-e4', name: 'NETHERLANDS', zh: '荷兰', flag: '🇳🇱', region: 'EUROPE', era: 'DUTCH GOLDEN AGE', eraId: 'e4', dot: { x: 51.47, y: 22.15 }, desc: '民兵群像与市民肖像，在暗部里藏住整个时代。', artists: 'Rembrandt' },
  { id: 'spain-e5', name: 'SPAIN', zh: '西班牙', flag: '🇪🇸', region: 'EUROPE', era: 'GOYA', eraId: 'e5', dot: { x: 48.89, y: 30.56 }, desc: '宫廷群像里，戈雅把每个人都画成了自己。', artists: 'Goya' }
];

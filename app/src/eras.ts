export interface Era {
  id: string;
  index: string;
  title: string;
  en: string;
  range: string;
  desc: string;
  keywords: string[];
}

export const eras: Era[] = [
  {
    id: 'e1', index: '01', title: '远古与古典时期', en: 'ANCIENT & CLASSICAL',
    range: '约公元前 3000 年 — 公元 500 年',
    desc: '人物画的起源、神灵崇拜、古埃及壁画、古希腊瓶画、古罗马肖像。',
    keywords: ['神性', '秩序', '理想化人体']
  },
  {
    id: 'e2', index: '02', title: '中古时期', en: 'MEDIEVAL',
    range: '约 500 — 1400 年',
    desc: '欧洲中世纪宗教绘画、拜占庭圣像、中国魏晋隋唐宋元人物画、日本大和绘等。',
    keywords: ['宗教', '礼仪', '象征', '线条']
  },
  {
    id: 'e3', index: '03', title: '文艺复兴时期', en: 'RENAISSANCE',
    range: '约 1400 — 1600 年',
    desc: '意大利文艺复兴、北方文艺复兴、中国明代人物画等。',
    keywords: ['人文主义', '透视', '解剖', '个体意识']
  },
  {
    id: 'e4', index: '04', title: '巴洛克与古典主义时期', en: 'BAROQUE & CLASSICISM',
    range: '约 1600 — 1800 年',
    desc: '巴洛克、洛可可、新古典主义，以及中国明清人物画。',
    keywords: ['戏剧性', '光影', '宫廷肖像', '情感表达']
  },
  {
    id: 'e5', index: '05', title: '近代艺术时期', en: 'MODERN',
    range: '约 1800 — 1900 年',
    desc: '浪漫主义、现实主义、印象派、后印象派，以及中国近代人物画的转型。',
    keywords: ['现实生活', '个人情感', '光色', '现代社会']
  },
  {
    id: 'e6', index: '06', title: '现代与当代艺术时期', en: 'CONTEMPORARY',
    range: '1900 年 — 至今',
    desc: '表现主义、立体主义、超现实主义、抽象艺术、当代具象绘画与数字艺术。',
    keywords: ['主观表达', '心理', '身份', '解构', '多元']
  }
];

export const eraOf = (id?: string) => eras.find(e => e.id === id);

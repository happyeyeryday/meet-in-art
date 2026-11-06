import type { Country } from './types.ts';

export const countries: Country[] = [
  {
    id: 'france', name: 'FRANCE', zh: '法国', flag: '🇫🇷', region: 'EUROPE',
    era: 'CLASSICISM → IMPRESSIONISM', dot: { x: 50.67, y: 25.97 },
    desc: '从新古典主义的严谨到印象派的光影，法国艺术一直在重新定义“怎么看”。',
    artists: 'David · Delacroix · Manet · Renoir'
  },
  {
    id: 'italy', name: 'ITALY', zh: '意大利', flag: '🇮🇹', region: 'EUROPE',
    era: 'RENAISSANCE', dot: { x: 53.47, y: 28.61 },
    desc: '文艺复兴的诞生地。达·芬奇与波提切利把人的身体与目光放回画面的中心。',
    artists: 'Leonardo · Botticelli'
  },
  {
    id: 'netherlands', name: 'NETHERLANDS', zh: '荷兰', flag: '🇳🇱', region: 'EUROPE',
    era: 'DUTCH GOLDEN AGE', dot: { x: 51.47, y: 22.15 },
    desc: '黄金时代的画家把镜头对准日常：窗边的光、倒奶的手、回眸的一瞬。',
    artists: 'Vermeer · Rembrandt'
  },
  {
    id: 'japan', name: 'JAPAN', zh: '日本', flag: '🇯🇵', region: 'ASIA',
    era: 'UKIYO-E · EDO', dot: { x: 88.39, y: 33.19 },
    desc: '浮世绘把江户的演员、美人与四季刻进木版，线条和色块都极其鲜明。',
    artists: 'Utamaro · Sharaku · Harunobu'
  },
  {
    id: 'usa', name: 'UNITED STATES', zh: '美国', flag: '🇺🇸', region: 'NORTH AMERICA',
    era: 'REALISM · MODERN', dot: { x: 22.61, y: 30.69 },
    desc: '从殖民地肖像到都市夜景，美国绘画关心普通人的脸和他们的处境。',
    artists: 'Copley · Stuart · Wood · Hopper'
  }
];

export interface LetterItem {
  name: string;
  nameCn: string;
  emoji: string;
  color: string;
  soundType:
    | 'pop'
    | 'chime'
    | 'boing'
    | 'swoosh'
    | 'trumpet'
    | 'magic'
    | 'quack'
    | 'meow'
    | 'roar'
    | 'sparkle';
  action: 'bounce' | 'spin' | 'float' | 'wiggle' | 'pulse';
  funFact: string;
}

export interface LetterData {
  letter: string;
  phonics: string;
  color: string;
  items: LetterItem[];
}

export interface NumberData {
  num: number;
  name: string;
  nameCn: string;
  pinyin: string;
  emoji: string;
  color: string;
  note: string; // musical note name
  freq: number; // Hz for synthesizer
  countItem: {
    emoji: string;
    nameCn: string;
  };
  funFact: string;
}

export interface EasterEggWord {
  word: string;
  nameCn: string;
  emoji: string;
  themeColor: string;
  title: string;
  desc: string;
  audioPrompt: string;
}

export interface WorldTheme {
  id: 'garden' | 'space' | 'ocean' | 'candy' | 'dino';
  nameCn: string;
  nameEn: string;
  icon: string;
  bgGradient: string;
  groundColor: string;
  cardBg: string;
  ambientEmoji: string[];
  particleColor: string[];
  mascotName: string;
  mascotEmoji: string;
}

export const LETTERS_DATA: Record<string, LetterData> = {
  A: {
    letter: 'A',
    phonics: '/æ/ 艾',
    color: '#EF4444',
    items: [
      {
        name: 'Apple',
        nameCn: '苹果',
        emoji: '🍎',
        color: '#EF4444',
        soundType: 'pop',
        action: 'bounce',
        funFact: '红彤彤的大苹果，又香又脆！'
      },
      {
        name: 'Astronaut',
        nameCn: '宇航员',
        emoji: '👨‍🚀',
        color: '#3B82F6',
        soundType: 'magic',
        action: 'float',
        funFact: '宇航员叔叔飞向神秘太空探索！'
      },
      {
        name: 'Alligator',
        nameCn: '大鳄鱼',
        emoji: '🐊',
        color: '#10B981',
        soundType: 'boing',
        action: 'wiggle',
        funFact: '大鳄鱼摇着尾巴在水里游泳呢！'
      },
      {
        name: 'Airplane',
        nameCn: '飞机',
        emoji: '✈️',
        color: '#6366F1',
        soundType: 'swoosh',
        action: 'float',
        funFact: '小飞机轰隆隆，冲上蓝天！'
      }
    ]
  },
  B: {
    letter: 'B',
    phonics: '/b/ 玻',
    color: '#F59E0B',
    items: [
      {
        name: 'Bear',
        nameCn: '小熊',
        emoji: '🐻',
        color: '#B45309',
        soundType: 'boing',
        action: 'bounce',
        funFact: '毛茸茸的小棕熊喜欢吃甜蜂蜜！'
      },
      {
        name: 'Butterfly',
        nameCn: '蝴蝶',
        emoji: '🦋',
        color: '#EC4899',
        soundType: 'magic',
        action: 'float',
        funFact: '美丽的小蝴蝶在花丛中翩翩起舞！'
      },
      {
        name: 'Banana',
        nameCn: '香蕉',
        emoji: '🍌',
        color: '#EAB308',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '弯弯的香蕉像一只金色的小船！'
      },
      {
        name: 'Balloon',
        nameCn: '气球',
        emoji: '🎈',
        color: '#EF4444',
        soundType: 'sparkle',
        action: 'float',
        funFact: '五彩斑斓的气球慢慢升上天空！'
      }
    ]
  },
  C: {
    letter: 'C',
    phonics: '/k/ 克的',
    color: '#10B981',
    items: [
      {
        name: 'Cat',
        nameCn: '小猫',
        emoji: '🐱',
        color: '#F97316',
        soundType: 'meow',
        action: 'wiggle',
        funFact: '喵喵喵，可爱的小猫最爱抓毛线球！'
      },
      {
        name: 'Car',
        nameCn: '小汽车',
        emoji: '🚗',
        color: '#EF4444',
        soundType: 'swoosh',
        action: 'bounce',
        funFact: '嘀嘀叭叭，红色小汽车跑得真快！'
      },
      {
        name: 'Cake',
        nameCn: '生日蛋糕',
        emoji: '🎂',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '香甜美味的蛋糕，插上七彩蜡烛！'
      },
      {
        name: 'Cookie',
        nameCn: '小饼干',
        emoji: '🍪',
        color: '#D97706',
        soundType: 'pop',
        action: 'bounce',
        funFact: '咔嚓咔嚓，巧克力饼干真好吃！'
      }
    ]
  },
  D: {
    letter: 'D',
    phonics: '/d/ 得',
    color: '#3B82F6',
    items: [
      {
        name: 'Dog',
        nameCn: '小狗',
        emoji: '🐶',
        color: '#F59E0B',
        soundType: 'boing',
        action: 'bounce',
        funFact: '汪汪汪，热情的小狗摇着尾巴打招呼！'
      },
      {
        name: 'Dinosaur',
        nameCn: '小恐龙',
        emoji: '🦖',
        color: '#10B981',
        soundType: 'roar',
        action: 'wiggle',
        funFact: '嗷呜！霸王龙迈着大步去探险！'
      },
      {
        name: 'Duck',
        nameCn: '小鸭子',
        emoji: '🦆',
        color: '#EAB308',
        soundType: 'quack',
        action: 'bounce',
        funFact: '嘎嘎嘎，小黄鸭在池塘里欢快游水！'
      },
      {
        name: 'Donut',
        nameCn: '甜甜圈',
        emoji: '🍩',
        color: '#EC4899',
        soundType: 'pop',
        action: 'spin',
        funFact: '圆溜溜的甜甜圈撒满了彩虹糖！'
      }
    ]
  },
  E: {
    letter: 'E',
    phonics: '/e/ 哎',
    color: '#8B5CF6',
    items: [
      {
        name: 'Elephant',
        nameCn: '大象',
        emoji: '🐘',
        color: '#6B7280',
        soundType: 'trumpet',
        action: 'bounce',
        funFact: '大象甩着长鼻子正在喷出清凉水花！'
      },
      {
        name: 'Egg',
        nameCn: '彩蛋',
        emoji: '🥚',
        color: '#F59E0B',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '咔哒一声，小鸡要从蛋壳里钻出来啦！'
      },
      {
        name: 'Earth',
        nameCn: '地球',
        emoji: '🌍',
        color: '#3B82F6',
        soundType: 'magic',
        action: 'spin',
        funFact: '我们美丽的蓝色家园——地球！'
      },
      {
        name: 'Eagle',
        nameCn: '雄鹰',
        emoji: '🦅',
        color: '#92400E',
        soundType: 'swoosh',
        action: 'float',
        funFact: '大雄鹰展开双翅在蓝天翱翔！'
      }
    ]
  },
  F: {
    letter: 'F',
    phonics: '/f/ 佛',
    color: '#EC4899',
    items: [
      {
        name: 'Fish',
        nameCn: '金鱼',
        emoji: '🐠',
        color: '#F97316',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '吐泡泡的小金鱼在珊瑚海里穿梭！'
      },
      {
        name: 'Frog',
        nameCn: '小青蛙',
        emoji: '🐸',
        color: '#10B981',
        soundType: 'quack',
        action: 'bounce',
        funFact: '呱呱呱，绿青蛙荷叶上跳高高！'
      },
      {
        name: 'Fox',
        nameCn: '小狐狸',
        emoji: '🦊',
        color: '#EA580C',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '聪明机灵的小狐狸有着蓬松大尾巴！'
      },
      {
        name: 'Flower',
        nameCn: '向日葵',
        emoji: '🌻',
        color: '#EAB308',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '向日葵迎着灿烂阳光露出大笑脸！'
      }
    ]
  },
  G: {
    letter: 'G',
    phonics: '/ɡ/ 哥',
    color: '#14B8A6',
    items: [
      {
        name: 'Giraffe',
        nameCn: '长颈鹿',
        emoji: '🦒',
        color: '#F59E0B',
        soundType: 'boing',
        action: 'bounce',
        funFact: '长颈鹿长长的脖子可以吃到最高处的树叶！'
      },
      {
        name: 'Grapes',
        nameCn: '葡萄',
        emoji: '🍇',
        color: '#8B5CF6',
        soundType: 'pop',
        action: 'bounce',
        funFact: '一串串紫色的葡萄甜滋滋、水灵灵！'
      },
      {
        name: 'Guitar',
        nameCn: '吉他',
        emoji: '🎸',
        color: '#EF4444',
        soundType: 'magic',
        action: 'wiggle',
        funFact: '拨动琴弦，吉他弹奏出欢快的旋律！'
      },
      {
        name: 'Gift',
        nameCn: '礼物盒',
        emoji: '🎁',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '系着金丝带的神秘礼物盒，藏着大惊喜！'
      }
    ]
  },
  H: {
    letter: 'H',
    phonics: '/h/ 喝',
    color: '#F97316',
    items: [
      {
        name: 'Heart',
        nameCn: '爱心',
        emoji: '💖',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '扑通扑通，送你一颗充满魔法的七彩爱心！'
      },
      {
        name: 'House',
        nameCn: '城堡小屋',
        emoji: '🏠',
        color: '#EAB308',
        soundType: 'pop',
        action: 'bounce',
        funFact: '暖洋洋的卡通小屋，烟囱正飘出棉花糖烟圈！'
      },
      {
        name: 'Horse',
        nameCn: '小斑马',
        emoji: '🦓',
        color: '#6B7280',
        soundType: 'boing',
        action: 'bounce',
        funFact: '哒哒哒！小斑马穿着条纹衣在草地上奔跑！'
      },
      {
        name: 'Hat',
        nameCn: '魔法帽',
        emoji: '🎩',
        color: '#6366F1',
        soundType: 'magic',
        action: 'wiggle',
        funFact: '魔术师的帽子里会变出可爱小白兔！'
      }
    ]
  },
  I: {
    letter: 'I',
    phonics: '/aɪ/ 矮',
    color: '#06B6D4',
    items: [
      {
        name: 'Ice Cream',
        nameCn: '冰淇淋',
        emoji: '🍦',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'bounce',
        funFact: '甜甜冰凉的草莓甜筒冰淇淋，好想尝一口！'
      },
      {
        name: 'Igloo',
        nameCn: '冰屋',
        emoji: '🧊',
        color: '#38BDF8',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '极地冰块搭建的小冰屋，里面可温暖啦！'
      },
      {
        name: 'Island',
        nameCn: '海岛',
        emoji: '🏝️',
        color: '#10B981',
        soundType: 'magic',
        action: 'float',
        funFact: '长着椰子树的神秘热带海岛！'
      }
    ]
  },
  J: {
    letter: 'J',
    phonics: '/dʒ/ 姐',
    color: '#84CC16',
    items: [
      {
        name: 'Jellyfish',
        nameCn: '水母',
        emoji: '🪼',
        color: '#A855F7',
        soundType: 'magic',
        action: 'float',
        funFact: '透明的小水母在海底发出柔和荧光！'
      },
      {
        name: 'Juice',
        nameCn: '橙汁',
        emoji: '🧃',
        color: '#F97316',
        soundType: 'pop',
        action: 'bounce',
        funFact: '咕噜咕噜，喝一口满是维生素的甜果汁！'
      },
      {
        name: 'Jaguar',
        nameCn: '小豹子',
        emoji: '🐆',
        color: '#EAB308',
        soundType: 'roar',
        action: 'wiggle',
        funFact: '敏捷的小豹子身上有着漂亮的金钱花纹！'
      }
    ]
  },
  K: {
    letter: 'K',
    phonics: '/k/ 渴',
    color: '#EAB308',
    items: [
      {
        name: 'Kangaroo',
        nameCn: '袋鼠',
        emoji: '🦘',
        color: '#B45309',
        soundType: 'boing',
        action: 'bounce',
        funFact: '大袋鼠妈妈肚皮口袋里装着可爱小袋鼠，蹦蹦跳！'
      },
      {
        name: 'Kite',
        nameCn: '风筝',
        emoji: '🪁',
        color: '#EF4444',
        soundType: 'swoosh',
        action: 'float',
        funFact: '春天里，彩虹风筝在天空中越飞越高！'
      },
      {
        name: 'Koala',
        nameCn: '考拉',
        emoji: '🐨',
        color: '#6B7280',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '贪睡的小考拉抱着桉树呼呼大睡！'
      },
      {
        name: 'Key',
        nameCn: '魔法钥匙',
        emoji: '🔑',
        color: '#FBBF24',
        soundType: 'sparkle',
        action: 'spin',
        funFact: '金灿灿的钥匙，能打开秘密藏宝箱！'
      }
    ]
  },
  L: {
    letter: 'L',
    phonics: '/l/ 勒',
    color: '#6366F1',
    items: [
      {
        name: 'Lion',
        nameCn: '狮子王',
        emoji: '🦁',
        color: '#F59E0B',
        soundType: 'roar',
        action: 'bounce',
        funFact: '威武的小狮子顶着大鬃毛，嗷呜一声威风凛凛！'
      },
      {
        name: 'Lemon',
        nameCn: '柠檬',
        emoji: '🍋',
        color: '#FACC15',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '黄澄澄的柠檬酸溜溜，闻起来特别清香！'
      },
      {
        name: 'Lollipop',
        nameCn: '棒棒糖',
        emoji: '🍭',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'spin',
        funFact: '螺旋纹棒棒糖，舔一舔甜到心窝里！'
      },
      {
        name: 'Ladybug',
        nameCn: '七星瓢虫',
        emoji: '🐞',
        color: '#EF4444',
        soundType: 'chime',
        action: 'float',
        funFact: '红底黑点的小瓢虫是花园里的小卫士！'
      }
    ]
  },
  M: {
    letter: 'M',
    phonics: '/m/ 摸',
    color: '#EC4899',
    items: [
      {
        name: 'Monkey',
        nameCn: '小猴子',
        emoji: '🐵',
        color: '#B45309',
        soundType: 'boing',
        action: 'wiggle',
        funFact: '活泼的小猴子在树枝之间荡秋千！'
      },
      {
        name: 'Moon',
        nameCn: '弯弯月亮',
        emoji: '🌙',
        color: '#FDE047',
        soundType: 'magic',
        action: 'float',
        funFact: '月亮像一只金色小船，在夜空中洒下柔光！'
      },
      {
        name: 'Mushroom',
        nameCn: '小蘑菇',
        emoji: '🍄',
        color: '#EF4444',
        soundType: 'pop',
        action: 'bounce',
        funFact: '红白点点的小蘑菇像一把把可爱小雨伞！'
      },
      {
        name: 'Music',
        nameCn: '音符',
        emoji: '🎵',
        color: '#8B5CF6',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '快乐的音符在空中跳着轻快的华尔兹！'
      }
    ]
  },
  N: {
    letter: 'N',
    phonics: '/n/ 讷',
    color: '#3B82F6',
    items: [
      {
        name: 'Nest',
        nameCn: '鸟巢',
        emoji: '🪹',
        color: '#78350F',
        soundType: 'chime',
        action: 'bounce',
        funFact: '树杈上暖烘烘的鸟巢，鸟妈妈正在孵宝宝！'
      },
      {
        name: 'Nut',
        nameCn: '坚果',
        emoji: '🌰',
        color: '#92400E',
        soundType: 'pop',
        action: 'bounce',
        funFact: '香喷喷的小栗子是小松鼠最爱的冬粮！'
      },
      {
        name: 'Night',
        nameCn: '星空夜',
        emoji: '🌌',
        color: '#312E81',
        soundType: 'magic',
        action: 'float',
        funFact: '深蓝色的夜空里，无数星星在眨眼睛！'
      }
    ]
  },
  O: {
    letter: 'O',
    phonics: '/ɒ/ 嗷',
    color: '#F97316',
    items: [
      {
        name: 'Owl',
        nameCn: '猫头鹰',
        emoji: '🦉',
        color: '#78350F',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '夜里值班的猫头鹰博士，眼睛又大又圆！'
      },
      {
        name: 'Orange',
        nameCn: '橘子',
        emoji: '🍊',
        color: '#F97316',
        soundType: 'pop',
        action: 'bounce',
        funFact: '饱满多汁的甜橘子，剥开一瓣瓣像小月亮！'
      },
      {
        name: 'Octopus',
        nameCn: '章鱼八爪鱼',
        emoji: '🐙',
        color: '#EC4899',
        soundType: 'boing',
        action: 'wiggle',
        funFact: '章鱼有八条长长的触手，游泳像个小火箭！'
      }
    ]
  },
  P: {
    letter: 'P',
    phonics: '/p/ 坡',
    color: '#A855F7',
    items: [
      {
        name: 'Panda',
        nameCn: '大熊猫',
        emoji: '🐼',
        color: '#1F2937',
        soundType: 'boing',
        action: 'bounce',
        funFact: '国宝大熊猫黑白分明，正在开心啃竹子！'
      },
      {
        name: 'Pig',
        nameCn: '粉红小猪',
        emoji: '🐷',
        color: '#F472B6',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '哼哧哼哧，圆滚滚的小猪在泥坑里玩得真欢！'
      },
      {
        name: 'Pizza',
        nameCn: '披萨饼',
        emoji: '🍕',
        color: '#F59E0B',
        soundType: 'sparkle',
        action: 'spin',
        funFact: '拉丝芝士配上香肠片，热腾腾的超级披萨！'
      },
      {
        name: 'Penguin',
        nameCn: '小企鹅',
        emoji: '🐧',
        color: '#0F172A',
        soundType: 'quack',
        action: 'wiggle',
        funFact: '穿着黑色燕尾服的小企鹅在南极冰面上滑冰！'
      }
    ]
  },
  Q: {
    letter: 'Q',
    phonics: '/kw/ 夸',
    color: '#E11D48',
    items: [
      {
        name: 'Queen',
        nameCn: '女王',
        emoji: '👸',
        color: '#EC4899',
        soundType: 'trumpet',
        action: 'pulse',
        funFact: '头戴闪耀皇冠的女王正在举行皇家舞会！'
      },
      {
        name: 'Quack',
        nameCn: '小鸭嘎嘎',
        emoji: '🦆',
        color: '#EAB308',
        soundType: 'quack',
        action: 'bounce',
        funFact: '小鸭子排成一队：嘎嘎嘎！'
      },
      {
        name: 'Question',
        nameCn: '问号小精灵',
        emoji: '❓',
        color: '#3B82F6',
        soundType: 'magic',
        action: 'spin',
        funFact: '每个问号背后，都藏着一个有趣的小秘密！'
      }
    ]
  },
  R: {
    letter: 'R',
    phonics: '/r/ 日',
    color: '#EF4444',
    items: [
      {
        name: 'Rainbow',
        nameCn: '彩虹',
        emoji: '🌈',
        color: '#3B82F6',
        soundType: 'sparkle',
        action: 'pulse',
        funFact: '雨过天晴，七色彩虹像一座空中彩桥！'
      },
      {
        name: 'Rabbit',
        nameCn: '小白兔',
        emoji: '🐰',
        color: '#FB7185',
        soundType: 'boing',
        action: 'bounce',
        funFact: '两只长耳朵竖起来，蹦蹦跳跳真可爱！'
      },
      {
        name: 'Rocket',
        nameCn: '小火箭',
        emoji: '🚀',
        color: '#DC2626',
        soundType: 'swoosh',
        action: 'float',
        funFact: '倒计时 3-2-1，火箭喷射金色火焰升空！'
      },
      {
        name: 'Robot',
        nameCn: '智能机器人',
        emoji: '🤖',
        color: '#6B7280',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '哔哩哔哩！机器人为你跳一段机械舞！'
      }
    ]
  },
  S: {
    letter: 'S',
    phonics: '/s/ 思',
    color: '#F59E0B',
    items: [
      {
        name: 'Sun',
        nameCn: '太阳公公',
        emoji: '☀️',
        color: '#F59E0B',
        soundType: 'sparkle',
        action: 'spin',
        funFact: '太阳公公微笑着把温暖光芒洒满大地！'
      },
      {
        name: 'Star',
        nameCn: '小星星',
        emoji: '⭐',
        color: '#FBBF24',
        soundType: 'magic',
        action: 'pulse',
        funFact: '一闪一闪亮晶晶，满天都是小星星！'
      },
      {
        name: 'Strawberry',
        nameCn: '草莓',
        emoji: '🍓',
        color: '#EF4444',
        soundType: 'pop',
        action: 'bounce',
        funFact: '红彤彤、酸甜可口的草莓宝宝！'
      },
      {
        name: 'Snowman',
        nameCn: '小雪人',
        emoji: '⛄',
        color: '#38BDF8',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '胡萝卜鼻子、围着红围巾的可爱小雪人！'
      }
    ]
  },
  T: {
    letter: 'T',
    phonics: '/t/ 特',
    color: '#10B981',
    items: [
      {
        name: 'Tiger',
        nameCn: '小老虎',
        emoji: '🐯',
        color: '#EA580C',
        soundType: 'roar',
        action: 'bounce',
        funFact: '森林百兽之王小老虎，额头有个帅气的王字！'
      },
      {
        name: 'Train',
        nameCn: '托马斯小火车',
        emoji: '🚂',
        color: '#2563EB',
        soundType: 'swoosh',
        action: 'bounce',
        funFact: '呜——咔嚓咔嚓！小火车开过山洞啦！'
      },
      {
        name: 'Tree',
        nameCn: '大树',
        emoji: '🌳',
        color: '#059669',
        soundType: 'pop',
        action: 'pulse',
        funFact: '茂盛的大树为小鸟们提供遮阴的小家！'
      },
      {
        name: 'Turtle',
        nameCn: '小乌龟',
        emoji: '🐢',
        color: '#10B981',
        soundType: 'chime',
        action: 'wiggle',
        funFact: '背着坚硬小房子的小乌龟，一步一步慢慢爬！'
      }
    ]
  },
  U: {
    letter: 'U',
    phonics: '/ʌ/ 呃',
    color: '#8B5CF6',
    items: [
      {
        name: 'Umbrella',
        nameCn: '雨伞',
        emoji: '☂️',
        color: '#8B5CF6',
        soundType: 'pop',
        action: 'wiggle',
        funFact: '下雨天撑起七彩小伞，在水坑里踩水花！'
      },
      {
        name: 'Unicorn',
        nameCn: '独角兽',
        emoji: '🦄',
        color: '#EC4899',
        soundType: 'magic',
        action: 'float',
        funFact: '传说中额头有金色魔法角的彩虹独角兽！'
      },
      {
        name: 'UFO',
        nameCn: '飞碟',
        emoji: '🛸',
        color: '#10B981',
        soundType: 'swoosh',
        action: 'spin',
        funFact: '外星人开着发光的飞碟来地球做客啦！'
      }
    ]
  },
  V: {
    letter: 'V',
    phonics: '/v/ 威',
    color: '#6366F1',
    items: [
      {
        name: 'Violin',
        nameCn: '小提琴',
        emoji: '🎻',
        color: '#B45309',
        soundType: 'magic',
        action: 'wiggle',
        funFact: '优美悠扬的小提琴声，像小溪水在欢唱！'
      },
      {
        name: 'Volcano',
        nameCn: '小火山',
        emoji: '🌋',
        color: '#EF4444',
        soundType: 'boing',
        action: 'pulse',
        funFact: '咕噜咕噜，火山喷出了彩色的泡泡和烟圈！'
      },
      {
        name: 'Van',
        nameCn: '小货车',
        emoji: '🚐',
        color: '#3B82F6',
        soundType: 'swoosh',
        action: 'bounce',
        funFact: '满载新鲜蔬菜水果的露营小房车！'
      }
    ]
  },
  W: {
    letter: 'W',
    phonics: '/w/ 窝',
    color: '#0EA5E9',
    items: [
      {
        name: 'Whale',
        nameCn: '大鲸鱼',
        emoji: '🐳',
        color: '#0284C7',
        soundType: 'magic',
        action: 'float',
        funFact: '蔚蓝深海里，大鲸鱼喷出一道高高的水柱喷泉！'
      },
      {
        name: 'Watermelon',
        nameCn: '西瓜',
        emoji: '🍉',
        color: '#10B981',
        soundType: 'pop',
        action: 'bounce',
        funFact: '夏天吃上一口冰甜的大西瓜，清凉解渴！'
      },
      {
        name: 'Windmill',
        nameCn: '大风车',
        emoji: '🛞',
        color: '#F59E0B',
        soundType: 'swoosh',
        action: 'spin',
        funFact: '微风轻轻吹拂，大风车呼噜噜转个不停！'
      }
    ]
  },
  X: {
    letter: 'X',
    phonics: '/ks/ 克丝',
    color: '#D946EF',
    items: [
      {
        name: 'Xylophone',
        nameCn: '木琴',
        emoji: '🪗',
        color: '#EC4899',
        soundType: 'sparkle',
        action: 'bounce',
        funFact: '叮叮咚咚！七彩木琴敲出美妙动听的音符！'
      },
      {
        name: 'X-ray',
        nameCn: '透视光波',
        emoji: '🩻',
        color: '#06B6D4',
        soundType: 'magic',
        action: 'pulse',
        funFact: '神奇的透视光线，能看见骨骼的秘密！'
      }
    ]
  },
  Y: {
    letter: 'Y',
    phonics: '/j/ 耶',
    color: '#FACC15',
    items: [
      {
        name: 'Yo-Yo',
        nameCn: '悠悠球',
        emoji: '🪀',
        color: '#10B981',
        soundType: 'boing',
        action: 'spin',
        funFact: '上下飞舞的悠悠球，像杂技小精灵！'
      },
      {
        name: 'Yacht',
        nameCn: '帆船',
        emoji: '⛵',
        color: '#0284C7',
        soundType: 'swoosh',
        action: 'float',
        funFact: '迎风张开白帆，向着碧海远航！'
      },
      {
        name: 'Yarn',
        nameCn: '毛线球',
        emoji: '🧶',
        color: '#F43F5E',
        soundType: 'pop',
        action: 'bounce',
        funFact: '毛茸茸的彩线球，小猫最喜欢的玩具！'
      }
    ]
  },
  Z: {
    letter: 'Z',
    phonics: '/z/ 滋',
    color: '#14B8A6',
    items: [
      {
        name: 'Zebra',
        nameCn: '斑马',
        emoji: '🦓',
        color: '#374151',
        soundType: 'boing',
        action: 'bounce',
        funFact: '黑白相间条纹的斑马在广袤大草原上欢快奔跑！'
      },
      {
        name: 'Zoo',
        nameCn: '动物园',
        emoji: '🦁',
        color: '#16A34A',
        soundType: 'trumpet',
        action: 'pulse',
        funFact: '动物园里有好多奇妙的好朋友！'
      }
    ]
  }
};

export const NUMBERS_DATA: NumberData[] = [
  {
    num: 0,
    name: 'Zero',
    nameCn: '零',
    pinyin: 'líng',
    emoji: '🥚',
    color: '#64748B',
    note: 'C4',
    freq: 261.63,
    countItem: { emoji: '🥚', nameCn: '个神奇蛋' },
    funFact: '圆圆的数字 0，像一颗饱满的鹅蛋！'
  },
  {
    num: 1,
    name: 'One',
    nameCn: '一',
    pinyin: 'yī',
    emoji: '🐥',
    color: '#EF4444',
    note: 'D4',
    freq: 293.66,
    countItem: { emoji: '🐥', nameCn: '只小毛鸡' },
    funFact: '数字 1 像一根竖直挺拔的小铅笔！'
  },
  {
    num: 2,
    name: 'Two',
    nameCn: '二',
    pinyin: 'èr',
    emoji: '🦆',
    color: '#F97316',
    note: 'E4',
    freq: 329.63,
    countItem: { emoji: '🦆', nameCn: '只小天鹅' },
    funFact: '数字 2 像一只游在水里的小天鹅！'
  },
  {
    num: 3,
    name: 'Three',
    nameCn: '三',
    pinyin: 'sān',
    emoji: '🦋',
    color: '#EAB308',
    note: 'F4',
    freq: 349.23,
    countItem: { emoji: '🦋', nameCn: '只彩蝴蝶' },
    funFact: '数字 3 像两只弯弯的小耳朵！'
  },
  {
    num: 4,
    name: 'Four',
    nameCn: '四',
    pinyin: 'sì',
    emoji: '🐸',
    color: '#10B981',
    note: 'G4',
    freq: 392.0,
    countItem: { emoji: '🐸', nameCn: '只跳跳蛙' },
    funFact: '数字 4 像随风飘扬的彩色小红旗！'
  },
  {
    num: 5,
    name: 'Five',
    nameCn: '五',
    pinyin: 'wǔ',
    emoji: '⭐',
    color: '#06B6D4',
    note: 'A4',
    freq: 440.0,
    countItem: { emoji: '⭐', nameCn: '颗金星星' },
    funFact: '数字 5 像一只结实有力的小铁钩！'
  },
  {
    num: 6,
    name: 'Six',
    nameCn: '六',
    pinyin: 'liù',
    emoji: '🐬',
    color: '#3B82F6',
    note: 'B4',
    freq: 493.88,
    countItem: { emoji: '🐬', nameCn: '只海豚宝宝' },
    funFact: '数字 6 像一把吹出欢快音乐的小哨子！'
  },
  {
    num: 7,
    name: 'Seven',
    nameCn: '七',
    pinyin: 'qī',
    emoji: '🌈',
    color: '#8B5CF6',
    note: 'C5',
    freq: 523.25,
    countItem: { emoji: '🌈', nameCn: '道七彩虹' },
    funFact: '数字 7 像爷爷手中的拐杖，站得稳稳当当！'
  },
  {
    num: 8,
    name: 'Eight',
    nameCn: '八',
    pinyin: 'bā',
    emoji: '🐙',
    color: '#EC4899',
    note: 'D5',
    freq: 587.33,
    countItem: { emoji: '🐙', nameCn: '只小章鱼' },
    funFact: '数字 8 像一个圆滚滚、喜气洋洋的小雪人！'
  },
  {
    num: 9,
    name: 'Nine',
    nameCn: '九',
    pinyin: 'jiǔ',
    emoji: '🎈',
    color: '#F43F5E',
    note: 'E5',
    freq: 659.25,
    countItem: { emoji: '🎈', nameCn: '个大热气球' },
    funFact: '数字 9 像一个系着长绳飘上天空的红气球！'
  }
];

export const EASTER_EGG_WORDS: EasterEggWord[] = [
  {
    word: 'CAT',
    nameCn: '小猫咪',
    emoji: '🐱',
    themeColor: '#F97316',
    title: '🐱 喵喵小猫狂欢节！',
    desc: '哇！你拼出了小猫 CAT！小猫咪正在为你跳彩带舞！',
    audioPrompt: 'Cat! 小猫咪！喵喵喵！'
  },
  {
    word: 'DOG',
    nameCn: '小狗狗',
    emoji: '🐶',
    themeColor: '#EAB308',
    title: '🐶 汪汪小狗接飞盘！',
    desc: '太棒了！拼出了 DOG！小狗摇着尾巴接住了金星星！',
    audioPrompt: 'Dog! 小狗！汪汪汪！'
  },
  {
    word: 'SUN',
    nameCn: '太阳公公',
    emoji: '☀️',
    themeColor: '#F59E0B',
    title: '☀️ 温暖太阳大派对！',
    desc: '金光闪闪的 SUN 升起来啦，整个世界都充满了彩虹光芒！',
    audioPrompt: 'Sun! 太阳公公出来啦！'
  },
  {
    word: 'CAR',
    nameCn: '极速小赛车',
    emoji: '🚗',
    themeColor: '#EF4444',
    title: '🚗 轰隆隆赛车冲锋！',
    desc: '超级赛车 CAR 喷着彩虹尾气穿过终点线！',
    audioPrompt: 'Car! 小汽车！嘀嘀叭叭！'
  },
  {
    word: 'BUS',
    nameCn: '彩虹大巴士',
    emoji: '🚌',
    themeColor: '#3B82F6',
    title: '🚌 嘟嘟巴士出发啦！',
    desc: 'BUS 载满了所有动物好朋友去野餐旅行！',
    audioPrompt: 'Bus! 大巴士出发！'
  },
  {
    word: 'PIG',
    nameCn: '佩奇小猪',
    emoji: '🐷',
    themeColor: '#F472B6',
    title: '🐷 快乐小猪踩水坑！',
    desc: 'PIG 在泥坑里溅出了七彩水果味糖果水花！',
    audioPrompt: 'Pig! 小猪！呼噜呼噜！'
  },
  {
    word: 'FOX',
    nameCn: '神秘小狐狸',
    emoji: '🦊',
    themeColor: '#EA580C',
    title: '🦊 魔法狐狸变身术！',
    desc: '机灵的小狐狸 FOX 变出了满满一树的金色浆果！',
    audioPrompt: 'Fox! 小狐狸！'
  },
  {
    word: 'FLY',
    nameCn: '飞翔小鸟',
    emoji: '🕊️',
    themeColor: '#06B6D4',
    title: '🕊️ 展翅高飞天空之歌！',
    desc: '小鸟带着梦想 FLY 飞过了白云与彩虹！',
    audioPrompt: 'Fly! 飞翔！'
  },
  {
    word: 'STAR',
    nameCn: '流星雨',
    emoji: '⭐',
    themeColor: '#FACC15',
    title: '⭐ 许愿璀璨流星雨！',
    desc: '漫天流星划过夜空，为你送来无数星愿！',
    audioPrompt: 'Star! 满天繁星！'
  },
  {
    word: 'FISH',
    nameCn: '七彩神仙鱼',
    emoji: '🐠',
    themeColor: '#10B981',
    title: '🐠 梦幻深海泡泡秀！',
    desc: '神仙鱼 FISH 吐出了晶莹剔透的彩虹大泡泡！',
    audioPrompt: 'Fish! 小鱼游啊游！'
  },
  {
    word: 'LOVE',
    nameCn: '满满爱心',
    emoji: '💖',
    themeColor: '#EC4899',
    title: '💖 超级爱心大风暴！',
    desc: 'LOVE 魔法启动！无数爱心在全屏温柔盛开！',
    audioPrompt: 'Love! 满满的爱！'
  },
  {
    word: 'RAIN',
    nameCn: '糖果彩虹雨',
    emoji: '🌧️',
    themeColor: '#38BDF8',
    title: '🌧️ 滴答滴答糖果雨！',
    desc: '天空下起了美味的软糖雨和巧克力豆！',
    audioPrompt: 'Rain! 下雨啦，糖果雨！'
  },
  {
    word: 'ICE',
    nameCn: '冰雪奇缘',
    emoji: '❄️',
    themeColor: '#A5F3FC',
    title: '❄️ 晶莹冰雪魔法结晶！',
    desc: '呼呼呼~ 冰雪仙子把舞台变成了闪耀的滑冰场！',
    audioPrompt: 'Ice! 冰晶魔法！'
  },
  {
    word: 'BEE',
    nameCn: '勤劳小蜜蜂',
    emoji: '🐝',
    themeColor: '#FBBF24',
    title: '🐝 嗡嗡采蜜大丰收！',
    desc: '小蜜蜂酿造出了香甜浓郁的七彩蜂蜜！',
    audioPrompt: 'Bee! 小蜜蜂嗡嗡嗡！'
  }
];

export const WORLD_THEMES: WorldTheme[] = [
  {
    id: 'garden',
    nameCn: '阳光乐园',
    nameEn: 'Sunny Garden',
    icon: '🌻',
    bgGradient: 'from-sky-400 via-teal-300 to-emerald-400',
    groundColor: '#10B981',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    ambientEmoji: ['☁️', '🌸', '🌼', '🐝', '🌿', '🍄', '🐞'],
    particleColor: ['#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#F87171'],
    mascotName: '萌萌小恐龙',
    mascotEmoji: '🦖'
  },
  {
    id: 'space',
    nameCn: '星际宇宙',
    nameEn: 'Cosmic Galaxy',
    icon: '🚀',
    bgGradient: 'from-indigo-950 via-purple-900 to-slate-950',
    groundColor: '#4C1D95',
    cardBg: 'rgba(30, 27, 75, 0.85)',
    ambientEmoji: ['⭐', '✨', '🪐', '🛸', '🌙', '☄️', '🌌'],
    particleColor: ['#A78BFA', '#F472B6', '#38BDF8', '#FDE047', '#C084FC'],
    mascotName: '宇航星宝熊',
    mascotEmoji: '🐻‍❄️'
  },
  {
    id: 'ocean',
    nameCn: '梦幻深海',
    nameEn: 'Ocean Wonders',
    icon: '🐠',
    bgGradient: 'from-cyan-600 via-blue-600 to-indigo-900',
    groundColor: '#0369A1',
    cardBg: 'rgba(12, 74, 110, 0.85)',
    ambientEmoji: ['🫧', '🪸', '🐚', '🦀', '🪼', '🐬', '🐙'],
    particleColor: ['#67E8F9', '#38BDF8', '#818CF8', '#A7F3D0', '#FDE047'],
    mascotName: '欢欢小海豚',
    mascotEmoji: '🐬'
  },
  {
    id: 'candy',
    nameCn: '甜蜜糖果屋',
    nameEn: 'Candy Kingdom',
    icon: '🍭',
    bgGradient: 'from-pink-400 via-rose-300 to-amber-200',
    groundColor: '#FB7185',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    ambientEmoji: ['🍬', '🍭', '🧁', '🍩', '🍫', '🍓', '✨'],
    particleColor: ['#F43F5E', '#EC4899', '#FB7185', '#FBBF24', '#C084FC'],
    mascotName: '糖糖小白兔',
    mascotEmoji: '🐰'
  },
  {
    id: 'dino',
    nameCn: '远古恐龙谷',
    nameEn: 'Dino Jungle',
    icon: '🦕',
    bgGradient: 'from-emerald-700 via-teal-800 to-amber-900',
    groundColor: '#047857',
    cardBg: 'rgba(6, 78, 59, 0.85)',
    ambientEmoji: ['🌴', '🌋', '🌿', '🥚', '🦕', '🪨', '🍃'],
    particleColor: ['#34D399', '#A3E635', '#F59E0B', '#EF4444', '#10B981'],
    mascotName: '波波剑龙',
    mascotEmoji: '🦕'
  }
];

export const PIANO_INSTRUMENTS = [
  { id: 'xylophone', nameCn: '清脆木琴 🪗', icon: '🪗' },
  { id: 'cat', nameCn: '萌猫叫叫 🐱', icon: '🐱' },
  { id: 'duck', nameCn: '小鸭嘎嘎 🦆', icon: '🦆' },
  { id: 'frog', nameCn: '青蛙呱呱 🐸', icon: '🐸' },
  { id: 'harp', nameCn: '梦幻竖琴 🎶', icon: '🎶' },
  { id: 'drum', nameCn: '快乐鼓点 🥁', icon: '🥁' }
];

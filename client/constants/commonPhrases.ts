/**
 * 常用对话数据
 * 按语言和场景分类，方便用户学习
 */

import { LanguageCode } from './languages';

// 场景类型
export type PhraseCategory = 
  | 'greetings'      // 问候
  | 'time_date'      // 时间日期
  | 'weather'        // 天气
  | 'hotel'          // 酒店
  | 'restaurant'     // 餐厅
  | 'shopping'       // 购物
  | 'transport'      // 交通
  | 'emergency';     // 紧急情况

// 场景名称
export const categoryNames: Record<PhraseCategory, string> = {
  greetings: '日常问候',
  time_date: '时间日期',
  weather: '天气话题',
  hotel: '酒店入住',
  restaurant: '餐厅用餐',
  shopping: '购物消费',
  transport: '交通出行',
  emergency: '紧急情况',
};

// 对话项
export interface PhraseItem {
  source: string;     // 中文
  target: string;     // 目标语言
  pronunciation?: string; // 发音提示（可选）
}

// 场景对话
export interface CategoryPhrases {
  category: PhraseCategory;
  phrases: PhraseItem[];
}

// 各语言的常用对话数据
export const commonPhrases: Partial<Record<LanguageCode, CategoryPhrases[]>> = {
  // 英语
  en: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'Hello', pronunciation: '/həˈloʊ/' },
        { source: '早上好', target: 'Good morning', pronunciation: '/ɡʊd ˈmɔːrnɪŋ/' },
        { source: '下午好', target: 'Good afternoon', pronunciation: '/ɡʊd ˌæftərˈnuːn/' },
        { source: '晚上好', target: 'Good evening', pronunciation: '/ɡʊd ˈiːvnɪŋ/' },
        { source: '晚安', target: 'Good night', pronunciation: '/ɡʊd naɪt/' },
        { source: '很高兴认识你', target: 'Nice to meet you', pronunciation: '/naɪs tuː miːt juː/' },
        { source: '好久不见', target: 'Long time no see', pronunciation: '/lɔːŋ taɪm noʊ siː/' },
        { source: '你好吗？', target: 'How are you?', pronunciation: '/haʊ ɑːr juː/' },
      ],
    },
    {
      category: 'time_date',
      phrases: [
        { source: '今天星期几？', target: 'What day is it today?' },
        { source: '星期一', target: 'Monday' },
        { source: '星期二', target: 'Tuesday' },
        { source: '星期三', target: 'Wednesday' },
        { source: '星期四', target: 'Thursday' },
        { source: '星期五', target: 'Friday' },
        { source: '星期六', target: 'Saturday' },
        { source: '星期日', target: 'Sunday' },
        { source: '现在几点了？', target: 'What time is it now?' },
        { source: '今天几号？', target: 'What is the date today?' },
      ],
    },
    {
      category: 'weather',
      phrases: [
        { source: '今天天气怎么样？', target: 'How is the weather today?' },
        { source: '天气很好', target: 'The weather is nice' },
        { source: '天气很热', target: 'It is very hot' },
        { source: '天气很冷', target: 'It is very cold' },
        { source: '今天下雨', target: 'It is raining today' },
        { source: '明天会晴吗？', target: 'Will it be sunny tomorrow?' },
        { source: '气温多少度？', target: 'What is the temperature?' },
        { source: '记得带伞', target: 'Remember to bring an umbrella' },
      ],
    },
    {
      category: 'hotel',
      phrases: [
        { source: '我想办理入住', target: 'I would like to check in' },
        { source: '我有预订', target: 'I have a reservation' },
        { source: '请问早餐几点？', target: 'What time is breakfast?' },
        { source: '可以延迟退房吗？', target: 'Can I have a late check-out?' },
        { source: '房间有WiFi吗？', target: 'Is there WiFi in the room?' },
        { source: 'WiFi密码是多少？', target: 'What is the WiFi password?' },
        { source: '可以给我额外的毛巾吗？', target: 'Can I have extra towels?' },
        { source: '我想换房间', target: 'I would like to change my room' },
      ],
    },
    {
      category: 'restaurant',
      phrases: [
        { source: '请问有位置吗？', target: 'Do you have a table available?' },
        { source: '我可以看菜单吗？', target: 'Can I see the menu?' },
        { source: '我想要这个', target: 'I would like this one' },
        { source: '这个辣吗？', target: 'Is this spicy?' },
        { source: '可以不加香菜吗？', target: 'Can I have it without coriander?' },
        { source: '请给我一杯水', target: 'A glass of water, please' },
        { source: '买单', target: 'Check, please' },
        { source: '很好吃', target: 'It is delicious' },
      ],
    },
    {
      category: 'shopping',
      phrases: [
        { source: '这个多少钱？', target: 'How much is this?' },
        { source: '太贵了', target: 'It is too expensive' },
        { source: '可以便宜一点吗？', target: 'Can you give me a discount?' },
        { source: '可以刷卡吗？', target: 'Can I pay by card?' },
        { source: '我试试这个', target: 'I would like to try this on' },
        { source: '有其他颜色吗？', target: 'Do you have other colors?' },
        { source: '有小一点的吗？', target: 'Do you have a smaller size?' },
        { source: '我买了', target: 'I will take it' },
      ],
    },
    {
      category: 'transport',
      phrases: [
        { source: '请问车站在哪里？', target: 'Where is the station?' },
        { source: '这趟车去...吗？', target: 'Does this bus go to...?' },
        { source: '多少钱一张票？', target: 'How much is a ticket?' },
        { source: '到...要多久？', target: 'How long does it take to get to...?' },
        { source: '请告诉我什么时候下车', target: 'Please let me know when to get off' },
        { source: '可以叫出租车吗？', target: 'Can you call a taxi?' },
        { source: '去机场', target: 'To the airport, please' },
        { source: '最近的地铁站在哪？', target: 'Where is the nearest subway station?' },
      ],
    },
    {
      category: 'emergency',
      phrases: [
        { source: '救命！', target: 'Help!' },
        { source: '报警', target: 'Call the police' },
        { source: '我叫救护车', target: 'Call an ambulance' },
        { source: '我迷路了', target: 'I am lost' },
        { source: '我的护照丢了', target: 'I lost my passport' },
        { source: '我不舒服', target: 'I do not feel well' },
        { source: '可以帮我吗？', target: 'Can you help me?' },
        { source: '请带我去医院', target: 'Please take me to the hospital' },
      ],
    },
  ],

  // 乌尔都语
  ur: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'السلام علیکم', pronunciation: 'Assalam-o-Alaikum' },
        { source: '你好吗？', target: 'آپ کیسے ہیں؟', pronunciation: 'Aap kaise hain?' },
        { source: '谢谢', target: 'شکریہ', pronunciation: 'Shukriya' },
        { source: '再见', target: 'خدا حافظ', pronunciation: 'Khuda Hafiz' },
        { source: '早上好', target: 'صبح بخیر', pronunciation: 'Subah bakhair' },
        { source: '晚安', target: 'شب بخیر', pronunciation: 'Raat bakhair' },
      ],
    },
    {
      category: 'time_date',
      phrases: [
        { source: '今天星期几？', target: 'آج کون سا دن ہے؟', pronunciation: 'Aaj kaun sa din hai?' },
        { source: '星期一', target: 'پیر', pronunciation: 'Peer' },
        { source: '星期二', target: 'منگل', pronunciation: 'Mangal' },
        { source: '星期三', target: 'بدھ', pronunciation: 'Budh' },
        { source: '星期四', target: 'جمعرات', pronunciation: 'Jumerat' },
        { source: '星期五', target: 'جمعہ', pronunciation: 'Juma' },
        { source: '星期六', target: 'ہفتہ', pronunciation: 'Hafta' },
        { source: '星期日', target: 'اتوار', pronunciation: 'Itwar' },
      ],
    },
    {
      category: 'weather',
      phrases: [
        { source: '今天天气怎么样？', target: 'آج موسم کیسا ہے؟', pronunciation: 'Aaj mausam kaisa hai?' },
        { source: '天气很热', target: 'موسم بہت گرم ہے', pronunciation: 'Mausam bohat garam hai' },
        { source: '今天下雨', target: 'آج بارش ہو رہی ہے', pronunciation: 'Aaj barish ho rahi hai' },
      ],
    },
    {
      category: 'hotel',
      phrases: [
        { source: '我想办理入住', target: 'میں چیک ان کرنا چاہتا ہوں', pronunciation: 'Main check-in karna chahta hoon' },
        { source: '我有预订', target: 'میری ریزرویشن ہے', pronunciation: 'Meri reservation hai' },
        { source: '房间有WiFi吗？', target: 'کمرے میں وائی فائی ہے؟', pronunciation: 'Kamray mein WiFi hai?' },
      ],
    },
    {
      category: 'restaurant',
      phrases: [
        { source: '请问有位置吗？', target: 'کیا جگہ خالی ہے؟', pronunciation: 'Kya jagah khali hai?' },
        { source: '买单', target: 'بل دے دیں', pronunciation: 'Bill de dein' },
        { source: '很好吃', target: 'بہت مزیدار ہے', pronunciation: 'Bohat mazaidar hai' },
      ],
    },
  ],

  // 日语
  ja: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'こんにちは', pronunciation: 'Konnichiwa' },
        { source: '早上好', target: 'おはようございます', pronunciation: 'Ohayou gozaimasu' },
        { source: '晚上好', target: 'こんばんは', pronunciation: 'Konbanwa' },
        { source: '谢谢', target: 'ありがとうございます', pronunciation: 'Arigatou gozaimasu' },
        { source: '再见', target: 'さようなら', pronunciation: 'Sayounara' },
        { source: '对不起', target: 'すみません', pronunciation: 'Sumimasen' },
      ],
    },
    {
      category: 'time_date',
      phrases: [
        { source: '星期一', target: '月曜日', pronunciation: 'Getsuyoubi' },
        { source: '星期二', target: '火曜日', pronunciation: 'Kayoubi' },
        { source: '星期三', target: '水曜日', pronunciation: 'Suiyoubi' },
        { source: '星期四', target: '木曜日', pronunciation: 'Mokuyoubi' },
        { source: '星期五', target: '金曜日', pronunciation: 'Kinyoubi' },
        { source: '星期六', target: '土曜日', pronunciation: 'Doyoubi' },
        { source: '星期日', target: '日曜日', pronunciation: 'Nichiyoubi' },
      ],
    },
    {
      category: 'restaurant',
      phrases: [
        { source: '请给我菜单', target: 'メニューをお願いします', pronunciation: 'Menu wo onegaishimasu' },
        { source: '这个多少钱？', target: 'これはいくらですか？', pronunciation: 'Kore wa ikura desu ka?' },
        { source: '很好吃', target: 'おいしいです', pronunciation: 'Oishii desu' },
      ],
    },
  ],

  // 韩语
  ko: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: '안녕하세요', pronunciation: 'Annyeonghaseyo' },
        { source: '谢谢', target: '감사합니다', pronunciation: 'Gamsahamnida' },
        { source: '再见', target: '안녕히 가세요', pronunciation: 'Annyeonghi gaseyo' },
        { source: '对不起', target: '죄송합니다', pronunciation: 'Joesonghamnida' },
      ],
    },
    {
      category: 'time_date',
      phrases: [
        { source: '星期一', target: '월요일', pronunciation: 'Woryoil' },
        { source: '星期二', target: '화요일', pronunciation: 'Hwayoil' },
        { source: '星期三', target: '수요일', pronunciation: 'Suyoil' },
        { source: '星期四', target: '목요일', pronunciation: 'Mogyoil' },
        { source: '星期五', target: '금요일', pronunciation: 'Geumyoil' },
        { source: '星期六', target: '토요일', pronunciation: 'Toyoil' },
        { source: '星期日', target: '일요일', pronunciation: 'Iryoil' },
      ],
    },
  ],

  // 泰语
  th: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'สวัสดีครับ/ค่ะ', pronunciation: 'Sawatdee krub/ka' },
        { source: '谢谢', target: 'ขอบคุณครับ/ค่ะ', pronunciation: 'Khob khun krub/ka' },
        { source: '再见', target: 'ลาก่อนครับ/ค่ะ', pronunciation: 'La gon krub/ka' },
      ],
    },
    {
      category: 'shopping',
      phrases: [
        { source: '多少钱？', target: 'เท่าไหร่ครับ/คะ?', pronunciation: 'Tao rai krub/ka?' },
        { source: '太贵了', target: 'แพงไปครับ/คะ', pronunciation: 'Paeng pai krub/ka' },
        { source: '可以便宜一点吗？', target: 'ลดหน่อยได้ไหมครับ/คะ?', pronunciation: 'Lod noi dai mai krub/ka?' },
      ],
    },
  ],

  // 越南语
  vi: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'Xin chào', pronunciation: 'Sin chào' },
        { source: '谢谢', target: 'Cảm ơn', pronunciation: 'Gảm ơn' },
        { source: '再见', target: 'Tạm biệt', pronunciation: 'Tạm biệt' },
      ],
    },
    {
      category: 'restaurant',
      phrases: [
        { source: '买单', target: 'Tính tiền', pronunciation: 'Tính tiền' },
        { source: '很好吃', target: 'Ngon quá', pronunciation: 'Ngon quá' },
      ],
    },
  ],

  // 印尼语
  id: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'Halo / Apa kabar?', pronunciation: 'Halo / Apa kabar?' },
        { source: '谢谢', target: 'Terima kasih', pronunciation: 'Terima kasih' },
        { source: '再见', target: 'Selamat tinggal', pronunciation: 'Selamat tinggal' },
      ],
    },
    {
      category: 'shopping',
      phrases: [
        { source: '多少钱？', target: 'Berapa harganya?', pronunciation: 'Berapa harganya?' },
        { source: '太贵了', target: 'Terlalu mahal', pronunciation: 'Terlalu mahal' },
      ],
    },
  ],

  // 马来语
  ms: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'Apa khabar?', pronunciation: 'Apa khabar?' },
        { source: '谢谢', target: 'Terima kasih', pronunciation: 'Terima kasih' },
        { source: '再见', target: 'Selamat tinggal', pronunciation: 'Selamat tinggal' },
      ],
    },
  ],

  // 阿拉伯语
  ar: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'مرحباً', pronunciation: 'Marhaban' },
        { source: '谢谢', target: 'شكراً', pronunciation: 'Shukran' },
        { source: '再见', target: 'مع السلامة', pronunciation: 'Ma\'a salama' },
      ],
    },
  ],

  // 波斯语
  fa: [
    {
      category: 'greetings',
      phrases: [
        { source: '你好', target: 'سلام', pronunciation: 'Salaam' },
        { source: '谢谢', target: 'ممنون', pronunciation: 'Mamnoon' },
        { source: '再见', target: 'خداحافظ', pronunciation: 'Khoda hafez' },
      ],
    },
  ],
};

// 获取某个语言的常用对话
export const getPhrasesForLanguage = (lang: LanguageCode): CategoryPhrases[] => {
  return commonPhrases[lang] || commonPhrases['en'] || [];
};

// 获取某个场景的对话
export const getPhrasesByCategory = (
  lang: LanguageCode,
  category: PhraseCategory
): PhraseItem[] => {
  const phrases = commonPhrases[lang];
  if (!phrases) return [];
  const found = phrases.find((p) => p.category === category);
  return found?.phrases || [];
};

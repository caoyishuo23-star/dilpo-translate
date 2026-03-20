/**
 * 语言配置文件
 * 包含所有支持的语种，按常用程度+地区分类
 */

// 语言代码类型
export type LanguageCode = 
  // 全球通用核心语言
  | 'en' | 'zh' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'pt' | 'ru' | 'ar'
  // 东南亚小语种
  | 'id' | 'ms' | 'th' | 'vi' | 'tl' | 'km' | 'lo' | 'my' | 'jv' | 'su'
  // 南亚小语种
  | 'ur' | 'hi' | 'bn' | 'ne' | 'pa' | 'si' | 'ta' | 'gu'
  // 中东 & 中亚小语种
  | 'fa' | 'ps' | 'ku' | 'tr' | 'kk' | 'uz' | 'ky' | 'tg'
  // 欧洲小众 & 东欧语种
  | 'nl' | 'sv' | 'da' | 'no' | 'fi' | 'pl' | 'cs' | 'hu' | 'ro' | 'bg' | 'sr' | 'hr'
  // 非洲常用语种
  | 'sw' | 'ha' | 'yo' | 'ig' | 'zu' | 'am' | 'so'
  // 拉美 & 其他小语种
  | 'qu' | 'mi' | 'haw' | 'eo'
  // 自动检测
  | 'auto';

// 语言信息接口
export interface LanguageInfo {
  code: LanguageCode;
  name: string; // 英文名称
  nativeName: string; // 本地名称
  category: string; // 分类
  isRTL?: boolean; // 是否从右到左
}

// 所有语言配置
export const languages: LanguageInfo[] = [
  // 自动检测
  { code: 'auto', name: 'Auto Detect', nativeName: '自动检测', category: 'auto', isRTL: false },
  
  // 全球通用核心语言
  { code: 'en', name: 'English', nativeName: 'English', category: 'global', isRTL: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', category: 'global', isRTL: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', category: 'global', isRTL: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', category: 'global', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', category: 'global', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', category: 'global', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', category: 'global', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', category: 'global', isRTL: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', category: 'global', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', category: 'global', isRTL: true },
  
  // 东南亚小语种（重点推荐）
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', category: 'southeast_asia', isRTL: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', category: 'southeast_asia', isRTL: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', category: 'southeast_asia', isRTL: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', category: 'southeast_asia', isRTL: false },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', category: 'southeast_asia', isRTL: false },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', category: 'southeast_asia', isRTL: false },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', category: 'southeast_asia', isRTL: false },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', category: 'southeast_asia', isRTL: false },
  { code: 'jv', name: 'Javanese', nativeName: 'ꦧꦱꦗꦮ', category: 'southeast_asia', isRTL: false },
  { code: 'su', name: 'Sundanese', nativeName: 'ᮘᮞ ᮞᮥᮔ᮪ᮓ', category: 'southeast_asia', isRTL: false },
  
  // 南亚小语种（重点关注）
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', category: 'south_asia', isRTL: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', category: 'south_asia', isRTL: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', category: 'south_asia', isRTL: false },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', category: 'south_asia', isRTL: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', category: 'south_asia', isRTL: false },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', category: 'south_asia', isRTL: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', category: 'south_asia', isRTL: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', category: 'south_asia', isRTL: false },
  
  // 中东 & 中亚小语种
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', category: 'middle_east', isRTL: true },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', category: 'middle_east', isRTL: true },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', category: 'middle_east', isRTL: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', category: 'middle_east', isRTL: false },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', category: 'middle_east', isRTL: false },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', category: 'middle_east', isRTL: false },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', category: 'middle_east', isRTL: false },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', category: 'middle_east', isRTL: false },
  
  // 欧洲小众 & 东欧语种
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', category: 'europe', isRTL: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', category: 'europe', isRTL: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', category: 'europe', isRTL: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', category: 'europe', isRTL: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', category: 'europe', isRTL: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', category: 'europe', isRTL: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', category: 'europe', isRTL: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', category: 'europe', isRTL: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', category: 'europe', isRTL: false },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', category: 'europe', isRTL: false },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', category: 'europe', isRTL: false },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', category: 'europe', isRTL: false },
  
  // 非洲常用语种
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', category: 'africa', isRTL: false },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', category: 'africa', isRTL: false },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', category: 'africa', isRTL: false },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', category: 'africa', isRTL: false },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', category: 'africa', isRTL: false },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', category: 'africa', isRTL: false },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', category: 'africa', isRTL: false },
  
  // 拉美 & 其他小语种
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', category: 'other', isRTL: false },
  { code: 'mi', name: 'Maori', nativeName: 'Māori', category: 'other', isRTL: false },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', category: 'other', isRTL: false },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', category: 'other', isRTL: false },
];

// 分类名称
export const categoryNames: Record<string, string> = {
  auto: '自动检测',
  global: '全球通用',
  southeast_asia: '东南亚',
  south_asia: '南亚',
  middle_east: '中东/中亚',
  europe: '欧洲',
  africa: '非洲',
  other: '其他',
};

// 根据代码获取语言信息
export const getLanguageByCode = (code: LanguageCode): LanguageInfo => {
  return languages.find(lang => lang.code === code) || languages[1]; // 默认返回英语
};

// 获取非自动检测的语言列表
export const getLanguagesWithoutAuto = (): LanguageInfo[] => {
  return languages.filter(lang => lang.code !== 'auto');
};

// 按分类获取语言
export const getLanguagesByCategory = (category: string): LanguageInfo[] => {
  return languages.filter(lang => lang.category === category);
};

// 常用语言（用于快速选择）
export const commonLanguages: LanguageCode[] = ['zh', 'en', 'ur', 'id', 'ms', 'th', 'vi', 'hi', 'fa', 'ar'];

// 黄金组合预设
export const goldenCombinations = [
  { source: 'zh', primary: 'en', secondary: 'ur', name: '中文→英文+乌尔都语' },
  { source: 'zh', primary: 'en', secondary: 'id', name: '中文→英文+印尼语' },
  { source: 'zh', primary: 'en', secondary: 'th', name: '中文→英文+泰语' },
  { source: 'zh', primary: 'en', secondary: 'vi', name: '中文→英文+越南语' },
  { source: 'zh', primary: 'en', secondary: 'ms', name: '中文→英文+马来语' },
  { source: 'zh', primary: 'en', secondary: 'fa', name: '中文→英文+波斯语' },
];

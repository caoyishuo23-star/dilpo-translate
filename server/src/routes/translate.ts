import express, { type Request, type Response } from "express";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

const router = express.Router();

// 语言代码映射 - 扩展支持所有语言
const languageNames: Record<string, string> = {
  auto: "自动检测",
  // 全球通用核心语言
  en: "英语",
  zh: "中文",
  ja: "日语",
  ko: "韩语",
  fr: "法语",
  de: "德语",
  es: "西班牙语",
  pt: "葡萄牙语",
  ru: "俄语",
  ar: "阿拉伯语",
  // 东南亚小语种
  id: "印尼语",
  ms: "马来语",
  th: "泰语",
  vi: "越南语",
  tl: "菲律宾语",
  km: "柬埔寨语",
  lo: "老挝语",
  my: "缅甸语",
  jv: "爪哇语",
  su: "巽他语",
  // 南亚小语种
  ur: "乌尔都语",
  hi: "印地语",
  bn: "孟加拉语",
  ne: "尼泊尔语",
  pa: "旁遮普语",
  si: "僧伽罗语",
  ta: "泰米尔语",
  gu: "古吉拉特语",
  // 中东 & 中亚小语种
  fa: "波斯语",
  ps: "普什图语",
  ku: "库尔德语",
  tr: "土耳其语",
  kk: "哈萨克语",
  uz: "乌兹别克语",
  ky: "吉尔吉斯语",
  tg: "塔吉克语",
  // 欧洲小众 & 东欧语种
  nl: "荷兰语",
  sv: "瑞典语",
  da: "丹麦语",
  no: "挪威语",
  fi: "芬兰语",
  pl: "波兰语",
  cs: "捷克语",
  hu: "匈牙利语",
  ro: "罗马尼亚语",
  bg: "保加利亚语",
  sr: "塞尔维亚语",
  hr: "克罗地亚语",
  // 非洲常用语种
  sw: "斯瓦希里语",
  ha: "豪萨语",
  yo: "约鲁巴语",
  ig: "伊博语",
  zu: "祖鲁语",
  am: "阿姆哈拉语",
  so: "索马里语",
  // 拉美 & 其他小语种
  qu: "克丘亚语",
  mi: "毛利语",
  haw: "夏威夷语",
  eo: "世界语",
};

// 自动检测语种
async function detectLanguage(
  client: LLMClient,
  text: string
): Promise<string> {
  const systemPrompt = `你是一个语言检测专家。请分析以下文本的语言，只返回语言代码，不要有任何其他内容。

语言代码对照表：
en=英语, zh=中文, ja=日语, ko=韩语, fr=法语, de=德语, es=西班牙语, pt=葡萄牙语, ru=俄语, ar=阿拉伯语,
id=印尼语, ms=马来语, th=泰语, vi=越南语, tl=菲律宾语, ur=乌尔都语, hi=印地语, bn=孟加拉语,
fa=波斯语, tr=土耳其语, nl=荷兰语, sv=瑞典语, pl=波兰语, sw=斯瓦希里语

只返回两个字母的语言代码，例如：zh, en, ja 等。`;

  const userPrompt = `请检测以下文本的语言：

${text}`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  const response = await client.invoke(messages, {
    model: "doubao-seed-1-6-251015",
    temperature: 0.1,
  });

  // 提取语言代码
  const code = response.content.trim().toLowerCase().substring(0, 2);
  return code in languageNames ? code : "en"; // 默认英语
}

// 单个翻译函数
async function translateText(
  client: LLMClient,
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const sourceLangName = languageNames[sourceLang] || sourceLang;
  const targetLangName = languageNames[targetLang] || targetLang;

  const systemPrompt = `你是一个专业的翻译助手。请准确翻译用户提供的文本，只返回翻译结果，不要添加任何解释或额外内容。

重要规则：
1. 只返回翻译后的文本，不要有任何其他内容
2. 保持原文的语气和格式
3. 确保翻译准确、自然、地道
4. 对于小语种（如乌尔都语、波斯语、阿拉伯语等），使用正确的语法和表达方式
5. 对于从右到左的语言（如乌尔都语、阿拉伯语、波斯语），确保使用正确的书写方向`;

  const userPrompt = `请将以下${sourceLangName}文本翻译成${targetLangName}：

${text}`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  const response = await client.invoke(messages, {
    model: "doubao-seed-1-6-251015",
    temperature: 0.3,
  });

  return response.content;
}

// 翻译接口 - 支持多语言翻译和自动检测
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, sourceLang, autoDetect, targetLangs } = req.body;

    // 参数校验
    if (!text) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：text",
      });
    }

    // 创建LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    let detectedLang: string | null = null;
    let actualSourceLang = sourceLang;

    // 如果是自动检测模式，先检测语种
    if (autoDetect || sourceLang === "auto" || !sourceLang) {
      detectedLang = await detectLanguage(client, text);
      actualSourceLang = detectedLang;
    }

    // 获取目标语言列表
    const langs = targetLangs || ["en", "ur"];

    // 并行翻译到所有目标语言
    const translationPromises = langs.map((targetLang: string) => 
      translateText(client, text, actualSourceLang, targetLang)
    );

    const translations = await Promise.all(translationPromises);

    // 构建翻译结果对象
    const result: Record<string, string> = {};
    langs.forEach((lang: string, index: number) => {
      result[lang] = translations[index];
    });

    res.json({
      success: true,
      data: {
        translations: result,
        detectedLang: detectedLang,
        sourceLang: actualSourceLang,
      },
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      success: false,
      error: "翻译服务暂时不可用，请稍后重试",
    });
  }
});

export default router;

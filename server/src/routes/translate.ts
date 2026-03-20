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

// 翻译接口 - 优化版：合并检测和翻译为一次LLM调用
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

    // 获取目标语言列表
    const langs = targetLangs || ["en", "ur"];
    const targetLangNames = langs.map((lang: string) => languageNames[lang] || lang).join("、");
    const targetLangList = langs.map((lang: string) => `"${lang}"`).join(", ");

    // 判断是否需要自动检测
    const needDetect = autoDetect || sourceLang === "auto" || !sourceLang;
    const knownSourceLang = needDetect ? "检测出的源语言" : (languageNames[sourceLang] || sourceLang);

    // 构建合并的系统提示
    let systemPrompt: string;
    let userPrompt: string;

    if (needDetect) {
      // 自动检测 + 翻译合并
      systemPrompt = `你是专业翻译。根据用户文本，完成以下任务并返回JSON格式：
1. 检测源语言（返回语言代码，如zh/en/ja等）
2. 翻译到指定目标语言

返回格式（不要有任何其他内容）：
{"detected":"语言代码","translations":{"语言代码":"翻译结果"}}`;
      
      userPrompt = `文本：${text}
目标语言：${targetLangList}
请检测源语言并翻译。`;
    } else {
      // 仅翻译（已知源语言）
      systemPrompt = `你是专业翻译。将文本翻译到指定目标语言，返回JSON格式。
只返回翻译结果，不要有任何其他内容。

返回格式：
{"translations":{"语言代码":"翻译结果"}}`;

      userPrompt = `将以下${knownSourceLang}翻译成${targetLangNames}：
${text}
目标语言代码：${targetLangList}`;
    }

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ];

    const response = await client.invoke(messages, {
      model: "doubao-seed-1-6-251015",
      temperature: 0.3,
    });

    // 解析JSON结果
    let detectedLang: string | null = null;
    const result: Record<string, string> = {};

    try {
      const content = response.content.trim();
      // 提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.detected) {
          const detected = String(parsed.detected).toLowerCase().substring(0, 2);
          // 验证语言代码
          detectedLang = detected in languageNames ? detected : "zh";
        }
        
        if (parsed.translations) {
          Object.assign(result, parsed.translations);
        }
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // 解析失败时的回退处理
      langs.forEach((lang: string) => {
        result[lang] = response.content;
      });
    }

    // 确保所有目标语言都有翻译结果
    langs.forEach((lang: string) => {
      if (!result[lang]) {
        result[lang] = "";
      }
    });

    res.json({
      success: true,
      data: {
        translations: result,
        detectedLang: detectedLang,
        sourceLang: needDetect ? detectedLang : sourceLang,
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

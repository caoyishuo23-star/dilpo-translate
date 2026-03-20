import express, { type Request, type Response } from "express";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

const router = express.Router();

// 语言代码映射
const languageNames: Record<string, string> = {
  zh: "中文",
  en: "英语",
  ur: "乌尔都语",
};

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
3. 如果是乌尔都语，确保使用正确的乌尔都语语法和表达`;

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

// 翻译接口 - 同时翻译成英文和乌尔都语
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, sourceLang } = req.body;

    // 参数校验
    if (!text || !sourceLang) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：text, sourceLang",
      });
    }

    // 创建LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    let englishText = "";
    let urduText = "";

    if (sourceLang === "zh") {
      // 中文输入：同时翻译成英文和乌尔都语
      const [enResult, urResult] = await Promise.all([
        translateText(client, text, "zh", "en"),
        translateText(client, text, "zh", "ur"),
      ]);
      englishText = enResult;
      urduText = urResult;
    } else if (sourceLang === "en") {
      // 英文输入：翻译成中文和乌尔都语
      const [zhResult, urResult] = await Promise.all([
        translateText(client, text, "en", "zh"),
        translateText(client, text, "en", "ur"),
      ]);
      englishText = text; // 原文就是英文
      urduText = urResult;
      res.json({
        success: true,
        data: {
          englishText: englishText,
          urduText: urduText,
          chineseText: zhResult,
          sourceLang,
        },
      });
      return;
    } else if (sourceLang === "ur") {
      // 乌尔都语输入：翻译成中文和英文
      const [zhResult, enResult] = await Promise.all([
        translateText(client, text, "ur", "zh"),
        translateText(client, text, "ur", "en"),
      ]);
      englishText = enResult;
      urduText = text; // 原文就是乌尔都语
      res.json({
        success: true,
        data: {
          englishText: englishText,
          urduText: urduText,
          chineseText: zhResult,
          sourceLang,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        englishText,
        urduText,
        chineseText: sourceLang === "zh" ? text : "",
        sourceLang,
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

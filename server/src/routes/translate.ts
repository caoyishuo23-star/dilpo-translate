import express, { type Request, type Response } from "express";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

const router = express.Router();

// 语言代码映射
const languageNames: Record<string, string> = {
  zh: "中文",
  en: "英语",
  ur: "乌尔都语",
};

// 翻译接口
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    // 参数校验
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：text, sourceLang, targetLang",
      });
    }

    if (sourceLang === targetLang) {
      return res.status(400).json({
        success: false,
        error: "源语言和目标语言不能相同",
      });
    }

    const sourceLangName = languageNames[sourceLang] || sourceLang;
    const targetLangName = languageNames[targetLang] || targetLang;

    // 创建LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建翻译提示
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

    // 调用LLM进行翻译
    const response = await client.invoke(messages, {
      model: "doubao-seed-1-6-251015",
      temperature: 0.3, // 低温度确保翻译准确性
    });

    res.json({
      success: true,
      data: {
        translatedText: response.content,
        sourceLang,
        targetLang,
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

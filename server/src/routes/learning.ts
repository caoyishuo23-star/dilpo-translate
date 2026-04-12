import express, { type Request, type Response } from "express";
import axios from "axios";

const router = express.Router();

// 千问 API 配置
const QWEN_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
// 使用 qwen3.5-flash 作为学习模型（最快）
const QWEN_MODEL = "qwen3.5-flash";

// 默认 API Key（建议通过环境变量配置）
const DEFAULT_QWEN_API_KEY = "";

// 语言代码映射
const languageNames: Record<string, string> = {
  en: "英语",
  ur: "乌尔都语",
  zh: "中文",
  ja: "日语",
  ko: "韩语",
  fr: "法语",
  de: "德语",
  es: "西班牙语",
  ar: "阿拉伯语",
};

// 调用千问 API（使用更快的小模型）
async function callQwenAPI(messages: any[], temperature: number = 0.5): Promise<string> {
  const apiKey = process.env.qwen || process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || DEFAULT_QWEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing QWEN_API_KEY environment variable");
  }

  const response = await axios.post(
    QWEN_API_URL,
    {
      model: QWEN_MODEL,
      messages: messages,
      temperature: temperature,
      thinking: { type: "disabled" }, // 禁用思考模式，加速
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 30000,
    }
  );

  if (response.data.choices && response.data.choices.length > 0) {
    return response.data.choices[0].message.content;
  }
  throw new Error("No response content from Qwen API");
}

// 生成与搜索词相关的句子
router.post("/related", async (req: Request, res: Response) => {
  try {
    const { words, targetLang, count = 3 } = req.body;

    // 参数校验
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：words（数组）",
      });
    }

    const targetLangName = languageNames[targetLang] || targetLang;

    const systemPrompt = `Generate ${count} example sentences for learning ${targetLangName}.
Return JSON: {"sentences":[{"source":"zh","target":"trans","word":"w"}]}`;

    const userPrompt = `Words: ${words.join(", ")}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const content = await callQwenAPI(messages, 0.7);

    // 尝试解析JSON
    let sentences;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        sentences = parsed.sentences;
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      sentences = words.slice(0, count).map((word: string) => ({
        source: `这是一个关于"${word}"的例句`,
        target: `This is an example sentence about "${word}"`,
        word,
      }));
    }

    res.json({
      success: true,
      data: {
        sentences: sentences.slice(0, count),
      },
    });
  } catch (error) {
    console.error("Related sentences generation error:", error);
    res.status(500).json({
      success: false,
      error: "生成相关句子失败，请稍后重试",
    });
  }
});

// 生成雅思真题句子
router.post("/ielts", async (req: Request, res: Response) => {
  try {
    const { words, count = 3 } = req.body;

    // 参数校验
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：words（数组）",
      });
    }

    const systemPrompt = `Generate ${count} IELTS-style example sentences using ${targetLangName}.
Return JSON: {"sentences":[{"s":"eng","t":"type","v":["word1"],"tr":"zh"}]}`;

    const userPrompt = `Words: ${words.join(", ")}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const content = await callQwenAPI(messages, 0.7);

    // 尝试解析JSON
    let sentences;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        sentences = parsed.sentences;
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      sentences = [
        {
          sentence: content.substring(0, 200),
          type: "Reading",
          vocabulary: words.slice(0, 3),
          translation: "系统生成的雅思风格句子",
        },
      ];
    }

    res.json({
      success: true,
      data: {
        sentences: sentences.slice(0, count),
      },
    });
  } catch (error) {
    console.error("IELTS generation error:", error);
    res.status(500).json({
      success: false,
      error: "生成雅思句子失败，请稍后重试",
    });
  }
});

export default router;

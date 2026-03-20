import express, { type Request, type Response } from "express";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

const router = express.Router();

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

    // 创建LLM客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const systemPrompt = `你是一位资深的雅思考试培训专家。请根据用户提供的单词或短语，生成${count}个真实的雅思考试风格的句子。

要求：
1. 句子必须是雅思阅读、听力或写作中可能出现的真实风格
2. 难度要符合雅思6.5-7.5分的水平
3. 每个句子要标注类型：Reading（阅读风格）、Listening（听力风格）、Writing Task 1/2（写作风格）
4. 句子内容要学术化、正式化
5. 每个句子要包含用户提供的至少一个单词
6. 返回JSON格式，格式如下：
{
  "sentences": [
    {
      "sentence": "英文句子",
      "type": "Reading",
      "vocabulary": ["句子中包含的重点词汇"],
      "translation": "中文翻译"
    }
  ]
}`;

    const userPrompt = `请根据以下单词/短语生成${count}个雅思风格的句子：
${words.join(", ")}`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ];

    const response = await client.invoke(messages, {
      model: "doubao-seed-1-6-251015",
      temperature: 0.7,
    });

    // 尝试解析JSON
    let sentences;
    try {
      // 提取JSON部分
      const content = response.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        sentences = parsed.sentences;
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      // 如果解析失败，返回简单的句子
      sentences = [
        {
          sentence: response.content.substring(0, 200),
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

import express, { type Request, type Response } from "express";
import { ASRClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// TTS - 文字转语音（提示使用本地引擎）
router.post("/tts", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：text",
      });
    }

    // 云端 TTS 服务暂时不可用，建议使用本地 expo-speech
    console.log("TTS - Cloud TTS not available, suggest local engine");

    res.status(503).json({
      success: false,
      error: "云端TTS服务暂不可用，请使用本地语音引擎",
      suggestion: "local",
    });
  } catch (error: any) {
    console.error("TTS error:", error?.message || error);
    res.status(500).json({
      success: false,
      error: "语音合成失败，请稍后重试",
    });
  }
});

// ASR - 语音转文字（使用 Coze）
router.post("/asr", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "缺少音频文件",
      });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    
    // 从环境变量获取 API Key
    const apiKey = process.env.COZE_API_KEY || process.env.COZE_WORKLOAD_IDENTITY_API_KEY;
    
    // 配置 API Key 和 baseUrl
    const config = new Config({ 
      apiKey: apiKey || undefined,
      baseUrl: "https://api.coze.cn",
      modelBaseUrl: "https://model.coze.cn"
    });
    const client = new ASRClient(config, customHeaders);

    // 将音频文件转为 base64
    const audioBase64 = req.file.buffer.toString("base64");

    const result = await client.recognize({
      uid: "translate_user",
      base64Data: audioBase64,
    });

    res.json({
      success: true,
      data: {
        text: result.text,
      },
    });
  } catch (error) {
    console.error("ASR error:", error);
    res.status(500).json({
      success: false,
      error: "语音识别失败，请稍后重试",
    });
  }
});

export default router;

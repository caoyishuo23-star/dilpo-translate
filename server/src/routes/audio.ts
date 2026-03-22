import express, { type Request, type Response } from "express";
import { TTSClient, ASRClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// TTS - 文字转语音
router.post("/tts", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "缺少必要参数：text",
      });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );
    
    // 从环境变量获取 API Key
    const apiKey = process.env.COZE_API_KEY;
    console.log("TTS - COZE_API_KEY exists:", !!apiKey);
    console.log("TTS - COZE_API_KEY length:", apiKey?.length || 0);
    
    const config = apiKey ? new Config({ apiKey }) : new Config();
    const client = new TTSClient(config, customHeaders);

    // 根据语言选择不同的发音人
    let speaker = "zh_female_xiaohe_uranus_bigtts"; // 默认中文女声
    if (lang === "en") {
      speaker = "zh_female_vv_uranus_bigtts"; // 中英双语
    } else if (lang === "ur") {
      speaker = "zh_female_vv_uranus_bigtts"; // 使用双语发音人
    } else if (lang === "ja") {
      speaker = "zh_female_vv_uranus_bigtts"; // 日语使用双语发音人
    }

    console.log("TTS - Calling synthesize with:", { text: text.substring(0, 20), speaker });

    const response = await client.synthesize({
      uid: "translate_user",
      text,
      speaker,
      audioFormat: "mp3",
      sampleRate: 24000,
    });

    console.log("TTS - Success:", response.audioUri);

    res.json({
      success: true,
      data: {
        audioUri: response.audioUri,
        audioSize: response.audioSize,
      },
    });
  } catch (error: any) {
    console.error("TTS error:", error?.message || error);
    console.error("TTS error stack:", error?.stack);
    res.status(500).json({
      success: false,
      error: "语音合成失败，请稍后重试",
    });
  }
});

// ASR - 语音转文字
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
    const apiKey = process.env.COZE_API_KEY;
    const config = apiKey ? new Config({ apiKey }) : new Config();
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

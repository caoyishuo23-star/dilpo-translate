import express, { type Request, type Response } from "express";

const router = express.Router();

// TTS - 文字转语音（暂不可用）
router.post("/tts", async (req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: "语音合成功能暂不可用，敬请期待后续版本",
  });
});

// ASR - 语音转文字（暂不可用）
router.post("/asr", async (req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: "语音识别功能暂不可用，敬请期待后续版本",
  });
});

export default router;

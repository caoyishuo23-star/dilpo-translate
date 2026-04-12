import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import translateRouter from "./routes/translate";
import audioRouter from "./routes/audio";
import learningRouter from "./routes/learning";

const app = express();
// Zeabur 期望服务监听 8080 端口
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/v1/translate', translateRouter);
app.use('/api/v1/audio', audioRouter);
app.use('/api/v1/learning', learningRouter);

app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}/`);
});

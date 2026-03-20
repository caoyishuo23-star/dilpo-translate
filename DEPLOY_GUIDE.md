# Diplo 翻译 App 部署指南

## 第一步：注册 Render.com 账号

1. 访问 https://render.com
2. 点击 **Get Started** 注册（可以用 GitHub 账号登录）
3. 免费账户完全够用

---

## 第二步：创建 GitHub 仓库

### 方法 A：在 GitHub 网页操作

1. 登录 https://github.com
2. 点击 **New repository**
3. 名称填写：`diplo-translate`
4. 选择 **Private**（私有）
5. 点击 **Create repository**

### 方法 B：上传代码

1. 下载 `diplo-server.tar.gz` 文件
2. 解压到本地文件夹
3. 在该文件夹执行：

```bash
# 初始化 git
git init
git add .
git commit -m "Initial commit"

# 连接到你的 GitHub 仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/diplo-translate.git
git branch -M main
git push -u origin main
```

---

## 第三步：在 Render 部署后端

1. 登录 https://dashboard.render.com
2. 点击 **New +** → **Web Service**
3. 连接你的 GitHub 账号，选择 `diplo-translate` 仓库
4. 填写配置：

| 字段 | 值 |
|------|-----|
| **Name** | diplo-translate-api |
| **Region** | Singapore（或最近的） |
| **Branch** | main |
| **Root Directory** | server |
| **Runtime** | Node |
| **Build Command** | npm install && npm run build |
| **Start Command** | npm start |
| **Plan** | Free |

5. 点击 **Deploy Web Service**
6. 等待 2-3 分钟部署完成
7. 部署成功后会得到一个 URL，类似：
   ```
   https://diplo-translate-api.onrender.com
   ```

---

## 第四步：测试后端

访问你的 API 地址：
```
https://你的地址.onrender.com/api/v1/health
```

如果返回 `{"status":"ok"}` 说明部署成功！

---

## 第五步：告诉我你的 API 地址

把你的 Render 地址发给我，格式如：
```
https://diplo-translate-api.onrender.com
```

我会帮你重新构建 APK！

---

## 常见问题

### Q: 首次访问很慢？
A: 免费服务会休眠，首次请求需要 30 秒左右唤醒，之后就快了。

### Q: 需要配置数据库吗？
A: 当前版本不需要，翻译功能直接使用 LLM API。

### Q: 后端代码在哪里？
A: 在 `server/` 目录下，已打包为 `diplo-server.tar.gz`。

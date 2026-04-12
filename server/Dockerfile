# Dockerfile for Zeabur
FROM node:22

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package*.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建
RUN pnpm run build

# 暴露端口
EXPOSE 10000

# 启动服务
CMD ["pnpm", "start"]

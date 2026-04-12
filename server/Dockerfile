# Dockerfile for Zeabur
FROM node:22

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --ignore-scripts

# 复制源代码
COPY . .

# 构建
RUN npm run build

# 暴露端口
EXPOSE 10000

# 启动服务
CMD ["npm", "start"]

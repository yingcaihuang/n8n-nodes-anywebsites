# 使用官方 n8n 镜像作为基础镜像
FROM n8nio/n8n:latest

# 设置工作目录
WORKDIR /home/node

# 切换到 root 用户以安装包
USER root

# 安装我们的自定义节点
RUN npm install -g n8n-nodes-anywebsites@1.1.0

# 创建自定义节点目录
RUN mkdir -p /home/node/.n8n/nodes

# 设置环境变量
ENV N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/nodes"
ENV N8N_NODES_INCLUDE="n8n-nodes-anywebsites"

# 切换回 node 用户
USER node

# 暴露 n8n 端口
EXPOSE 5678

# 启动命令 - 使用完整路径
CMD ["/usr/local/bin/n8n", "start"]

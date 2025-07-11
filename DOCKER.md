# n8n-nodes-anywebsites Docker 镜像

这是一个包含 AnyWebsites 自定义节点的 n8n Docker 镜像。

## 🚀 快速开始

### 从 Harbor 拉取镜像

```bash
# 拉取最新版本
docker pull hub.verycloud.cn/n8n-nodes/anywebsites:latest

# 拉取指定版本
docker pull hub.verycloud.cn/n8n-nodes/anywebsites:1.1.0
```

### 运行容器

```bash
# 基础运行
docker run -p 5678:5678 hub.verycloud.cn/n8n-nodes/anywebsites:latest

# 带认证的运行
docker run -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  hub.verycloud.cn/n8n-nodes/anywebsites:latest

# 持久化数据
docker run -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  hub.verycloud.cn/n8n-nodes/anywebsites:latest
```

### 使用 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `N8N_BASIC_AUTH_ACTIVE` | 启用基础认证 | `false` |
| `N8N_BASIC_AUTH_USER` | 认证用户名 | - |
| `N8N_BASIC_AUTH_PASSWORD` | 认证密码 | - |
| `N8N_HOST` | 绑定主机 | `0.0.0.0` |
| `N8N_PORT` | 端口号 | `5678` |
| `N8N_PROTOCOL` | 协议 | `http` |

## 📋 包含的节点

- **AnyWebsites**: 内容管理节点
  - 版本: 1.1.0
  - 支持 JWT 认证
  - 支持内容上传、列表、更新、删除
  - 支持 SSL 证书验证控制

## 🔐 AnyWebsites 节点配置

1. 在 n8n 界面中创建新的凭据
2. 选择 "AnyWebsites API"
3. 配置参数：
   - **Base URL**: `https://your-anywebsites-server:8443`
   - **Username**: 您的用户名
   - **Password**: 您的密码
   - **Ignore SSL Issues**: 根据需要启用

## 🏗️ 构建镜像

### 本地构建

```bash
# 克隆仓库
git clone <repository-url>
cd n8n-nodes-anywebsites

# 构建镜像
docker build -t n8n-anywebsites:local .

# 运行本地镜像
docker run -p 5678:5678 n8n-anywebsites:local
```

### 使用构建脚本

```bash
# 给脚本执行权限
chmod +x docker-build.sh

# 运行构建脚本
./docker-build.sh
```

## 📤 推送到 Harbor

### 手动推送

```bash
# 登录 Harbor
docker login hub.verycloud.cn

# 标记镜像
docker tag n8n-anywebsites:local hub.verycloud.cn/n8n-nodes/anywebsites:1.1.0

# 推送镜像
docker push hub.verycloud.cn/n8n-nodes/anywebsites:1.1.0
```

### 使用脚本推送

构建脚本会询问是否推送到 Harbor，选择 `y` 即可自动推送。

## 🔍 故障排除

### 检查容器状态

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs <container-id>

# 进入容器
docker exec -it <container-id> /bin/bash
```

### 验证节点安装

```bash
# 进入容器
docker exec -it <container-id> /bin/bash

# 检查已安装的包
npm list -g | grep anywebsites

# 检查 n8n 节点
ls -la /usr/local/lib/node_modules/n8n-nodes-anywebsites/
```

### 常见问题

1. **节点未显示**: 确保环境变量 `N8N_NODES_INCLUDE` 包含 `n8n-nodes-anywebsites`
2. **认证失败**: 检查 AnyWebsites 服务器是否可访问，用户名密码是否正确
3. **SSL 错误**: 启用 "Ignore SSL Issues" 选项

## 📊 镜像信息

- **基础镜像**: `n8nio/n8n:latest`
- **包含节点**: `n8n-nodes-anywebsites@1.1.0`
- **暴露端口**: `5678`
- **工作目录**: `/home/node`
- **运行用户**: `node`

## 🔗 相关链接

- [n8n 官方文档](https://docs.n8n.io/)
- [n8n-nodes-anywebsites NPM](https://www.npmjs.com/package/n8n-nodes-anywebsites)
- [VeryCloud Harbor](https://hub.verycloud.cn/)

## 📝 更新日志

### v1.1.0
- 重构认证方式为 JWT Token
- 支持用户名/密码登录
- 智能 Token 缓存和刷新
- 完全兼容 AnyWebsites API

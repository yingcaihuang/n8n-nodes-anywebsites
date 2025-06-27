# n8n-nodes-anywebsites

这是一个用于 [n8n](https://n8n.io/) 的社区节点，用于与 AnyWebsites HTML 托管服务进行集成。

[AnyWebsites](https://anywebsites.com) 是一个功能强大的 HTML 页面托管服务平台，支持快速部署、管理和分析 HTML 页面。

## 功能特性

- 🔐 **安全认证**: 支持 API Key 和 Base URL 配置
- 📄 **HTML 内容上传**: 上传 HTML 内容并获取发布 URL
- 🌐 **访问控制**: 支持公开和私有内容设置
- 📊 **内容管理**: 获取、更新和删除已上传的内容
- ⚡ **简单易用**: 直观的节点配置界面

## 安装

在 n8n 中，转到 **设置 > 社区节点** 并安装：

```
n8n-nodes-anywebsites
```

## 配置

### 凭据设置

1. 在 n8n 中创建新的 AnyWebsites API 凭据
2. 填入以下信息：
   - **API Key**: 您的 AnyWebsites API 密钥
   - **Base URL**: AnyWebsites 服务的基础 URL（例如：https://localhost:8443）

### 获取 API Key

1. 注册或登录 AnyWebsites 服务
2. 在用户设置中找到您的 API Key
3. 将 API Key 复制到 n8n 凭据配置中

## 使用方法

### 上传 HTML 内容

1. 添加 AnyWebsites 节点到您的工作流
2. 选择 "Upload Content" 操作
3. 配置以下参数：
   - **Title**: 内容标题
   - **Description**: 内容描述（可选）
   - **HTML Content**: 要上传的 HTML 内容
   - **Is Public**: 是否为公开内容
   - **Access Code**: 私有内容的访问码（可选）

### 获取内容列表

1. 选择 "Get Content List" 操作
2. 配置分页参数（可选）

### 管理现有内容

- **Get Content**: 获取特定内容的详细信息
- **Update Content**: 更新现有内容
- **Delete Content**: 删除内容

## 示例工作流

### 基本 HTML 上传

```json
{
  "nodes": [
    {
      "name": "Upload HTML",
      "type": "n8n-nodes-anywebsites.anyWebsites",
      "parameters": {
        "operation": "upload",
        "title": "我的测试页面",
        "htmlContent": "<html><head><title>Hello</title></head><body><h1>Hello World!</h1></body></html>",
        "isPublic": true
      }
    }
  ]
}
```

## 支持的操作

| 操作 | 描述 |
|------|------|
| Upload Content | 上传新的 HTML 内容 |
| Get Content List | 获取内容列表 |
| Get Content | 获取特定内容详情 |
| Update Content | 更新现有内容 |
| Delete Content | 删除内容 |

## 错误处理

节点会自动处理常见的 API 错误：

- **401 Unauthorized**: 检查您的 API Key 是否正确
- **404 Not Found**: 检查内容 ID 是否存在
- **400 Bad Request**: 检查请求参数是否正确

## 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-username/n8n-nodes-anywebsites.git
cd n8n-nodes-anywebsites

# 安装依赖
pnpm install

# 构建
pnpm build

# 开发模式
pnpm dev
```

### 测试

```bash
pnpm test
```

## 贡献

欢迎贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 许可证

[MIT](LICENSE)

## 支持

如有问题或需要帮助，请：

1. 查看 [文档](https://anywebsites.com/docs)
2. 提交 [Issue](https://github.com/your-username/n8n-nodes-anywebsites/issues)
3. 联系支持团队：support@anywebsites.com

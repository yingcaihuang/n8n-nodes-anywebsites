# AnyWebsites 节点使用示例

本文档提供了 AnyWebsites n8n 节点的详细使用示例。

## 基础配置

### 1. 设置凭据

首先，您需要在 n8n 中配置 AnyWebsites API 凭据：

1. 转到 **设置 > 凭据**
2. 点击 **新建凭据**
3. 选择 **AnyWebsites API**
4. 填入以下信息：
   - **Base URL**: `https://localhost:8443` (或您的 AnyWebsites 实例 URL)
   - **API Key**: 您的 API 密钥 (例如: `ak_1234567890abcdef`)

### 2. 获取 API Key

要获取 API Key，请按照以下步骤：

1. 注册或登录您的 AnyWebsites 账户
2. 使用以下 API 调用登录并获取 API Key：

```bash
curl -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

响应中的 `user.api_key` 字段就是您需要的 API Key。

## 使用示例

### 示例 1: 上传简单的 HTML 页面

这个示例展示如何上传一个简单的 HTML 页面：

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "upload",
        "title": "我的第一个页面",
        "description": "这是一个测试页面",
        "htmlContent": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n    <style>\n        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }\n        h1 { color: #333; }\n    </style>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>这是我的第一个 AnyWebsites 页面。</p>\n</body>\n</html>",
        "isPublic": true
      },
      "name": "Upload HTML Page",
      "type": "n8n-nodes-anywebsites.anyWebsites",
      "typeVersion": 1,
      "position": [250, 300],
      "credentials": {
        "anyWebsitesApi": {
          "id": "your-credential-id",
          "name": "AnyWebsites API"
        }
      }
    }
  ]
}
```

**输出示例：**
```json
{
  "message": "Content uploaded successfully",
  "content": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "我的第一个页面",
    "description": "这是一个测试页面",
    "is_public": true,
    "view_count": 0,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "published_url": "https://localhost:8443/view/123e4567-e89b-12d3-a456-426614174000"
}
```

### 示例 2: 上传私有页面（需要访问码）

```json
{
  "parameters": {
    "operation": "upload",
    "title": "私密文档",
    "description": "仅限内部访问的文档",
    "htmlContent": "<!DOCTYPE html>\n<html>\n<head>\n    <title>私密文档</title>\n</head>\n<body>\n    <h1>机密信息</h1>\n    <p>这是一个需要访问码的私密页面。</p>\n</body>\n</html>",
    "isPublic": false,
    "accessCode": "secret123"
  }
}
```

### 示例 3: 获取内容列表

```json
{
  "parameters": {
    "operation": "getList",
    "page": 1,
    "limit": 10
  }
}
```

**输出示例：**
```json
{
  "contents": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "我的第一个页面",
      "description": "这是一个测试页面",
      "is_public": true,
      "view_count": 5,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 示例 4: 更新现有内容

```json
{
  "parameters": {
    "operation": "update",
    "contentId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "更新后的标题",
    "htmlContent": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Updated Page</title>\n</head>\n<body>\n    <h1>页面已更新！</h1>\n    <p>这是更新后的内容。</p>\n</body>\n</html>",
    "isPublic": true
  }
}
```

## 工作流示例

### 工作流 1: 从表单数据生成 HTML 页面

这个工作流展示如何从表单数据动态生成 HTML 页面：

```json
{
  "name": "Dynamic HTML Generator",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "generate-page",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [120, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $input.first().json.body;\n\nconst htmlContent = `\n<!DOCTYPE html>\n<html>\n<head>\n    <title>${data.title}</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 40px; }\n        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }\n        .content { margin-top: 20px; }\n    </style>\n</head>\n<body>\n    <div class=\"header\">\n        <h1>${data.title}</h1>\n        <p><strong>作者:</strong> ${data.author}</p>\n    </div>\n    <div class=\"content\">\n        <p>${data.content}</p>\n    </div>\n</body>\n</html>\n`;\n\nreturn {\n  title: data.title,\n  htmlContent: htmlContent,\n  author: data.author\n};"
      },
      "name": "Generate HTML",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [320, 300]
    },
    {
      "parameters": {
        "operation": "upload",
        "title": "={{ $json.title }}",
        "description": "由 {{ $json.author }} 创建",
        "htmlContent": "={{ $json.htmlContent }}",
        "isPublic": true
      },
      "name": "Upload to AnyWebsites",
      "type": "n8n-nodes-anywebsites.anyWebsites",
      "typeVersion": 1,
      "position": [520, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{\n  \"success\": true,\n  \"message\": \"页面创建成功\",\n  \"url\": \"{{ $json.published_url }}\",\n  \"content_id\": \"{{ $json.content.id }}\"\n}"
      },
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [720, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Generate HTML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HTML": {
      "main": [
        [
          {
            "node": "Upload to AnyWebsites",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Upload to AnyWebsites": {
      "main": [
        [
          {
            "node": "Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 工作流 2: 定期备份内容

这个工作流展示如何定期获取所有内容并进行备份：

```json
{
  "name": "Content Backup",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 2 * * *"
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [120, 300]
    },
    {
      "parameters": {
        "operation": "getList",
        "page": 1,
        "limit": 100
      },
      "name": "Get All Content",
      "type": "n8n-nodes-anywebsites.anyWebsites",
      "typeVersion": 1,
      "position": [320, 300]
    },
    {
      "parameters": {
        "operation": "write",
        "fileName": "anywebsites-backup-{{ $now.format('YYYY-MM-DD') }}.json",
        "data": "={{ JSON.stringify($json, null, 2) }}"
      },
      "name": "Save Backup",
      "type": "n8n-nodes-base.writeFile",
      "typeVersion": 1,
      "position": [520, 300]
    }
  ]
}
```

## 错误处理

### 常见错误及解决方案

1. **401 Unauthorized**
   - 检查 API Key 是否正确
   - 确认 Base URL 是否正确

2. **404 Not Found**
   - 检查内容 ID 是否存在
   - 确认 API 端点是否正确

3. **400 Bad Request**
   - 检查请求参数是否完整
   - 验证 HTML 内容格式

### 错误处理工作流示例

```json
{
  "parameters": {
    "operation": "upload",
    "title": "Test Page",
    "htmlContent": "{{ $json.html }}",
    "isPublic": true,
    "continueOnFail": true
  },
  "name": "Upload with Error Handling",
  "type": "n8n-nodes-anywebsites.anyWebsites"
}
```

## 最佳实践

1. **使用环境变量**: 将敏感信息如 API Key 存储在环境变量中
2. **错误处理**: 始终启用 "Continue on Fail" 选项来处理可能的错误
3. **分页处理**: 对于大量数据，使用适当的分页参数
4. **内容验证**: 在上传前验证 HTML 内容的格式和大小
5. **访问控制**: 根据需要合理设置公开/私有访问权限

## 技术支持

如果您在使用过程中遇到问题，请：

1. 查看 [AnyWebsites API 文档](https://anywebsites.com/docs)
2. 检查 n8n 日志中的详细错误信息
3. 联系技术支持：support@anywebsites.com

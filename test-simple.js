#!/usr/bin/env node

/**
 * Simple test script that mimics the Go code exactly
 */

const https = require('https');

// Test configuration (matching Go code exactly)
const TEST_CONFIG = {
  baseUrl: 'https://localhost:8443',
  apiKey: '1e278ff1-881a-47e6-ad8c-f779e715'
};

// Create HTTPS agent that ignores SSL certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Test content upload (matching Go code behavior)
 */
async function testUpload() {
  console.log('🚀 Testing content upload (mimicking Go code)...');
  
  const testContent = {
    title: 'n8n Test Article',
    description: 'Test article created by n8n-nodes-anywebsites test',
    html_content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>n8n 测试文章</title>
    <style>
        body { 
            font-family: 'Microsoft YaHei', sans-serif; 
            line-height: 1.6; 
            margin: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 { 
            color: #2c3e50; 
            text-align: center; 
            margin-bottom: 30px;
        }
        .highlight { 
            background: #e8f5e8; 
            padding: 20px; 
            border-left: 4px solid #4caf50; 
            margin: 20px 0; 
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 n8n AnyWebsites 节点测试</h1>
        
        <div class="highlight">
            <strong>✅ 测试成功！</strong> 这篇文章是通过 n8n-nodes-anywebsites 节点创建的。
        </div>

        <h2>📋 测试信息</h2>
        <ul>
            <li><strong>创建时间：</strong> ${new Date().toLocaleString('zh-CN')}</li>
            <li><strong>API Key：</strong> ${TEST_CONFIG.apiKey.substring(0, 8)}...</li>
            <li><strong>节点版本：</strong> 1.0.2</li>
            <li><strong>测试类型：</strong> 本地功能测试</li>
        </ul>

        <h2>🚀 功能特性</h2>
        <ul>
            <li>✅ SSL 证书验证控制</li>
            <li>✅ API Key 认证</li>
            <li>✅ HTML 内容上传</li>
            <li>✅ 公开/私有内容设置</li>
            <li>✅ 内容管理操作</li>
        </ul>

        <div class="highlight">
            <strong>🎯 下一步：</strong> 您可以在 n8n 工作流中使用这个节点来自动化内容管理！
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="text-align: center; color: #666; font-size: 14px;">
            📝 通过 n8n-nodes-anywebsites 创建 | 🏷️ 测试, n8n, 自动化
        </p>
    </div>
</body>
</html>`,
    is_public: true
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testContent);
    
    const options = {
      hostname: 'localhost',
      port: 8443,
      path: '/api/content/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      agent: httpsAgent
    };

    console.log('📤 发送请求到:', `${TEST_CONFIG.baseUrl}/api/content/upload`);
    console.log('🔑 使用 API Key:', TEST_CONFIG.apiKey.substring(0, 8) + '...');

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 响应状态: ${res.statusCode} ${res.statusMessage}`);
        console.log('📋 响应头:', JSON.stringify(res.headers, null, 2));
        
        try {
          const result = JSON.parse(body);
          console.log('📄 响应内容:', JSON.stringify(result, null, 2));
          
          if (res.statusCode === 201) {
            console.log('✅ 上传成功!');
            console.log(`🔗 访问链接: ${TEST_CONFIG.baseUrl}${result.url}`);
            resolve(result);
          } else {
            console.log('❌ 上传失败');
            reject(new Error(`HTTP ${res.statusCode}: ${result.error || result.message || body}`));
          }
        } catch (error) {
          console.log('📄 原始响应:', body);
          if (res.statusCode === 201) {
            console.log('✅ 上传可能成功 (响应不是JSON格式)');
            resolve({ body });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 请求错误:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Test getting content list
 */
async function testGetList() {
  console.log('\n📋 Testing content list...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8443,
      path: '/api/content?page=1&limit=5',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_CONFIG.apiKey}`
      },
      agent: httpsAgent
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 响应状态: ${res.statusCode} ${res.statusMessage}`);
        
        try {
          const result = JSON.parse(body);
          console.log('📄 响应内容:', JSON.stringify(result, null, 2));
          
          if (res.statusCode === 200) {
            console.log('✅ 获取列表成功!');
            if (result.contents) {
              console.log(`📊 找到 ${result.contents.length} 个内容项`);
            }
            resolve(result);
          } else {
            console.log('❌ 获取列表失败');
            reject(new Error(`HTTP ${res.statusCode}: ${result.error || body}`));
          }
        } catch (error) {
          console.log('📄 原始响应:', body);
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 请求错误:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 AnyWebsites API 简单测试');
  console.log('=' .repeat(50));
  console.log(`📍 Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`🔑 API Key: ${TEST_CONFIG.apiKey.substring(0, 8)}...`);
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Upload content
    await testUpload();
    
    // Test 2: Get content list
    await testGetList();
    
    console.log('\n🎉 所有测试完成!');
    console.log('✅ n8n 节点应该可以正常工作了。');
    
  } catch (error) {
    console.log('\n❌ 测试失败:', error.message);
    console.log('\n🔍 可能的问题:');
    console.log('   1. API Key 无效或已过期');
    console.log('   2. AnyWebsites 服务未运行');
    console.log('   3. 网络连接问题');
    console.log('   4. API 端点或认证方式变更');
    
    process.exit(1);
  }
}

// Run tests
runTests();

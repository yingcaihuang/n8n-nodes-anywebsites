#!/usr/bin/env node

/**
 * Local test script for AnyWebsites n8n node
 * Tests the actual API functionality with provided credentials
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'https://localhost:8443',
  apiKey: '1e278ff1-881a-47e6-ad8c-f779e715',
  allowUnauthorizedCerts: true
};

// Create HTTP agent that ignores SSL certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Make HTTP request with proper error handling
 */
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: body
          };
          
          // Try to parse JSON if possible
          try {
            result.json = JSON.parse(body);
          } catch (e) {
            // Not JSON, keep as string
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    // Set timeout
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

/**
 * Test credential validation (similar to n8n credential test)
 */
async function testCredentials() {
  console.log('🔐 Testing credentials...');

  const url = new URL('/api/content', TEST_CONFIG.baseUrl);

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'GET',
    protocol: url.protocol,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': TEST_CONFIG.apiKey,
      'User-Agent': 'n8n-nodes-anywebsites-test/1.0.2'
    },
    agent: TEST_CONFIG.allowUnauthorizedCerts ? httpsAgent : undefined
  };

  try {
    const response = await makeRequest(options);

    console.log(`   Status: ${response.statusCode} ${response.statusMessage}`);

    if (response.statusCode === 200) {
      console.log('   ✅ Credentials test PASSED');
      console.log('   📄 Response:', response.json || response.body);
      return true;
    } else {
      console.log('   ❌ Credentials test FAILED');
      console.log('   📄 Response:', response.json || response.body);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Credentials test ERROR:', error.message);
    return false;
  }
}

/**
 * Test uploading HTML content
 */
async function testUploadContent() {
  console.log('\n📤 Testing content upload...');
  
  const url = new URL('/api/content/upload', TEST_CONFIG.baseUrl);
  
  const testContent = {
    title: 'n8n Test Page',
    description: 'Test page created by n8n-nodes-anywebsites local test',
    html_content: `<!DOCTYPE html>
<html>
<head>
    <title>n8n Test Page</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 n8n AnyWebsites Test</h1>
        <p>This page was created by the n8n-nodes-anywebsites node!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>API Key: ${TEST_CONFIG.apiKey.substring(0, 8)}...</p>
    </div>
</body>
</html>`,
    is_public: true
  };
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'POST',
    protocol: url.protocol,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': TEST_CONFIG.apiKey,
      'User-Agent': 'n8n-nodes-anywebsites-test/1.0.2'
    },
    agent: TEST_CONFIG.allowUnauthorizedCerts ? httpsAgent : undefined
  };
  
  try {
    const response = await makeRequest(options, JSON.stringify(testContent));
    
    console.log(`   Status: ${response.statusCode} ${response.statusMessage}`);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('   ✅ Content upload PASSED');
      console.log('   📄 Response:', response.json || response.body);
      
      // Extract content ID for further tests
      if (response.json && response.json.content && response.json.content.id) {
        const contentId = response.json.content.id;
        const publishedUrl = `${TEST_CONFIG.baseUrl}/view/${contentId}`;
        console.log(`   🌐 Published URL: ${publishedUrl}`);
        return contentId;
      }
      return true;
    } else {
      console.log('   ❌ Content upload FAILED');
      console.log('   📄 Response:', response.json || response.body);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Content upload ERROR:', error.message);
    return false;
  }
}

/**
 * Test getting content list
 */
async function testGetContentList() {
  console.log('\n📋 Testing content list retrieval...');
  
  const url = new URL('/api/content?page=1&limit=5', TEST_CONFIG.baseUrl);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'GET',
    protocol: url.protocol,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': TEST_CONFIG.apiKey,
      'User-Agent': 'n8n-nodes-anywebsites-test/1.0.2'
    },
    agent: TEST_CONFIG.allowUnauthorizedCerts ? httpsAgent : undefined
  };
  
  try {
    const response = await makeRequest(options);
    
    console.log(`   Status: ${response.statusCode} ${response.statusMessage}`);
    
    if (response.statusCode === 200) {
      console.log('   ✅ Content list retrieval PASSED');
      const data = response.json || JSON.parse(response.body);
      console.log(`   📊 Found ${data.contents ? data.contents.length : 0} content items`);
      if (data.contents && data.contents.length > 0) {
        console.log('   📄 First item:', {
          id: data.contents[0].id,
          title: data.contents[0].title,
          created_at: data.contents[0].created_at
        });
      }
      return true;
    } else {
      console.log('   ❌ Content list retrieval FAILED');
      console.log('   📄 Response:', response.json || response.body);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Content list retrieval ERROR:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting AnyWebsites n8n Node Local Tests');
  console.log('=' .repeat(50));
  console.log(`📍 Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`🔑 API Key: ${TEST_CONFIG.apiKey.substring(0, 8)}...`);
  console.log(`🔒 SSL Ignore: ${TEST_CONFIG.allowUnauthorizedCerts}`);
  console.log('=' .repeat(50));
  
  const results = {
    credentials: false,
    upload: false,
    list: false
  };
  
  // Test 1: Credentials
  results.credentials = await testCredentials();
  
  // Test 2: Upload content (only if credentials work)
  if (results.credentials) {
    results.upload = await testUploadContent();
  } else {
    console.log('\n📤 Skipping upload test (credentials failed)');
  }
  
  // Test 3: Get content list (only if credentials work)
  if (results.credentials) {
    results.list = await testGetContentList();
  } else {
    console.log('\n📋 Skipping list test (credentials failed)');
  }
  
  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  console.log(`🔐 Credentials Test: ${results.credentials ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📤 Upload Test: ${results.upload ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📋 List Test: ${results.list ? '✅ PASS' : '❌ FAIL'}`);
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All tests PASSED! The n8n node should work correctly.');
  } else {
    console.log('⚠️  Some tests FAILED. Please check the configuration and API.');
  }
  
  process.exit(passCount === totalCount ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});

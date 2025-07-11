#!/bin/bash

# Harbor 项目创建脚本

set -e

HARBOR_URL="hub.verycloud.cn"
PROJECT_NAME="${1:-n8n-nodes}"

echo "🚀 Harbor 项目创建脚本"
echo "=================================================="
echo "Harbor URL: ${HARBOR_URL}"
echo "项目名称: ${PROJECT_NAME}"
echo "=================================================="

echo ""
echo "📝 请按以下步骤在 Harbor Web 界面中创建项目："
echo ""
echo "1. 打开浏览器访问: https://${HARBOR_URL}"
echo "2. 使用您的账户登录 (yingcai.huang)"
echo "3. 点击 '项目' 或 'Projects'"
echo "4. 点击 '新建项目' 或 'New Project'"
echo "5. 填写项目信息："
echo "   - 项目名称: ${PROJECT_NAME}"
echo "   - 访问级别: 公开 (推荐) 或 私有"
echo "   - 其他设置保持默认"
echo "6. 点击 '确定' 或 'OK' 创建项目"
echo ""
echo "✅ 项目创建完成后，运行以下命令推送镜像："
echo "   ./docker-push-flexible.sh ${PROJECT_NAME}"
echo ""

# 尝试通过 API 创建项目（需要密码）
read -p "🤔 是否尝试通过 API 自动创建项目? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔐 请输入您的 Harbor 密码:"
    read -s PASSWORD
    
    echo ""
    echo "📤 正在创建项目..."
    
    # 创建项目的 JSON 数据
    PROJECT_DATA=$(cat <<EOF
{
  "project_name": "${PROJECT_NAME}",
  "public": true,
  "metadata": {
    "public": "true"
  }
}
EOF
)
    
    # 发送 API 请求创建项目
    RESPONSE=$(curl -s -w "%{http_code}" -u "yingcai.huang:${PASSWORD}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "${PROJECT_DATA}" \
        "https://${HARBOR_URL}/api/v2.0/projects")
    
    HTTP_CODE="${RESPONSE: -3}"
    RESPONSE_BODY="${RESPONSE%???}"
    
    if [ "$HTTP_CODE" = "201" ]; then
        echo "✅ 项目创建成功!"
        echo ""
        echo "🚀 现在可以推送镜像了:"
        echo "   ./docker-push-flexible.sh ${PROJECT_NAME}"
    elif [ "$HTTP_CODE" = "409" ]; then
        echo "ℹ️  项目已存在，可以直接推送镜像:"
        echo "   ./docker-push-flexible.sh ${PROJECT_NAME}"
    else
        echo "❌ 项目创建失败 (HTTP ${HTTP_CODE})"
        echo "响应: ${RESPONSE_BODY}"
        echo ""
        echo "💡 请手动在 Web 界面中创建项目"
        echo "   访问: https://${HARBOR_URL}"
    fi
else
    echo "💡 请手动在 Web 界面中创建项目后再推送镜像"
fi

echo ""
echo "🎯 完成!"

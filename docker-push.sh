#!/bin/bash

# Docker 推送脚本
# 用于推送 n8n-nodes-anywebsites Docker 镜像到 VeryCloud Harbor

set -e

# 配置变量 - 可以通过环境变量覆盖
HARBOR_URL="${HARBOR_URL:-hub.verycloud.cn}"
PROJECT_NAME="${PROJECT_NAME:-n8n-nodes}"
IMAGE_NAME="${IMAGE_NAME:-anywebsites}"
VERSION="${VERSION:-1.1.0}"
FULL_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:${VERSION}"
LATEST_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:latest"

echo "🚀 开始推送 n8n-nodes-anywebsites Docker 镜像到 Harbor"
echo "=================================================="
echo "Harbor URL: ${HARBOR_URL}"
echo "项目名称: ${PROJECT_NAME}"
echo "镜像名称: ${IMAGE_NAME}"
echo "版本标签: ${VERSION}"
echo "完整镜像名: ${FULL_IMAGE_NAME}"
echo "=================================================="

# 检查镜像是否存在
if ! docker images | grep -q "${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}"; then
    echo "❌ 镜像不存在，请先运行 ./docker-build.sh 构建镜像"
    exit 1
fi

echo "📋 本地镜像信息:"
docker images | grep "${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}"

# 登录到 Harbor
echo ""
echo "🔐 登录到 Harbor..."
echo "请输入您的 Harbor 凭据:"
docker login "${HARBOR_URL}"

if [ $? -eq 0 ]; then
    echo "✅ Harbor 登录成功!"
    
    echo "📤 推送版本标签镜像..."
    docker push "${FULL_IMAGE_NAME}"
    
    if [ $? -eq 0 ]; then
        echo "✅ 版本镜像推送成功!"
        
        echo "📤 推送 latest 标签镜像..."
        docker push "${LATEST_IMAGE_NAME}"
        
        if [ $? -eq 0 ]; then
            echo "🎉 所有镜像推送成功!"
            echo ""
            echo "📋 推送的镜像:"
            echo "版本镜像: ${FULL_IMAGE_NAME}"
            echo "最新镜像: ${LATEST_IMAGE_NAME}"
            echo ""
            echo "🚀 使用方法:"
            echo "docker pull ${FULL_IMAGE_NAME}"
            echo "docker run -p 5678:5678 ${FULL_IMAGE_NAME}"
            echo ""
            echo "🌐 Harbor 访问地址:"
            echo "https://${HARBOR_URL}/harbor/projects/${PROJECT_NAME}/repositories/${IMAGE_NAME}"
        else
            echo "❌ latest 镜像推送失败!"
            exit 1
        fi
    else
        echo "❌ 版本镜像推送失败!"
        exit 1
    fi
else
    echo "❌ Harbor 登录失败!"
    exit 1
fi

echo ""
echo "🎯 推送完成!"

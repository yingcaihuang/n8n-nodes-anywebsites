#!/bin/bash

# Docker 构建和推送脚本
# 用于构建 n8n-nodes-anywebsites Docker 镜像并推送到 VeryCloud Harbor

set -e

# 配置变量
HARBOR_URL="hub.verycloud.cn"
PROJECT_NAME="n8n-nodes"
IMAGE_NAME="anywebsites"
VERSION="1.1.0"
FULL_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:${VERSION}"
LATEST_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:latest"

echo "🚀 开始构建 n8n-nodes-anywebsites Docker 镜像"
echo "=================================================="
echo "Harbor URL: ${HARBOR_URL}"
echo "项目名称: ${PROJECT_NAME}"
echo "镜像名称: ${IMAGE_NAME}"
echo "版本标签: ${VERSION}"
echo "完整镜像名: ${FULL_IMAGE_NAME}"
echo "=================================================="

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请启动 Docker 后重试"
    exit 1
fi

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker build -t "${FULL_IMAGE_NAME}" -t "${LATEST_IMAGE_NAME}" .

if [ $? -eq 0 ]; then
    echo "✅ Docker 镜像构建成功!"
else
    echo "❌ Docker 镜像构建失败!"
    exit 1
fi

# 显示镜像信息
echo "📋 镜像信息:"
docker images | grep "${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}"

# 询问是否推送到 Harbor
echo ""
read -p "🤔 是否要推送镜像到 Harbor? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔐 登录到 Harbor..."
    echo "请输入您的 Harbor 凭据:"
    docker login "${HARBOR_URL}"
    
    if [ $? -eq 0 ]; then
        echo "✅ Harbor 登录成功!"
        
        echo "📤 推送版本标签镜像..."
        docker push "${FULL_IMAGE_NAME}"
        
        echo "📤 推送 latest 标签镜像..."
        docker push "${LATEST_IMAGE_NAME}"
        
        if [ $? -eq 0 ]; then
            echo "🎉 镜像推送成功!"
            echo ""
            echo "📋 镜像信息:"
            echo "版本镜像: ${FULL_IMAGE_NAME}"
            echo "最新镜像: ${LATEST_IMAGE_NAME}"
            echo ""
            echo "🚀 使用方法:"
            echo "docker pull ${FULL_IMAGE_NAME}"
            echo "docker run -p 5678:5678 ${FULL_IMAGE_NAME}"
        else
            echo "❌ 镜像推送失败!"
            exit 1
        fi
    else
        echo "❌ Harbor 登录失败!"
        exit 1
    fi
else
    echo "⏭️  跳过推送，镜像已在本地构建完成"
    echo ""
    echo "🚀 本地测试命令:"
    echo "docker run -p 5678:5678 ${FULL_IMAGE_NAME}"
fi

echo ""
echo "🎯 构建完成!"

#!/bin/bash

# 灵活的 Docker 推送脚本
# 可以指定不同的项目名称

set -e

# 默认配置
DEFAULT_HARBOR_URL="hub.verycloud.cn"
DEFAULT_PROJECT_NAME="n8n-nodes"
DEFAULT_IMAGE_NAME="anywebsites"
DEFAULT_VERSION="1.1.0"

# 使用环境变量或默认值
HARBOR_URL="${HARBOR_URL:-$DEFAULT_HARBOR_URL}"
PROJECT_NAME="${PROJECT_NAME:-$DEFAULT_PROJECT_NAME}"
IMAGE_NAME="${IMAGE_NAME:-$DEFAULT_IMAGE_NAME}"
VERSION="${VERSION:-$DEFAULT_VERSION}"

echo "🚀 灵活的 Docker 镜像推送脚本"
echo "=================================================="

# 如果提供了参数，使用参数覆盖项目名称
if [ $# -gt 0 ]; then
    PROJECT_NAME="$1"
    echo "📝 使用命令行参数指定的项目名称: $PROJECT_NAME"
fi

FULL_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:${VERSION}"
LATEST_IMAGE_NAME="${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}:latest"

echo "Harbor URL: ${HARBOR_URL}"
echo "项目名称: ${PROJECT_NAME}"
echo "镜像名称: ${IMAGE_NAME}"
echo "版本标签: ${VERSION}"
echo "完整镜像名: ${FULL_IMAGE_NAME}"
echo "=================================================="

# 检查本地是否有源镜像
SOURCE_IMAGE="${DEFAULT_HARBOR_URL}/${DEFAULT_PROJECT_NAME}/${IMAGE_NAME}:${VERSION}"
if ! docker images | grep -q "${DEFAULT_HARBOR_URL}/${DEFAULT_PROJECT_NAME}/${IMAGE_NAME}"; then
    echo "❌ 源镜像不存在: ${SOURCE_IMAGE}"
    echo "请先运行 ./docker-build.sh 构建镜像"
    exit 1
fi

echo "📋 源镜像信息:"
docker images | grep "${DEFAULT_HARBOR_URL}/${DEFAULT_PROJECT_NAME}/${IMAGE_NAME}"

# 如果项目名称不同，需要重新标记镜像
if [ "$PROJECT_NAME" != "$DEFAULT_PROJECT_NAME" ]; then
    echo ""
    echo "🏷️  重新标记镜像到新项目..."
    docker tag "${SOURCE_IMAGE}" "${FULL_IMAGE_NAME}"
    docker tag "${SOURCE_IMAGE}" "${LATEST_IMAGE_NAME}"
    echo "✅ 镜像标记完成"
fi

echo ""
echo "📋 准备推送的镜像:"
docker images | grep "${HARBOR_URL}/${PROJECT_NAME}/${IMAGE_NAME}" || echo "镜像标记中..."

# 登录到 Harbor
echo ""
echo "🔐 登录到 Harbor..."
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
        echo ""
        echo "🔍 可能的原因:"
        echo "1. 项目 '${PROJECT_NAME}' 不存在"
        echo "2. 没有推送权限"
        echo "3. 网络连接问题"
        echo ""
        echo "💡 解决方案:"
        echo "1. 在 Harbor 中创建项目 '${PROJECT_NAME}'"
        echo "2. 或使用现有项目: $0 <existing-project-name>"
        exit 1
    fi
else
    echo "❌ Harbor 登录失败!"
    exit 1
fi

echo ""
echo "🎯 推送完成!"

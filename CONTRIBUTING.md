# 贡献指南

感谢您对 n8n-nodes-anywebsites 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/your-username/n8n-nodes-anywebsites/issues) 确保问题尚未被报告
2. 创建新的 Issue，包含：
   - 清晰的标题和描述
   - 重现步骤（如果是 bug）
   - 期望的行为
   - 实际的行为
   - 环境信息（n8n 版本、Node.js 版本等）

### 提交代码

1. **Fork 仓库**
   ```bash
   git clone https://github.com/your-username/n8n-nodes-anywebsites.git
   cd n8n-nodes-anywebsites
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **进行更改**
   - 遵循现有的代码风格
   - 添加或更新测试
   - 更新文档（如果需要）

5. **运行测试**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

7. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**

## 代码规范

### 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改bug的代码变动）
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: add support for private content access codes
fix: resolve authentication issue with API key
docs: update README with new configuration options
```

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 配置
- 使用 Prettier 进行代码格式化
- 为新功能添加测试
- 保持代码简洁和可读性

### 测试

- 为新功能编写单元测试
- 确保所有测试通过
- 测试覆盖率应保持在合理水平

## 开发环境设置

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/n8n-nodes-anywebsites.git
   cd n8n-nodes-anywebsites
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发模式**
   ```bash
   npm run dev
   ```

4. **构建项目**
   ```bash
   npm run build
   ```

5. **运行测试**
   ```bash
   npm test
   ```

6. **代码检查**
   ```bash
   npm run lint
   npm run format
   ```

## 发布流程

1. 更新版本号（遵循 [Semantic Versioning](https://semver.org/)）
2. 更新 CHANGELOG.md
3. 创建 Git tag
4. 发布到 npm

## 获取帮助

如果您在贡献过程中遇到问题，可以：

1. 查看现有的 [Issues](https://github.com/your-username/n8n-nodes-anywebsites/issues)
2. 创建新的 Issue 寻求帮助
3. 联系维护者

## 行为准则

请遵循我们的 [行为准则](CODE_OF_CONDUCT.md)，确保社区环境友好和包容。

感谢您的贡献！

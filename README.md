# AI情报员公开展示页

一个展示 AI情报员功能、规范、真实案例和能力边界的静态网站。页面包含浏览器内模拟体验，但不连接 Hermes、飞书、模型或搜索 API。

## 本地运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm test -- --run
npm run build
npm run test:e2e
```

## 安全边界

- 不包含服务端、数据库、身份认证或外部连接器。
- 不收集、不上传、不保存访客输入。
- 模拟发布只切换浏览器内状态，不发送真实消息。
- 仓库不得包含 `.env`、Hermes 配置、日志、Session、飞书标识或任何凭据。

## 发布流程

本地预览经用户明确确认后，才允许推送至 GitHub 并部署到 Vercel。

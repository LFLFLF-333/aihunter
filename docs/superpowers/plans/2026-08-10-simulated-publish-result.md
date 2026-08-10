# Simulated Publish Result Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在模拟审批完成后展示脱敏的飞书群发布结果截图，并支持安全、响应式的大图查看。

**Architecture:** 将用户提供的截图作为 Vite 本地静态资源导入 `DemoExperience`。发布状态继续由现有状态机控制，图片预览使用组件内部布尔状态，不增加网络请求、后端或持久化。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、Testing Library、Playwright、CSS

## Global Constraints

- 截图只在 `simulated-published` 状态显示。
- 必须标注为历史真实运行截图，并明确本次体验不会发送消息或调用 API。
- 桌面端和移动端不得产生横向溢出。
- 不连接 Hermes、飞书 API 或任何外部服务。

---

### Task 1: 发布结果组件行为

**Files:**
- Create: `src/assets/feishu-publish-result.png`
- Modify: `src/components/DemoExperience.tsx`
- Test: `src/components/DemoExperience.test.tsx`

**Interfaces:**
- Consumes: `transitionDemo(state, event)` 的 `simulated-published` 状态。
- Produces: 标题为“群内发布结果（真实案例脱敏展示）”的截图区域，以及 `role="dialog"` 的大图预览层。

- [ ] **Step 1: 写入失败测试**

```tsx
it('只在模拟发布完成后显示真实发布结果并可放大关闭', async () => {
  render(<DemoExperience />);
  expect(screen.queryByText('群内发布结果（真实案例脱敏展示）')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '开始体验' }));
  await user.click(screen.getByRole('button', { name: '完成演示处理' }));
  await user.click(screen.getByRole('button', { name: '模拟确认发布' }));
  expect(screen.getByText('群内发布结果（真实案例脱敏展示）')).toBeVisible();
  await user.click(screen.getByRole('button', { name: '放大查看群内发布结果' }));
  expect(screen.getByRole('dialog', { name: '群内发布结果大图' })).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: '群内发布结果大图' })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 验证测试因功能缺失而失败**

Run: `npm test -- src/components/DemoExperience.test.tsx`

Expected: FAIL，找不到“群内发布结果（真实案例脱敏展示）”。

- [ ] **Step 3: 添加最小实现**

在 `DemoExperience.tsx` 导入图片，增加 `previewOpen` 状态和 Escape 监听；在 `simulated-published` 分支内渲染说明、按钮图片及带关闭按钮的对话框。复制用户提供的截图为 `src/assets/feishu-publish-result.png`。

- [ ] **Step 4: 验证组件测试通过**

Run: `npm test -- src/components/DemoExperience.test.tsx`

Expected: PASS，1 test passed。

### Task 2: 响应式视觉与端到端验证

**Files:**
- Modify: `src/styles.css`
- Modify: `e2e/showcase.spec.ts`

**Interfaces:**
- Consumes: Task 1 的 `.publish-result`、`.publish-result-trigger`、`.image-lightbox` 类名。
- Produces: 容器内自适应截图和全屏大图层。

- [ ] **Step 1: 扩展端到端失败测试**

```ts
await page.getByRole('button', { name: '模拟确认发布' }).click();
await expect(page.getByRole('button', { name: '放大查看群内发布结果' })).toBeVisible();
await page.getByRole('button', { name: '放大查看群内发布结果' }).click();
await expect(page.getByRole('dialog', { name: '群内发布结果大图' })).toBeVisible();
await page.keyboard.press('Escape');
await expect(page.getByRole('dialog', { name: '群内发布结果大图' })).toBeHidden();
```

- [ ] **Step 2: 运行端到端测试并验证样式前失败**

Run: `npm run test:e2e`

Expected: FAIL，缺少新发布结果控件或预览层。

- [ ] **Step 3: 添加响应式样式**

为发布结果卡片、100% 宽度缩放图片、焦点状态、固定全屏遮罩与 `max-width`/`max-height` 大图添加 CSS；移动端保持容器宽度且不溢出。

- [ ] **Step 4: 完整验证**

Run: `npm test && npm run build && npm run test:e2e`

Expected: 所有 Vitest 和 Playwright 测试通过，Vite 构建退出码为 0。

- [ ] **Step 5: 提交实现**

```bash
git add src/assets/feishu-publish-result.png src/components/DemoExperience.tsx src/components/DemoExperience.test.tsx src/styles.css e2e/showcase.spec.ts docs/superpowers/plans/2026-08-10-simulated-publish-result.md
git commit -m "feat: show simulated Feishu publish result"
```

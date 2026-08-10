# AI情报员公开展示页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可公开展示 AI情报员功能、规范、成果和能力边界的静态网站，提供不连接真实 API 的模拟对话体验，并在用户确认本地预览后发布到 GitHub 和 Vercel。

**Architecture:** 使用 Vite、React 和 TypeScript 构建纯静态单页应用。模拟体验由浏览器内有限状态机和本地静态数据驱动，不包含服务端、数据库、身份认证或外部 API；Vercel 仅托管构建后的静态资源。

**Tech Stack:** React 19、TypeScript、Vite、CSS、Vitest、Testing Library、Playwright、GitHub、Vercel

## Global Constraints

- 页面必须明确标注“公开演示”和“不连接真实 Agent”。
- 不得包含 API Key、Token、Cookie、飞书群 ID、用户 ID、本地绝对路径、聊天记录或 Hermes 运行数据。
- 访客只能使用预设指令；不得提供连接后端的自由文本输入。
- “确认发布”只能切换本地模拟状态，不能产生任何网络消息。
- 先完成本地预览并由用户明确确认，再推送 GitHub 和部署 Vercel。
- 不添加数据库、服务端函数、身份认证、分析追踪、联系表单或第三方脚本。
- 桌面端和移动端均须可读，并支持系统减少动态效果设置。

---

## File Structure

- `package.json`：依赖和开发、测试、构建命令。
- `vite.config.ts`：Vite 与 Vitest 配置。
- `index.html`：静态入口和页面元数据。
- `src/main.tsx`：挂载 React 应用。
- `src/App.tsx`：组合页面各区块，不承载业务数据。
- `src/styles.css`：视觉系统、响应式布局和动效降级。
- `src/content/agentContent.ts`：公开文案、能力、规范、边界和效率数据。
- `src/demo/demoMachine.ts`：模拟体验状态和纯状态转换函数。
- `src/demo/demoData.ts`：预设指令、阶段内容和脱敏演示结果。
- `src/components/Hero.tsx`：首屏价值主张。
- `src/components/DemoExperience.tsx`：六阶段模拟体验和审批分支。
- `src/components/CaseStudy.tsx`：真实长图与成果说明。
- `src/components/CapabilityGrid.tsx`：能力、规范和边界。
- `src/components/HowItWorks.tsx`：真实 Agent 使用方式和技术职责。
- `src/components/SafetyNotice.tsx`：安全隔离声明。
- `src/assets/ai-intel-sample.png`：经检查后复制的 2026 年 8 月 1 日至 8 月 9 日真实长图样例。
- `src/**/*.test.tsx`、`src/**/*.test.ts`：组件和状态机单元测试。
- `e2e/showcase.spec.ts`：完整模拟流程和响应式验证。
- `.gitignore`：排除依赖、构建物、环境变量和本地预览数据。
- `README.md`：项目定位、本地运行、安全边界和部署说明。

### Task 1: 项目骨架与安全基线

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `.gitignore`

**Interfaces:**
- Produces: React 应用入口和 `App(): JSX.Element`。
- Consumes: 无。

- [ ] **Step 1: 写入应用壳测试**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('清楚标识这是不连接真实 Agent 的公开演示', () => {
    render(<App />);
    expect(screen.getByText(/公开演示/)).toBeInTheDocument();
    expect(screen.getByText(/不连接真实 Agent/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 安装依赖并运行测试，确认测试因应用尚未实现而失败**

Run: `npm install && npm test -- --run`

Expected: FAIL，提示无法找到 `./App` 或对应文字。

- [ ] **Step 3: 创建最小 Vite React 应用和安全 `.gitignore`**

`package.json` 必须提供 `dev`、`build`、`test`、`test:e2e` 和 `preview` 命令；`.gitignore` 必须包含：

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
.vercel/
.superpowers/
*.log
```

`App.tsx` 先返回包含“AI情报员公开演示”和“不连接真实 Agent”的最小页面。

- [ ] **Step 4: 运行单元测试和构建**

Run: `npm test -- --run && npm run build`

Expected: 所有测试 PASS，Vite build 成功生成 `dist/`。

- [ ] **Step 5: 提交项目骨架**

```powershell
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json index.html src/main.tsx src/App.tsx src/App.test.tsx .gitignore
git commit -m "build: scaffold agent showcase"
```

### Task 2: 演示状态机与静态内容

**Files:**
- Create: `src/demo/demoMachine.ts`
- Create: `src/demo/demoMachine.test.ts`
- Create: `src/demo/demoData.ts`
- Create: `src/content/agentContent.ts`

**Interfaces:**
- Produces: `DemoStage`、`DemoState`、`DemoEvent`、`initialDemoState`、`transitionDemo(state, event)`。
- Produces: `demoStages`、`presetPrompt`、`sampleSummary` 和页面公开内容常量。
- Consumes: 无。

- [ ] **Step 1: 编写状态机失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { initialDemoState, transitionDemo } from './demoMachine';

describe('transitionDemo', () => {
  it('只有审批后才进入模拟发布完成状态', () => {
    let state = initialDemoState;
    state = transitionDemo(state, { type: 'START' });
    state = transitionDemo(state, { type: 'COMPLETE_PROCESSING' });
    expect(state.stage).toBe('awaiting-approval');
    state = transitionDemo(state, { type: 'APPROVE' });
    expect(state.stage).toBe('simulated-published');
  });

  it('重置后不保留任何访客状态', () => {
    const state = transitionDemo({ stage: 'simulated-published', step: 6 }, { type: 'RESET' });
    expect(state).toEqual(initialDemoState);
  });
});
```

- [ ] **Step 2: 运行测试并确认状态机不存在导致失败**

Run: `npm test -- --run src/demo/demoMachine.test.ts`

Expected: FAIL，提示模块或导出不存在。

- [ ] **Step 3: 实现纯状态转换函数和六阶段静态数据**

```ts
export type DemoStage = 'idle' | 'processing' | 'awaiting-approval' | 'simulated-published';
export type DemoState = { stage: DemoStage; step: number };
export type DemoEvent =
  | { type: 'START' }
  | { type: 'NEXT_STEP' }
  | { type: 'COMPLETE_PROCESSING' }
  | { type: 'APPROVE' }
  | { type: 'RESET' };

export const initialDemoState: DemoState = { stage: 'idle', step: 0 };
```

`transitionDemo` 必须拒绝从 `idle` 直接进入发布状态，并确保 `RESET` 返回全新的初始状态。

- [ ] **Step 4: 运行状态机测试**

Run: `npm test -- --run src/demo/demoMachine.test.ts`

Expected: 2 tests PASS。

- [ ] **Step 5: 提交状态和内容模型**

```powershell
git add src/demo src/content
git commit -m "feat: add safe demo state machine"
```

### Task 3: 页面组件与确认的视觉方向

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/DemoExperience.tsx`
- Create: `src/components/CaseStudy.tsx`
- Create: `src/components/CapabilityGrid.tsx`
- Create: `src/components/HowItWorks.tsx`
- Create: `src/components/SafetyNotice.tsx`
- Create: `src/components/DemoExperience.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/assets/ai-intel-sample.png`

**Interfaces:**
- Consumes: Task 2 的 `transitionDemo`、`initialDemoState`、`demoStages` 和内容常量。
- Produces: 完整单页界面和可访问的模拟操作。

- [ ] **Step 1: 编写模拟体验组件失败测试**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DemoExperience from './DemoExperience';

describe('DemoExperience', () => {
  it('完成处理后仍须人工确认，并明确发布只是模拟', () => {
    render(<DemoExperience />);
    fireEvent.click(screen.getByRole('button', { name: /开始体验/ }));
    fireEvent.click(screen.getByRole('button', { name: /完成演示处理/ }));
    expect(screen.getByText(/等待人工确认/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /模拟确认发布/ }));
    expect(screen.getByText(/模拟发布完成/)).toBeInTheDocument();
    expect(screen.getByText(/没有发送任何真实消息/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行组件测试并确认失败**

Run: `npm test -- --run src/components/DemoExperience.test.tsx`

Expected: FAIL，提示组件不存在。

- [ ] **Step 3: 实现九个页面区块和模拟体验**

`App.tsx` 按以下顺序组合：`Hero`、`DemoExperience`、`CaseStudy`、效率对比、`CapabilityGrid`、质量规范、能力边界、`HowItWorks`、`SafetyNotice`。

`DemoExperience` 必须使用 `<button>`，提供可见焦点样式，并在所有发布状态旁显示“演示”标签。

- [ ] **Step 4: 实现响应式视觉系统**

`styles.css` 使用 CSS 自定义属性定义颜色、间距、圆角和阴影；在 `max-width: 760px` 下切换单列；使用以下规则关闭非必要动画：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: 检查并复制真实长图样例**

源文件：Hermes 输出目录中的 `ai_intel_20260801_0809.png`。先检查图片不含聊天昵称、内部路径、Token、群 ID 或私人信息，再复制为 `src/assets/ai-intel-sample.png`。

- [ ] **Step 6: 运行测试和构建**

Run: `npm test -- --run && npm run build`

Expected: 所有测试 PASS，构建成功。

- [ ] **Step 7: 提交页面实现**

```powershell
git add src index.html
git commit -m "feat: build AI intelligence agent showcase"
```

### Task 4: 端到端验证、安全扫描与本地预览

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/showcase.spec.ts`
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 3 的完整静态网站。
- Produces: 可重复的浏览器验收测试、本地预览说明和安全扫描结果。

- [ ] **Step 1: 编写端到端失败测试**

```ts
import { expect, test } from '@playwright/test';

test('访客可以完成安全的模拟流程', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('不连接真实 Agent')).toBeVisible();
  await page.getByRole('button', { name: /开始体验/ }).click();
  await page.getByRole('button', { name: /完成演示处理/ }).click();
  await expect(page.getByText(/等待人工确认/)).toBeVisible();
  await page.getByRole('button', { name: /模拟确认发布/ }).click();
  await expect(page.getByText(/没有发送任何真实消息/)).toBeVisible();
});
```

- [ ] **Step 2: 运行端到端测试并确认配置缺失导致失败**

Run: `npm run test:e2e`

Expected: FAIL，提示 Playwright 配置或浏览器尚未准备。

- [ ] **Step 3: 配置 Playwright 并补充移动端用例**

增加桌面 Chromium 和宽度 390px 的移动端项目；移动端测试必须断言页面无横向溢出：

```ts
const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
expect(hasOverflow).toBe(false);
```

- [ ] **Step 4: 编写 README**

README 必须包含项目定位、技术栈、`npm install`、`npm run dev`、`npm test`、`npm run build`、`npm run test:e2e`、安全边界和部署关卡。

- [ ] **Step 5: 运行完整验证**

Run: `npm test -- --run && npm run build && npm run test:e2e`

Expected: 单元测试、构建、桌面端和移动端端到端测试全部通过。

- [ ] **Step 6: 执行敏感信息扫描**

Run:

```powershell
rg -n -i "api[_-]?key|secret|token|cookie|oc_[a-z0-9]+|ou_[a-z0-9]+|C:\\Users|AppData|\.env" src public index.html README.md package.json
```

Expected: 除 README 中用于说明禁止项的普通单词外，不得出现任何真实凭据、飞书 ID 或本地绝对路径。

- [ ] **Step 7: 启动本地预览并交给用户确认**

Run: `npm run dev -- --host 127.0.0.1`

Expected: 提供本地预览 URL；用户检查桌面和手机布局、模拟流程、真实长图、文字和边界说明。未收到明确确认时停止在此步骤。

- [ ] **Step 8: 提交验证和文档**

```powershell
git add playwright.config.ts e2e README.md package.json package-lock.json
git commit -m "test: verify showcase experience"
```

### Task 5: GitHub 与 Vercel 发布（必须在预览获批后执行）

**Files:**
- Modify: Git remote configuration only if needed.
- Verify: GitHub repository `https://github.com/LFLFLF-333/aihunter.git`.
- Verify: Vercel production deployment.

**Interfaces:**
- Consumes: Task 4 中用户明确批准的 commit。
- Produces: GitHub 仓库链接和 Vercel 公共网址。

- [ ] **Step 1: 验证发布授权与仓库状态**

确认用户已经批准本地预览。运行 `git status --short`，预期无待提交的网站更改；运行 `git log --oneline -5`，确认所有实现和测试提交存在。

- [ ] **Step 2: 登录 GitHub 并核对远程仓库**

Run: `gh auth status`。

Expected: 已登录为有权写入 `LFLFLF-333/aihunter` 的账号。如果仓库非空，先执行只读检查并停止，请用户决定合并方式；不得覆盖远程已有内容。

- [ ] **Step 3: 配置远程并推送**

```powershell
git remote add origin https://github.com/LFLFLF-333/aihunter.git
git push -u origin master
```

如果 `origin` 已存在，先核对 URL；只有完全相同时才推送。

- [ ] **Step 4: 部署 Vercel 预览**

Run: `vercel deploy`

Expected: 返回可访问的 Preview URL。打开页面并重复模拟流程测试。

- [ ] **Step 5: 部署 Vercel Production**

在 Preview 验证通过后运行：`vercel deploy --prod`。

Expected: 返回生产 URL，页面 HTTP 状态正常，静态资源和长图加载成功。

- [ ] **Step 6: 最终线上验证**

对生产 URL 检查首屏、安全声明、完整模拟流程、移动端无横向溢出、无控制台错误；再次确认网络请求中不存在模型 API、飞书接口或第三方追踪。

- [ ] **Step 7: 交付链接**

向用户提供 GitHub 仓库链接、Vercel 生产网址、最终 commit 和验证结果。

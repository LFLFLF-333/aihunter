import { useEffect, useState } from 'react';
import { initialDemoState, transitionDemo } from '../demo/demoMachine';

const steps = [
  ['解析范围', '确认 2026 年 8 月 1 日至 8 月 9 日'],
  ['检索候选', '覆盖美国、中国、全球与新品发布'],
  ['来源核验', '优先官方公告与高可信媒体'],
  ['筛选判断', '去重、分类、排除低价值信息'],
  ['生成交付物', '文字版、来源清单与暗黑长图'],
  ['质量自检', '核对日期、链接、栏目与排版'],
];

export default function DemoExperience() {
  const [state, setState] = useState(initialDemoState);

  useEffect(() => {
    if (state.stage !== 'processing' || state.step >= 6) return;
    const timer = window.setTimeout(() => setState((value) => transitionDemo(value, { type: 'NEXT_STEP' })), 420);
    return () => window.clearTimeout(timer);
  }, [state]);

  const complete = () => setState((value) => transitionDemo(value, { type: 'COMPLETE_PROCESSING' }));

  return (
    <section className="section demo-section" id="demo" aria-labelledby="demo-title">
      <div className="section-heading">
        <span className="eyebrow">INTERACTIVE DEMO</span>
        <h2 id="demo-title">看一次真实工作流，而不是看一段宣传语</h2>
        <p>使用 8 月 1 日至 8 月 9 日的真实案例数据。演示只在你的浏览器中运行。</p>
      </div>

      <div className="demo-shell">
        <div className="demo-sidebar">
          <div className="window-dots"><i /><i /><i /></div>
          <div className="agent-avatar">AI</div>
          <strong>AI情报员</strong>
          <span className="safe-pill">安全离线演示</span>
          <div className="mini-rule"><b>人工审批是硬门槛</b><span>没有明确批准，不会进入发布步骤。</span></div>
        </div>

        <div className="conversation" aria-live="polite">
          <div className="message user-message">整理 8 月 1 日至 8 月 9 日的 AI 情报</div>
          {state.stage === 'idle' && (
            <div className="empty-demo">
              <p>点击后将模拟检索、核验、写作和审批流程。</p>
              <button className="primary-button" onClick={() => setState(transitionDemo(state, { type: 'START' }))}>开始体验</button>
            </div>
          )}

          {state.stage === 'processing' && (
            <>
              <div className="message agent-message">已确认日期范围，开始整理候选情报。</div>
              <div className="step-list">
                {steps.map(([title, detail], index) => (
                  <div className={`demo-step ${index < state.step ? 'done' : ''}`} key={title}>
                    <span>{index < state.step ? '✓' : index + 1}</span><div><b>{title}</b><small>{detail}</small></div>
                  </div>
                ))}
              </div>
              <button className="secondary-button" onClick={complete}>完成演示处理</button>
            </>
          )}

          {state.stage === 'awaiting-approval' && (
            <div className="approval-card">
              <span className="status-dot" />
              <div><b>等待人工确认</b><p>长图、文字版和来源清单已生成，当前尚未发布。</p></div>
              <button className="primary-button" onClick={() => setState(transitionDemo(state, { type: 'APPROVE' }))}>模拟确认发布</button>
            </div>
          )}

          {state.stage === 'simulated-published' && (
            <div className="published-card">
              <span className="published-icon">✓</span>
              <div><b>模拟发布完成</b><p>没有发送任何真实消息，也没有调用任何 API。</p></div>
              <button className="text-button" onClick={() => setState(transitionDemo(state, { type: 'RESET' }))}>重新体验</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

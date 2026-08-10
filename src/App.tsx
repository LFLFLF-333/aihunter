import DemoExperience from './components/DemoExperience';
import { boundaries, capabilities, standards } from './content/agentContent';
import reportImage from './assets/ai-intel-sample.png';

function App() {
  return (
    <main>
      <nav className="nav"><a className="brand" href="#top"><span>AI</span> 情报员</a><div><a href="#demo">体验</a><a href="#case">案例</a><a href="#rules">规范</a></div></nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <div className="public-badge"><span /> 公开演示 · 不连接真实 Agent</div>
          <h1>从一句日期指令，<br />到一份<span>可发布</span>的 AI 情报</h1>
          <p>自动检索、核验并提炼美国、中国及全球重要 AI 动态，生成文字版、来源清单和统一暗黑长图，经人工确认后发布。</p>
          <div className="hero-actions"><a className="primary-button" href="#demo">体验完整流程</a><a className="quiet-link" href="#case">查看真实案例 ↓</a></div>
          <div className="metric-row"><div><b>4.5–8.5h</b><span>原人工耗时</span></div><i>→</i><div><b>3–5min</b><span>最近一次实跑</span></div><div><b>3 项</b><span>同步交付物</span></div></div>
        </div>
        <div className="hero-panel">
          <div className="panel-top"><span>LIVE WORKFLOW</span><i>安全隔离</i></div>
          {['接收日期指令','多源联网检索','事实核验与筛选','生成文字与长图','人工审核确认','发布到目标群'].map((item,index)=><div className="flow-row" key={item}><span>{String(index+1).padStart(2,'0')}</span><b>{item}</b><em>{index===4?'必须':'自动'}</em></div>)}
        </div>
      </header>

      <DemoExperience />

      <section className="section case-section" id="case">
        <div className="case-copy">
          <span className="eyebrow">REAL OUTPUT · 2026.08.01—08.09</span>
          <h2>真实跑出来的成果，不是效果图</h2>
          <p>这份情报由 AI情报员完成检索、核验、筛选和排版，并在人工审核后通过飞书发布。网页只展示脱敏后的公开产物。</p>
          <div className="case-facts"><div><b>10</b><span>重大情报</span></div><div><b>3</b><span>地区分区</span></div><div><b>4</b><span>重点新品</span></div></div>
          <ul><li>美国、中国、全球/其他地区分区</li><li>逐条呈现重要性、影响与信息性质</li><li>固定暗黑科技风，移动端高清长图</li></ul>
        </div>
        <figure className="report-frame"><img src={reportImage} alt="AI情报员生成的2026年8月1日至8月9日暗黑风AI情报长图" /><figcaption>真实案例长图 · 点击或滚动页面查看细节</figcaption></figure>
      </section>

      <section className="section" id="capabilities"><div className="section-heading"><span className="eyebrow">CAPABILITIES</span><h2>它不是新闻搬运工，而是一套情报判断系统</h2></div><div className="capability-grid">{capabilities.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="section rules-section" id="rules">
        <div className="rules-main"><span className="eyebrow">QUALITY CONTRACT</span><h2>质量标准写进流程，而不是留给运气</h2><div className="check-list">{standards.map(item=><div key={item}><span>✓</span>{item}</div>)}</div></div>
        <aside><span className="aside-label">HUMAN IN THE LOOP</span><h3>正式发布前，必须停下来等人确认</h3><p>修改意见会触发重新核验和自检。含义模糊的回复不能视为批准。</p><div className="approval-flow"><span>待审核</span><i>→</i><span>人工确认</span><i>→</i><span>允许发布</span></div></aside>
      </section>

      <section className="section boundary-section"><div className="section-heading"><span className="eyebrow">SAFE BY DESIGN</span><h2>看起来像真实体验，但权限和数据完全隔离</h2></div><div className="boundary-grid">{boundaries.map(([title,text])=><article key={title}><span>—</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="section architecture"><div><span className="eyebrow">HOW IT WORKS</span><h2>三个工具，各做一件清楚的事</h2></div><div className="tool-row"><article><b>Codex</b><p>设计岗位、工作流、Profile，并维护公开展示页。</p></article><article><b>Hermes</b><p>运行 Agent，执行检索、核验、内容生成和审批控制。</p></article><article><b>飞书</b><p>接收任务、提交审核，并在明确批准后完成群内发布。</p></article></div></section>

      <footer><div className="brand"><span>AI</span> 情报员</div><p>本页面是公开作品展示与静态模拟体验，不是在线 Agent 服务入口。</p><span>NO API · NO PRIVATE DATA · NO EXTERNAL CALLS</span></footer>
    </main>
  );
}

export default App;

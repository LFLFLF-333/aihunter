import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(cleanup);

describe('App', () => {
  it('清楚标识这是不连接真实 Agent 的公开演示', () => {
    render(<App />);
    expect(screen.getAllByText(/公开演示/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/不连接真实 Agent/).length).toBeGreaterThan(0);
  });

  it('展示最近一次实跑耗时为 3–5 分钟', () => {
    render(<App />);
    expect(screen.getByText('3–5min')).toBeVisible();
    expect(screen.queryByText('约 40min')).not.toBeInTheDocument();
  });
});

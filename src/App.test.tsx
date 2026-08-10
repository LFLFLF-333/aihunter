import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('清楚标识这是不连接真实 Agent 的公开演示', () => {
    render(<App />);
    expect(screen.getAllByText(/公开演示/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/不连接真实 Agent/).length).toBeGreaterThan(0);
  });
});

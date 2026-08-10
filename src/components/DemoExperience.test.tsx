import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DemoExperience from './DemoExperience';

afterEach(cleanup);

describe('DemoExperience', () => {
  it('明确要求人工确认，且发布只发生在浏览器中', () => {
    render(<DemoExperience />);
    fireEvent.click(screen.getByRole('button', { name: /开始体验/ }));
    fireEvent.click(screen.getByRole('button', { name: /完成演示处理/ }));
    expect(screen.getByText(/等待人工确认/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /模拟确认发布/ }));
    expect(screen.getByText(/模拟发布完成/)).toBeInTheDocument();
    expect(screen.getByText(/没有发送任何真实消息/)).toBeInTheDocument();
  });

  it('只在模拟发布完成后显示真实发布结果并可放大关闭', () => {
    render(<DemoExperience />);
    expect(screen.queryByText('群内发布结果（真实案例脱敏展示）')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /开始体验/ }));
    fireEvent.click(screen.getByRole('button', { name: /完成演示处理/ }));
    fireEvent.click(screen.getByRole('button', { name: /模拟确认发布/ }));

    expect(screen.getByText('群内发布结果（真实案例脱敏展示）')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '放大查看群内发布结果' }));
    expect(screen.getByRole('dialog', { name: '群内发布结果大图' })).toBeVisible();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: '群内发布结果大图' })).not.toBeInTheDocument();
  });
});

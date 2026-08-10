import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DemoExperience from './DemoExperience';

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
});

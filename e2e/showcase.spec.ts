import { expect, test } from '@playwright/test';

test('访客可以完成安全的模拟流程', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('不连接真实 Agent').first()).toBeVisible();
  await page.getByRole('button', { name: '开始体验' }).click();
  await page.getByRole('button', { name: '完成演示处理' }).click();
  await expect(page.getByText('等待人工确认')).toBeVisible();
  await page.getByRole('button', { name: '模拟确认发布' }).click();
  await expect(page.getByText('没有发送任何真实消息，也没有调用任何 API。')).toBeVisible();
});

test('页面没有横向溢出', async ({ page }) => {
  await page.goto('/');
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});

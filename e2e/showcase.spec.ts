import { expect, test } from '@playwright/test';

test('访客可以完成安全的模拟流程', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('不连接真实 Agent').first()).toBeVisible();
  await page.getByRole('button', { name: '开始体验' }).click();
  await page.getByRole('button', { name: '完成演示处理' }).click();
  await expect(page.getByText('等待人工确认')).toBeVisible();
  await page.getByRole('button', { name: '模拟确认发布' }).click();
  await expect(page.getByText('没有发送任何真实消息，也没有调用任何 API。')).toBeVisible();
  await expect(page.getByText('群内发布结果（真实案例脱敏展示）')).toBeVisible();
  await page.getByRole('button', { name: '放大查看群内发布结果' }).click();
  await expect(page.getByRole('dialog', { name: '群内发布结果大图' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '群内发布结果大图' })).toBeHidden();

  const publishedResultOverflows = await page.getByRole('button', { name: '放大查看群内发布结果' }).evaluate((element) => {
    const image = element.querySelector('img');
    return !image || image.getBoundingClientRect().width > element.getBoundingClientRect().width;
  });
  expect(publishedResultOverflows).toBe(false);
});

test('页面没有横向溢出', async ({ page }) => {
  await page.goto('/');
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});

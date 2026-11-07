// E2E tests: Village tab — acceptance criteria coverage
import { test, expect } from '@playwright/test';

test.describe('Village tab — Lite Track Milestone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[role="tablist"]')).toBeVisible();
  });

  test('A1: Village tab registered as third tab between Team and Operations', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBeGreaterThanOrEqual(3);
    await expect(tabs.nth(1)).toHaveText('Village');
  });

  test('A2: Village tab renders SVG map with correct viewBox', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    const svg = page.locator('svg.v-map');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('viewbox', /0\s+0\s+800\s+600/i);
  });

  test('A3: Four buildings rendered — HQ, Engineering, R&D, Creative', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    const svg = page.locator('svg.v-map');
    await expect(svg.locator('text:has-text("HQ")')).toBeVisible();
    await expect(svg.locator('text:has-text("Engineering")')).toBeVisible();
    await expect(svg.locator('text:has-text("R&D")')).toBeVisible();
    await expect(svg.locator('text:has-text("Creative")')).toBeVisible();
  });

  test('A4: Three dashed paths drawn HQ → each department', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    const svg = page.locator('svg.v-map');
    const paths = svg.locator('polyline');
    expect(await paths.count()).toBe(3);
  });

  test('A5: Character tokens rendered as clickable circles', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    const chars = page.locator('.v-char');
    expect(await chars.count()).toBeGreaterThanOrEqual(2);
    // Check interactive attributes
    await expect(chars.first()).toHaveAttribute('role', 'button');
    await expect(chars.first()).toHaveAttribute('tabindex', '0');
  });

  test('A6: Click character opens profile drawer', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    await page.locator('.v-char').first().click();
    await expect(page.locator('.o-drawer')).toBeVisible({ timeout: 5000 });
  });

  test('A7: Drawer closes on Escape key', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    await page.locator('.v-char').first().click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.o-drawer')).not.toBeVisible();
  });

  test('A8: Drawer closes on overlay background click', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    await page.locator('.v-char').first().click();
    await page.mouse.click(10, 10); // top-left corner of overlay
    await expect(page.locator('.o-drawer')).not.toBeVisible();
  });

  test('A9: Legend shows team colors + Owner', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    const legend = page.locator('.v-legend');
    await expect(legend).toBeVisible();
    const items = legend.locator('.v-legend-item');
    expect(await items.count()).toBeGreaterThanOrEqual(4);
  });

  test('A10: Keyboard Enter opens drawer', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    await page.locator('.v-char').first().focus();
    await page.locator('.v-char').first().press('Enter');
    await expect(page.locator('.o-drawer')).toBeVisible({ timeout: 5000 });
  });

  test('A11: Keyboard Space opens drawer', async ({ page }) => {
    await page.locator('[role="tab"]').nth(1).click();
    await page.locator('.v-char').first().focus();
    await page.locator('.v-char').first().press('Space');
    await expect(page.locator('.o-drawer')).toBeVisible({ timeout: 5000 });
  });
});

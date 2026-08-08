import { test, expect } from '@playwright/test';

test.describe('FU-DEVER Landing Page Tests', () => {
  
  test('should display the home page with Hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check if Hero Section text is visible
    await expect(page.getByText('WORK HARD - PLAY HARD')).toBeVisible();
    await expect(page.getByText('FU-DEVER').first()).toBeVisible();
  });



  test('should navigate to new pages via Header', async ({ page }) => {
    await page.goto('/');
    
    // Click Blog
    await page.getByRole('button', { name: 'Blog' }).first().click({ force: true });
    await expect(page.getByRole('heading', { name: 'Tech Blog & Tin tức' })).toBeVisible();

    // Click Events
    await page.getByRole('button', { name: 'Sự kiện' }).first().click({ force: true });
    await expect(page.getByRole('heading', { name: 'Lịch Sự Kiện' })).toBeVisible();

    // Click Alumni
    await page.getByRole('button', { name: 'Cựu thành viên' }).first().click({ force: true });
    await expect(page.getByRole('heading', { name: 'Hall of Fame' })).toBeVisible();
  });

  test('should display Member Showcase in Projects page', async ({ page }) => {
    await page.goto('/project');
    
    // Scroll down to Member Showcase or wait for it
    await expect(page.getByRole('heading', { name: 'Dự Án Cá Nhân & Open Source' })).toBeVisible();
    await expect(page.getByText('dever-cli')).toBeVisible();
  });
});

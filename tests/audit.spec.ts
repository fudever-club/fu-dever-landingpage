import { test, expect } from '@playwright/test';

// Every browser request is either local or stubbed, including telemetry.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' && ['3100', '5100'].includes(url.port)) {
      await route.continue();
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":[]}' });
    }
  });
});

const searchResult = (title: string) => ({
  status: 'success', data: [{ id: title, title, category: 'Blog', url: '/blog', subtitle: 'Fixture' }],
});

test('search keeps the newest response when an older query finishes later', async ({ page }) => {
  let releaseOld!: () => void;
  const oldGate = new Promise<void>((resolve) => { releaseOld = resolve; });
  let markOldStarted!: () => void;
  const oldStarted = new Promise<void>((resolve) => { markOldStarted = resolve; });
  await page.route('**/api/v1/search?**', async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'old') { markOldStarted(); await oldGate; }
    await route.fulfill({ json: searchResult(q === 'old' ? 'Older result' : 'Newest result') });
  });
  await page.goto('/');
  await expect(async () => {
    await page.getByRole('button', { name: 'Mở tìm kiếm', exact: true }).click();
    await expect(page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false })).toBeVisible();
  }).toPass();
  const input = page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false });
  await input.fill('old');
  await oldStarted;
  await input.fill('new');
  await expect(page.getByText('Newest result', { exact: true })).toBeVisible();
  releaseOld();
  // Allow the held response to finish before asserting it cannot replace the current result.
  await page.waitForTimeout(400);
  await expect(page.getByText('Newest result', { exact: true })).toBeVisible();
  await expect(page.getByText('Older result', { exact: true })).toHaveCount(0);
});

test('clearing search dismisses errors and stale responses', async ({ page }) => {
  await page.route('**/api/v1/search?**', (route) => route.fulfill({ status: 500, json: {} }));
  await page.goto('/');
  await expect(async () => {
    await page.getByRole('button', { name: 'Mở tìm kiếm', exact: true }).click();
    await expect(page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false })).toBeVisible();
  }).toPass();
  const input = page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false });
  await input.fill('fail');
  await expect(page.getByText('Lỗi khi tìm kiếm dữ liệu từ máy chủ.')).toBeVisible();
  await input.fill('');
  await expect(page.getByText('Lỗi khi tìm kiếm dữ liệu từ máy chủ.')).toHaveCount(0);
});

test('Enter follows the focused search result rather than the arrow selection', async ({ page }) => {
  await page.route('**/api/v1/search?**', (route) => route.fulfill({ json: {
    status: 'success', data: [
      { id: 'first', title: 'First fixture', category: 'Blog', url: '/blog', subtitle: '' },
      { id: 'second', title: 'Second fixture', category: 'Event', url: '/events', subtitle: '' },
    ],
  } }));
  await page.goto('/');
  await expect(async () => {
    await page.getByRole('button', { name: 'Mở tìm kiếm', exact: true }).click();
    await expect(page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false })).toBeVisible();
  }).toPass();
  await page.getByPlaceholder('Nhập từ khóa tìm kiếm', { exact: false }).fill('fixture');
  const second = page.getByRole('link', { name: 'Second fixture' });
  await expect(second).toBeVisible();
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/events');
});

for (const kind of ['member', 'album'] as const) {
  test(`${kind} continues loading after a successful retry`, async ({ page }) => {
    const pages: string[] = [];
    // The trailing `*` (not `?**`) also matches the initial server fetch,
    // which carries no query string; it must return a named album or the
    // page 404s before client pagination starts.
    const pattern = kind === 'member' ? '**/api/v1/users?**' : '**/api/v1/album/fixture-album*';
    await page.route(pattern, async (route) => {
      const pageNumber = new URL(route.request().url()).searchParams.get('page');
      if (!pageNumber) {
        await route.fulfill({ json: { data: { album: { slug: 'fixture-album', name: 'Fixture album', imageList: [] } } } });
        return;
      }
      pages.push(pageNumber);
      if (pages.length === 1) {
        await route.fulfill({ status: 503, json: {} });
        return;
      }
      const users = pageNumber === '2' ? [{ _id: 'retried-member', firstname: 'Retried', lastname: 'member', avatar: '/icons/layout/logo.png' }] : [];
      const imageList = pageNumber === '2' ? [{ url: '/icons/layout/logo.png' }] : [];
      await route.fulfill({ json: kind === 'member'
        ? { currentPage: Number(pageNumber), totalPages: 3, data: { users } }
        : { data: { album: { imageList }, pagination: { currentPage: Number(pageNumber), totalPages: 3 } } },
      });
    });
    await page.goto(kind === 'member' ? '/member' : '/activity/fixture-album');
    await page.locator('main').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Thử lại', exact: true })).toHaveCount(0);
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      return pages;
    }).toEqual(['2', '2', '3']);
    if (kind === 'member') await expect(page.getByRole('heading', { name: 'Retried member', exact: true })).toHaveCount(1);
    else await expect(page.locator('main ul img')).toHaveCount(1);
  });

  test(`${kind} pagination retries the failed page and stops after an empty page`, async ({ page }) => {
    const pages: string[] = [];
    const pattern = kind === 'member' ? '**/api/v1/users?**' : '**/api/v1/album/fixture-album*';
    await page.route(pattern, async (route) => {
      const pageNumber = new URL(route.request().url()).searchParams.get('page');
      if (!pageNumber) {
        await route.fulfill({ json: { data: { album: { slug: 'fixture-album', name: 'Fixture album', imageList: [] } } } });
        return;
      }
      pages.push(pageNumber);
      if (pages.length === 1) {
        await route.fulfill({ status: 503, json: {} });
      } else {
        // Missing pagination metadata must not leave an endless loading sentinel.
        await route.fulfill({ json: { data: kind === 'member' ? { users: [] } : { album: { imageList: [] } } } });
      }
    });
    await page.goto(kind === 'member' ? '/member' : '/activity/fixture-album');
    await expect(page.getByRole('heading', { name: kind === 'member' ? 'Những thành viên đầy nhiệt huyết' : 'FIXTURE ALBUM', exact: true })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => pages.length).toBe(1);
    const retry = page.getByRole('button', { name: 'Thử lại', exact: true });
    await expect(retry).toBeVisible();
    await retry.click();
    await expect(retry).toHaveCount(0);
    await expect.poll(() => pages).toEqual(['2', '2']);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    expect(pages).toEqual(['2', '2']);
  });
}

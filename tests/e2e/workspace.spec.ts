import { test, expect } from '@playwright/test'
test('admin CRUD, SSR session and viewer authorization', async ({
  page,
  browser,
}) => {
  await page.goto('/countries')
  await expect(page).toHaveURL(/login/)
  await page.getByLabel('Email', { exact: true }).fill('admin@example.com')
  await page.getByLabel('Mật khẩu', { exact: true }).fill('Demo@12345')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page).toHaveURL('/')
  await page.getByRole('link', { name: 'Quốc gia', exact: true }).click()
  await expect(page.getByText('Việt Nam', { exact: true })).toBeVisible()
  const adminCookie = (await page.context().cookies())
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const html = await (
    await page.request.get('/countries', { headers: { Cookie: adminCookie } })
  ).text()
  expect(html).toContain('Việt Nam')
  expect(html).not.toContain('e2e-only-secret-not-for-deployment')
  const hydrationErrors: string[] = []
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) hydrationErrors.push(message.text())
  })
  let hydrationFetches = 0
  page.on('request', (request) => {
    if (request.url().includes('/api/backend/countries')) hydrationFetches++
  })
  await page.reload()
  await expect(page.getByText('Việt Nam', { exact: true })).toBeVisible()
  expect(hydrationErrors).toEqual([])
  expect(hydrationFetches).toBe(0)
  await page.getByRole('button', { name: 'Thêm quốc gia', exact: true }).click()
  await page.getByLabel('Mã quốc gia (2 chữ cái)').fill('DE')
  await page.getByLabel('Tên quốc gia').fill('Germany')
  await page.getByRole('button', { name: 'Lưu quốc gia' }).click()
  await expect(page.getByText('Germany', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Sửa Germany', exact: true }).click()
  await page.getByLabel('Tên quốc gia').fill('Đức')
  await page.getByRole('button', { name: 'Lưu quốc gia' }).click()
  await expect(page.getByText('Đức', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Xóa Đức', exact: true }).click()
  await page.getByRole('button', { name: 'Xác nhận xóa' }).click()
  await expect(page.getByText('Đức', { exact: true })).toHaveCount(0)
  const viewer = await browser.newContext({ baseURL: 'http://127.0.0.1:3000' })
  const tab = await viewer.newPage()
  await tab.goto('/login')
  await tab.getByLabel('Email', { exact: true }).fill('viewer@example.com')
  await tab.getByLabel('Mật khẩu', { exact: true }).fill('Demo@12345')
  await tab.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(tab).toHaveURL('/')
  await tab.goto('/countries')
  await expect(
    tab.getByRole('button', { name: 'Thêm quốc gia', exact: true }),
  ).toHaveCount(0)
  const viewerCookie = (await viewer.cookies())
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const response = await viewer.request.post('/api/backend/countries', {
    headers: { Origin: 'http://127.0.0.1:3000', Cookie: viewerCookie },
    data: { code: 'DE', name: 'Germany', region: 'Europe', active: true },
  })
  expect(response.status()).toBe(403)
  await viewer.close()
})

test('BFF rejects anonymous, CSRF and unlisted routes', async ({ request }) => {
  expect((await request.get('/api/backend/countries')).status()).toBe(401)
  expect(
    (await request.get('/api/backend/https://evil.example')).status(),
  ).toBe(404)
  expect(
    (
      await request.post('/api/auth/login', {
        headers: { Origin: 'https://evil.example' },
        data: { email: 'admin@example.com', password: 'Demo@12345' },
      })
    ).status(),
  ).toBe(403)
  const login = await request.post('/api/auth/login', {
    headers: { Origin: 'http://127.0.0.1:3000' },
    data: { email: 'admin@example.com', password: 'Demo@12345' },
  })
  expect(login.status()).toBe(200)
  expect(await login.json()).not.toHaveProperty('accessToken')
  // Secure cookies are not replayed by APIRequestContext over local HTTP. Browser navigation still exercises real cookie handling.
  const cookie = login
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .at(-1)!
    .value.split(';')[0]!
  const authenticatedHeaders = {
    Origin: 'http://127.0.0.1:3000',
    Cookie: cookie,
  }
  expect(
    (
      await request.post('/api/backend/countries', {
        headers: authenticatedHeaders,
        data: { code: 'invalid' },
      })
    ).status(),
  ).toBe(422)
  expect(
    (
      await request.post('/api/backend/countries', {
        headers: authenticatedHeaders,
        data: { code: 'VN', name: 'Viet Nam', region: 'Asia', active: true },
      })
    ).status(),
  ).toBe(409)
})

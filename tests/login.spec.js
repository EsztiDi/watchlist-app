const { test, expect } = require("@playwright/test");

test("email login test", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const title = page.locator(
    ".MuiContainer-root > .MuiPaper-root > .MuiPaper-root:nth-child(1) > .MuiTypography-root:nth-child(1)"
  );
  await expect(title).toContainText(/Welcome/);

  // Click text=Log in
  await page.click("text=Log in");
  await expect(page).toHaveURL("http://localhost:3000/login");

  // Click button:has-text("Log in with email")
  await page.click('button:has-text("Log in with email")');

  // Fill input[name="email"]
  await page.fill('input[name="email"]', "esztidi@gmail.com");

  // Click button:has-text("Send link")
  await page.click('button:has-text("Send link")');

  const alert = page.locator(
    'div[role="alert"]:has-text("A sign in link has been sent to your email address.")'
  );
  await expect(alert).toBeVisible();

  await page.screenshot({ path: `tests/screenshots/emailLogin.png` });
});

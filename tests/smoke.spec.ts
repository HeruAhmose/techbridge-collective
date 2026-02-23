import { test, expect } from "@playwright/test";

const real = process.env.CHATBASE_E2E_REAL === "1";

test.describe("smoke", () => {
  test("H.K. button exists and fires open()", async ({ page }) => {
    if (!real) {
      await page.addInitScript(() => {
        (window as any).__hkOpenCalls = 0;
        (window as any).chatbase = new Proxy(
          (..._args: any[]) => undefined,
          {
            get(_t, prop) {
              if (prop === "open")     return () => { (window as any).__hkOpenCalls += 1; };
              if (prop === "getState") return () => "initialized";
              return () => undefined;
            },
          },
        );
      });
    }

    await page.goto("/");

    // Wait for button to become enabled (useChatbase polling resolves)
    const btn = page.getByRole("button", { name: /Ask H\.K\. AI/i });
    await expect(btn).toBeEnabled({ timeout: 8000 });
    await btn.click();

    if (!real) {
      await expect.poll(async () => page.evaluate(() => (window as any).__hkOpenCalls)).toBe(1);
    } else {
      await page.waitForFunction(
        () => !!document.querySelector('script[src="https://www.chatbase.co/embed.min.js"]'),
        null,
        { timeout: 60_000 },
      );
    }
  });

  test("primary CTAs navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Find Help Near Me" }).click();
    await expect(page).toHaveURL(/\/get-help/);
    await page.goto("/");
    await page.getByRole("link", { name: "Host a Hub" }).first().click();
    await expect(page).toHaveURL(/\/host-a-hub/);
  });

  test("health endpoint returns 200", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("public pages load without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    for (const path of ["/", "/get-help", "/host-a-hub", "/impact", "/about"]) {
      errors.length = 0;
      await page.goto(path);
      expect(errors, `JS errors on ${path}`).toHaveLength(0);
    }
  });
});

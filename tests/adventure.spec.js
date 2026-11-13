import { test, expect } from "@playwright/test";

test("полное приключение, десять попыток и перезапуск", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Привет, Фидан!♡" }),
  ).toBeVisible();
  await page.getByLabel("Как ты себя чувствуешь?").fill("Сегодня отлично!");
  await page.getByRole("button", { name: "Отправить" }).click();
  await page.getByRole("button", { name: "Ладно, дальше" }).click();
  const no = page.getByRole("button", { name: "Нет 🙄", exact: true });
  const yes = page.getByRole("button", { name: "ДААА, КОНЕЧНО!" });
  let previous;
  for (let attempt = 0; attempt < 10; attempt++) {
    const bounds = await no.boundingBox();
    const yesBounds = await yes.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(
      page.viewportSize().width,
    );
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(
      page.viewportSize().height,
    );
    expect(
      bounds.y >= yesBounds.y + yesBounds.height ||
        bounds.x >= yesBounds.x + yesBounds.width ||
        bounds.x + bounds.width <= yesBounds.x,
    ).toBeTruthy();
    if (previous)
      expect(
        Math.hypot(bounds.x - previous.x, bounds.y - previous.y),
      ).toBeGreaterThan(5);
    previous = bounds;
    await no.click();
    await page.waitForTimeout(350);
  }
  await expect(no).toHaveCount(0);
  await expect(
    page.getByText("Кажется, остался только один правильный ответ"),
  ).toBeVisible();
  await yes.click();
  await page.getByRole("button", { name: "Какой?" }).click();
  const slider = page.getByRole("slider");
  await expect(slider).toHaveValue("20");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(page.getByText("Ну, уже лучше...")).toBeVisible();
  await slider.press("End");
  await expect(page.getByText("Больше, чем")).toBeVisible();
  await page.getByRole("button", { name: "Последний сюрприз" }).click();
  await page.getByRole("button", { name: "Открыть письмо от Мехди" }).click();
  await expect(page.getByText("Если вдруг загрустишь")).toBeVisible();
  await page.getByRole("button", { name: "Начать сначала" }).click();
  await expect(page.getByLabel("Как ты себя чувствуешь?")).toHaveValue("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test("обычная анимация разрушения и мобильная компоновка", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Отправить" }).click();
  await page.getByRole("button", { name: "Ладно, дальше" }).click();
  await page.getByRole("button", { name: "ДААА, КОНЕЧНО!" }).click();
  await page.getByRole("button", { name: "Какой?" }).click();
  await page.getByRole("slider").focus();
  await page.getByRole("slider").press("End");
  await expect(page.locator(".cracks")).toBeVisible();
  await expect(page.locator(".shards span")).toHaveCount(8);
  await expect(page.locator(".cosmic")).toBeVisible({ timeout: 6000 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

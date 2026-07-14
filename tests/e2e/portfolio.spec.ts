import { expect, test } from "@playwright/test";

test("visitors can navigate the primary portfolio sections", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hey! I'm Devion's AI Twin" })
  ).toBeVisible();

  await page.getByRole("tab", { name: "Projects" }).click();
  await expect(
    page.getByRole("heading", {
      name: "From customer problem to production path",
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Asterly Support Intelligence Agent" })
  ).toBeVisible();

  await page.getByRole("tab", { name: "Resume" }).click();
  await expect(page.getByRole("heading", { name: "Devion Tharpe" })).toBeVisible();
  await expect(page.getByText("Senior Solutions Engineer").first()).toBeVisible();

  await page.getByRole("tab", { name: "Contact" }).click();
  await expect(page.getByRole("link", { name: /Cal\.com/ })).toHaveAttribute(
    "href",
    "https://cal.com/dtharpe"
  );

  await page.getByRole("tab", { name: "Chat" }).click();
  await expect(
    page.getByLabel("Ask Devion's AI Twin a question")
  ).toBeVisible();
});

test("tab navigation supports arrow keys", async ({ page }) => {
  await page.goto("/");
  const chatTab = page.getByRole("tab", { name: "Chat" });
  await chatTab.focus();
  await page.keyboard.press("ArrowRight");

  await expect(page.getByRole("tab", { name: "Projects" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

test("chat sends the AI SDK v6 request payload", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Chat smoke response" }),
    });
  });
  await page.goto("/");

  const requestPromise = page.waitForRequest("**/api/chat");
  await page
    .getByLabel("Ask Devion's AI Twin a question")
    .fill("Tell me about Devion");
  await page.getByRole("button", { name: "Send message" }).click();

  const payload = (await requestPromise).postDataJSON();
  expect(Object.keys(payload).sort()).toEqual(["id", "messages", "trigger"]);
  expect(payload).toMatchObject({
    id: expect.any(String),
    trigger: "submit-message",
    messages: [
      {
        id: expect.any(String),
        role: "user",
        parts: [{ type: "text", text: "Tell me about Devion" }],
      },
    ],
  });
});

test("chat and voice modes preserve the same responsive content frame", async ({
  page,
}) => {
  await page.goto("/");

  const content = page.getByTestId("chat-mode-content");
  const textBounds = await content.boundingBox();
  expect(textBounds).not.toBeNull();

  await page.getByRole("button", { name: "Voice" }).click();
  await expect(
    page.getByRole("heading", { name: "Voice Chat with Devion's AI Twin" })
  ).toBeVisible();

  const voiceBounds = await content.boundingBox();
  expect(voiceBounds).not.toBeNull();
  expect(Math.abs(voiceBounds!.width - textBounds!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(voiceBounds!.height - textBounds!.height)).toBeLessThanOrEqual(1);

  const colors = await page.locator("body").evaluate((body) => {
    const styles = getComputedStyle(body);
    const lightness = (color: string) =>
      Number(color.match(/(?:oklch|lab)\(([\d.]+)/)?.[1] ?? 100);
    return {
      backgroundLightness: lightness(styles.backgroundColor),
      foregroundLightness: lightness(styles.color),
      colorScheme: styles.colorScheme,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  expect(colors.backgroundLightness).toBeLessThan(20);
  expect(colors.foregroundLightness).toBeGreaterThan(80);
  expect(colors.colorScheme).toBe("dark");
  expect(colors.hasHorizontalOverflow).toBe(false);
});

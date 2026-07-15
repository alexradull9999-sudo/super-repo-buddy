import { createServerFn } from "@tanstack/react-start";

const CHAT_ID = "5874913931";

export const sendTelegramNotification = createServerFn({ method: "POST" })
  .inputValidator((data: { text: string }) => {
    if (!data || typeof data.text !== "string") {
      throw new Error("text is required");
    }
    if (data.text.length > 3500) {
      throw new Error("text is too long");
    }
    return { text: data.text };
  })
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
      throw new Error("Telegram credentials are not configured");
    }

    const response = await fetch(
      "https://connector-gateway.lovable.dev/telegram/sendMessage",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: data.text,
          parse_mode: "HTML",
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Telegram gateway failed [${response.status}]: ${errorBody}`,
      );
      throw new Error(`Telegram request failed [${response.status}]`);
    }

    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (result.ok === false) {
      console.error("Telegram API error:", result);
      throw new Error(result.error ?? "Telegram API error");
    }

    return { ok: true };
  });

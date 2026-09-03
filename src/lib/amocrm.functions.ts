import { createServerFn } from "@tanstack/react-start";

const AMO_FORM_ID = "1735910";
const AMO_FORM_HASH = "103ca50e57e1c0cf00fe542d12655e0d";
const AMO_PHONE_FIELD = "fields[80355_1][121429]";
const AMO_NOTE_FIELD = "fields[note_2]";

export const sendAmoLead = createServerFn({ method: "POST" })
  .inputValidator((data: { phone: string; comment?: string }) => {
    if (!data || typeof data.phone !== "string" || data.phone.trim().length < 5) {
      throw new Error("phone is required");
    }
    return {
      phone: data.phone.trim().slice(0, 40),
      comment: (data.comment ?? "").toString().slice(0, 1000),
    };
  })
  .handler(async ({ data }) => {
    const body = new FormData();
    body.append("form_id", AMO_FORM_ID);
    body.append("hash", AMO_FORM_HASH);
    body.append(AMO_PHONE_FIELD, data.phone);
    body.append(AMO_NOTE_FIELD, data.comment);
    body.append(
      "user_origin",
      JSON.stringify({
        datetime: new Date().toString(),
        timezone: "UTC",
        referer: "https://ref-express.site/",
      }),
    );

    const response = await fetch("https://forms.amocrm.ru/queue/add", {
      method: "POST",
      body,
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`amoCRM form failed [${response.status}]: ${text}`);
      throw new Error(`amoCRM request failed [${response.status}]`);
    }

    return { ok: true, response: text };
  });

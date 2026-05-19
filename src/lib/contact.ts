import { createServerFn } from "@tanstack/react-start";

type ContactData = {
  name: string;
  email: string;
  message: string;
};

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as ContactData)
  .handler(async ({ data }) => {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "44f019d2-988a-4f3c-b08d-b7d31138b24c",
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    return res.json() as Promise<{ success: boolean; message: string }>;
  });

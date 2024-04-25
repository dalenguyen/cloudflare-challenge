import { defineEventHandler, readBody, getRequestURL, createError } from "h3";
import { ACCOUNT_ID, AI_TOKEN, imageToText } from "../../services";

// const MODEL = "@cf/meta/llama-3-8b-instruct";
const MODEL = "@cf/meta/llama-2-7b-chat-fp16";

export default defineEventHandler(async (event) => {
  const requestURL = await getRequestURL(event);

  // TODO: improve the security check for invalid requests
  if (
    !requestURL.origin.includes("localhost") &&
    !requestURL.origin.includes("pages.dev")
  ) {
    throw createError({
      statusMessage: "Unauthorized Request!",
      statusCode: 403,
    });
  }

  const { chats } = await readBody(event);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AI_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    messages: [
      {
        role: "system",
        content: "You are a friendly assistant",
      },
      ...chats,
    ],
    max_tokens: 256,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const result = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`,
      requestOptions,
    ).then((response) => response.json());

    return result;
  } catch (error) {
    return error;
  }
});

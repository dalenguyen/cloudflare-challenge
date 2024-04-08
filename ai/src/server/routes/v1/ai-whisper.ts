const ACCOUNT_ID = process.env["CF_ACCOUNT_ID"];
const AI_TOKEN = process.env["WORKER_AI_TOKEN"];

const MODEL = "@cf/openai/whisper";

import { defineEventHandler, readBody, getRequestURL, createError } from "h3";

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

  const { data } = await readBody(event);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AI_TOKEN}`);
  myHeaders.append("Content-Type", "audio/wav");

  const body = Buffer.from(data, "base64");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`,
      requestOptions
    ).then((response) => response.json());

    return response.result;
  } catch (error) {
    return error;
  }
});

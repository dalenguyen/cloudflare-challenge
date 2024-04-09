import { defineEventHandler, readBody, getRequestURL, createError } from "h3";
import { AI_TOKEN, imageToText } from "../../services";

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

  const { prompt } = await readBody(event);
  return imageToText(prompt);
});

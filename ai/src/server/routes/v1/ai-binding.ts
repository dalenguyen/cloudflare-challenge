import {
  defineEventHandler,
  readBody,
  getRequestURL,
  createError,
  getRequestHeaders,
} from "h3";
import { Ai } from "@cloudflare/ai";

const cloudflareRequestContextSymbol = Symbol.for(
  "__cloudflare-request-context__"
);

const ACCOUNT_ID = process.env["CF_ACCOUNT_ID"];
const AI_TOKEN = process.env["WORKER_AI_TOKEN"];

interface Env {
  AI: any;
}

export default defineEventHandler(async (event) => {
  const context = event.context;
  const headers = getRequestHeaders(event);

  const cloudflareRequestContext =
    (
      globalThis as unknown as {
        [cloudflareRequestContextSymbol]: any;
      }
    )[cloudflareRequestContextSymbol] || null;

  return { context, headers, cloudflareRequestContext };
  //   const requestURL = await getRequestURL(event);

  //   // TODO: improve the security check for invalid requests
  //   if (
  //     !requestURL.origin.includes("localhost") &&
  //     !requestURL.origin.includes("pages.dev")
  //   ) {
  //     throw createError({
  //       statusMessage: "Unauthorized Request!",
  //       statusCode: 403,
  //     });
  //   }

  // TODO: use event context to restrict the source caller
  //   const { prompt } = await readBody(event);

  const ai = new Ai(event.context["env"].AI);

  const input = { prompt: "What is the origin of the phrase Hello, World" };

  const answer = await ai.run("@cf/meta/llama-2-7b-chat-int8", input);

  return answer;
});

export const ACCOUNT_ID = process.env["CF_ACCOUNT_ID"];
export const AI_TOKEN = process.env["WORKER_AI_TOKEN"];
export const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

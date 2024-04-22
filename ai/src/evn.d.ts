/// <reference types="@cloudflare/workers-types/2023-07-01" />

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      env: Env;
      context: ExecutionContext;
    };
  }
}

export {};

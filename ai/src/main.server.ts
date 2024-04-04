import "zone.js/node";
import "@angular/platform-server/init";

import { enableProdMode } from "@angular/core";
import { renderApplication } from "@angular/platform-server";
import { bootstrapApplication } from "@angular/platform-browser";
import { APP_BASE_HREF } from "@angular/common";

import { AppComponent } from "./app/app.component";
import { config } from "./app/app.config.server";

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default async function render(url: string, document: string) {
  // set the base href
  const baseHref = process.env["CF_PAGES_URL"] ?? `http://localhost:4200`;

  const html = await renderApplication(bootstrap, {
    document,
    url: `${baseHref}${url}`,
    platformProviders: [{ provide: APP_BASE_HREF, useValue: baseHref }],
  });

  return html;
}

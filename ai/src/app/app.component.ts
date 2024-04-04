import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "ai-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="max-w-96 m-auto py-8">
      <router-outlet></router-outlet>
    </main>

    <footer class="max-w-96 m-auto py-8">
      <a
        class="underline"
        href="https://github.com/dalenguyen/cloudflare-challange"
        target="_blank"
        >Created by Dale Nguyen</a
      >
    </footer>
  `,
})
export class AppComponent {}

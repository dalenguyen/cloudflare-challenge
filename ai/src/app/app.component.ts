import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PrimeNGConfig } from "primeng/api";

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
        href="https://github.com/dalenguyen/cloudflare-challenge"
        target="_blank"
        >Created by Dale Nguyen</a
      >
    </footer>
  `,
})
export class AppComponent implements OnInit {
  private primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}

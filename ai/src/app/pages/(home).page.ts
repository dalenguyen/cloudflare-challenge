import { Component, inject, signal } from "@angular/core";
import { AiService } from "../services/ai.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "ai-home",
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, SkeletonModule],
  template: `
    <h1 class="text-2xl">Text 2 Image Generation</h1>

    <div class="mt-4">
      <input
        class="w-full"
        pInput
        type="text"
        id="text"
        pInputText
        placeholder="cyperpunk cat"
        required
        #input
      />
    </div>

    <p-button
      [loading]="loading()"
      size="small"
      label="Generate Image"
      styleClass="my-4"
      (click)="onSubmit(input.value); input.value = ''"
      pRipple
    />

    @if (response?.result) {
    <div>
      <img
        src="data:image/png;base64, {{ response?.result }}"
        alt="Generated image"
      />
    </div>
    }

    <!-- Loading state -->
    @if(loading()) {
    <p-skeleton size="24rem" />
    }

    <!-- Error message -->
    @if(errorMessage()) {
    <p class="p-error mt-4">{{ errorMessage() }}</p>
    }
  `,
})
export default class HomeComponent {
  private aiService = inject(AiService);

  loading = signal(false);

  response: { result: string } | undefined;
  errorMessage = signal("");

  async onSubmit(prompt: string) {
    if (prompt.length < 10) {
      this.errorMessage.set("Prompt length must greater than 10 characters!");
      return;
    }

    this.errorMessage.set("");
    this.loading.set(true);

    try {
      this.response = await firstValueFrom(this.aiService.sendRequest(prompt));
      this.loading.set(false);
    } catch (error: any) {
      this.errorMessage.set(error?.message);
    }
  }
}

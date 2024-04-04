import { Component, inject } from "@angular/core";
import { AiService } from "../services/ai.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
@Component({
  selector: "ai-home",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Text 2 Image Generation</h1>

    <input
      pInput
      type="text"
      id="text"
      class="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="cyperpunk cat"
      required
      #input
    />
    <button
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      (click)="onSubmit(input.value)"
    >
      Click me
    </button>

    @if (response?.result) {
    <div>
      <img
        src="data:image/png;base64, {{ response?.result }}"
        alt="Generated image"
      />
    </div>
    } @if(errorMessage) {
    <p class="text-red-500">{{ errorMessage }}</p>
    }
  `,
})
export default class HomeComponent {
  private aiService = inject(AiService);

  response: { result: string } | undefined;
  errorMessage = "";

  async onSubmit(prompt: string) {
    if (prompt.length < 10) {
      this.errorMessage = "Prompt length must greater than 10 characters!";
      return;
    }

    this.errorMessage = "";

    try {
      this.response = await firstValueFrom(this.aiService.sendRequest(prompt));
    } catch (error: any) {
      this.errorMessage = error?.message;
    }
  }
}

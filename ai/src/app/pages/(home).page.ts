import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AiService } from "../services/ai.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { AudioRecorderComponent } from "../components/audio.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "ai-home",
  standalone: true,
  template: `
    <h1>Audio 2 Text 2 Image Generation</h1>
    <em>with description</em>

    <app-audio-recorder (audioReady)="getTextFromAudio($event)" />

    <input
      type="text"
      [(ngModel)]="prompt"
      id="text"
      class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="cyperpunk cat"
      required
    />

    <pre>{{ prompt() }}</pre>

    <button
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      (click)="onSubmit()"
    >
      {{ loading() ? "Generating Image..." : "Generate" }}
    </button>

    @if (image()) {
      <div>
        <img src="data:image/png;base64, {{ image() }}" alt="Generated image" />
      </div>
    }

    @if (imageDescription()) {
      <p class="mt-4">{{ imageDescription() }}</p>
    }

    @if (errorMessage()) {
      <p class="text-red-500">{{ errorMessage() }}</p>
    }
  `,
  imports: [CommonModule, AudioRecorderComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private aiService = inject(AiService);

  prompt = signal("");

  image = signal("");
  imageDescription = signal("");
  errorMessage = signal("");
  loading = signal(false);

  constructor() {
    effect(() => {
      if (this.prompt()) {
        console.log(`Current prompt: `, this.prompt());
      }
    });
  }

  async onSubmit() {
    this.loading.set(true);

    if (this.prompt().length < 10) {
      this.errorMessage.set("Prompt length must greater than 10 characters!");
      return;
    }

    this.errorMessage.set("");

    try {
      const { result, description } = await firstValueFrom(
        this.aiService.getImageFromText(this.prompt()),
      );

      result && this.image.set(result);
      description && this.imageDescription.set(description);
    } catch (error: any) {
      this.errorMessage = error?.message;
    }

    this.loading.set(false);
  }

  async getTextFromAudio(data: string) {
    try {
      data = data.substring("data:audio/wav;base64,".length);
      const response = await firstValueFrom(
        this.aiService.getTextFromAudio(data),
      );

      this.prompt.set(response.text);
    } catch (error: any) {
      this.errorMessage = error?.message;
    }
  }
}

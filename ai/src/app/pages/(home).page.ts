import {
  ChangeDetectorRef,
  Component,
  inject,
  model,
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
    <h1>Text 2 Image Generation</h1>

    <app-audio-recorder (audioReady)="getTextFromAudio($event)" />

    <input
      pInput
      type="text"
      id="text"
      [(ngModel)]="prompt"
      class="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="cyperpunk cat"
      required
    />
    <button
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      (click)="onSubmit()"
    >
      Generate Image
    </button>

    @if (response?.result) {
      <div>
        <img
          src="data:image/png;base64, {{ response?.result }}"
          alt="Generated image"
        />
      </div>
    }
    @if (errorMessage) {
      <p class="text-red-500">{{ errorMessage }}</p>
    }
  `,
  imports: [CommonModule, AudioRecorderComponent, FormsModule],
})
export default class HomeComponent {
  private aiService = inject(AiService);
  private cd = inject(ChangeDetectorRef);

  prompt = "";

  response: { result: string } | undefined;
  errorMessage = "";

  async onSubmit() {
    console.log(`prompt`, this.prompt);

    if (this.prompt.length < 10) {
      this.errorMessage = "Prompt length must greater than 10 characters!";
      return;
    }

    this.errorMessage = "";

    try {
      this.response = await firstValueFrom(
        this.aiService.getImageFromText(this.prompt),
      );
    } catch (error: any) {
      this.errorMessage = error?.message;
    }
  }

  async getTextFromAudio(data: string) {
    try {
      data = data.substring("data:audio/wav;base64,".length);
      const response = await firstValueFrom(
        this.aiService.getTextFromAudio(data),
      );

      console.log(response);

      this.prompt = response.text;
      this.cd.detectChanges();
    } catch (error: any) {
      this.errorMessage = error?.message;
    }
  }
}

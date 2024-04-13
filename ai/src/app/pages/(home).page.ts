import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { AiService } from "../services/ai.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { AudioRecorderComponent } from "../components/audio.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
@Component({
  selector: "ai-home",
  standalone: true,
  template: `
    <h1>Audio 2 Text 2 Image Generation</h1>
    <em>with description</em>

    <app-audio-recorder (audioReady)="getTextFromAudio($event)" />

    <input
      pInputText
      #input
      type="text"
      id="text"
      class="p-inputtext-sm flex w-full mb-4"
      placeholder="cyperpunk cat"
      required
    />

    <button pButton (click)="onSubmit()" size="small">
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
  imports: [
    CommonModule,
    AudioRecorderComponent,
    FormsModule,
    ButtonModule,
    InputTextModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private aiService = inject(AiService);

  input = viewChild.required<ElementRef<HTMLInputElement>>("input");

  image = signal("");
  imageDescription = signal("");
  errorMessage = signal("");
  loading = signal(false);

  async onSubmit() {
    if (this.input().nativeElement.value.length < 10) {
      this.errorMessage.set("Prompt length must greater than 10 characters!");
      return;
    }

    this.loading.set(true);
    this.errorMessage.set("");

    try {
      const { result, description } = await firstValueFrom(
        this.aiService.getImageFromText(this.input().nativeElement.value),
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

      this.input().nativeElement.value = response.text;
    } catch (error: any) {
      this.errorMessage = error?.message;
    }
  }
}

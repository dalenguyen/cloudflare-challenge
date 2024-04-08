import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  output,
  signal,
} from "@angular/core";

@Component({
  selector: "app-audio-recorder",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="flex items-center py-2 rounded border-none"
      (click)="toggleRecording()"
    >
      @if(isRecording() === false) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path
          fill="blue"
          d="M7.5 11A2.5 2.5 0 0 0 10 8.5v-6a2.5 2.5 0 1 0-5 0v6A2.5 2.5 0 0 0 7.5 11M11 7v1.5a3.5 3.5 0 1 1-7 0V7H3v1.5a4.5 4.5 0 0 0 4 4.472V15H5v1h5v-1H8v-2.028A4.5 4.5 0 0 0 12 8.5V7z"
        />
      </svg>
      } @else {

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path fill="red" d="M6 18V6h12v12z" />
      </svg>
      }
    </button>
  `,
})
export class AudioRecorderComponent {
  cd = inject(ChangeDetectorRef);

  isRecording = signal(false);
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[] = [];

  audioReady = output<string | ArrayBuffer | null>();

  async toggleRecording() {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
    this.isRecording.set(!this.isRecording());
    this.cd.detectChanges();
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.chunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: "audio/wav" });
        this.convertToBase64(blob);
        this.chunks = [];
        this.mediaRecorder = null;
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
  }

  convertToBase64(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      this.audioReady.emit(base64Data);
    };
    reader.readAsDataURL(blob);
  }
}

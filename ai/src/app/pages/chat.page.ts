import { Component, WritableSignal, inject, signal } from "@angular/core";
import { AiService } from "../services/ai.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { lastValueFrom } from "rxjs";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Chat with Llama 3</h1>
    <div class="mt-4">
      <input
        placeholder="enter your message"
        [(ngModel)]="message"
        class="border p-2"
        (keyup.Enter)="sendChat()"
      />

      <button (click)="sendChat()" class="p-2 ml-1 bg-cyan-200 rounded-sm">
        Send
      </button>
    </div>

    <div class="mt-4">
      @for (chat of chats(); track chat.content) {
        <div class="py-2">
          {{ chat.role | titlecase }}:
          <span [innerHTML]="chat.content"> </span>
        </div>
      }
    </div>
  `,
})
export default class ChatPage {
  #aiService = inject(AiService);

  chats: WritableSignal<{ role: string; content: string }[]> = signal([]);

  message = signal("");

  async sendChat() {
    this.chats.update((value) => [
      ...value,
      {
        role: "user",
        content: this.message(),
      },
    ]);

    const result = await lastValueFrom(this.#aiService.sendChat(this.chats()));

    if (result.result?.response) {
      this.chats.update((value) => [
        ...value,
        {
          role: "assistant",
          content: result.result.response,
        },
      ]);

      this.message.set("");
    }
  }
}

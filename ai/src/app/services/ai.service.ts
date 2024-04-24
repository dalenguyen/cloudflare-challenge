import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AiService {
  private http = inject(HttpClient);

  getImageFromText(prompt: string) {
    return this.http.post<{ result: string; description: string }>(
      "/api/v1/ai",
      {
        prompt,
      },
    );
  }

  getTextFromAudio(data: string) {
    return this.http.post<{ text: string }>("/api/v1/ai-whisper", {
      data,
    });
  }

  sendChat(chats: any) {
    return this.http.post<{ result: { response: string } }>("/api/v1/ai-chat", {
      chats,
    });
  }
}

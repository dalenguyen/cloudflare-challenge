import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AiService {
  private http = inject(HttpClient);

  sendRequest(prompt: string) {
    return this.http.post<{ result: string }>("/api/v1/ai", {
      prompt,
    });
  }
}

import {
  Component,
  inject,
  signal
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { enviroment } from '../../../environment/evironment.prod';

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  private http = inject(HttpClient);

  readonly apiUrl = enviroment.apiUrl;

  messages = signal<ChatMessage[]>([]);
  userInput = '';
  isLoading = signal(false);

  sendMessage() {
    const query = this.userInput.trim();
    if (!query) return;
    this.messages.update(messages => [
      ...messages,
      {
        type: 'user',
        text: query
      }
    ]);
    this.userInput = '';
    this.isLoading.set(true);
      const params = new HttpParams()
    .set('query', query);

    this.http.post<any>(
      `${this.apiUrl}/chat`,
      {},
      {params}
    ).subscribe({
      next: (response) => {

        /**
         * adjust according to API response
         */

        const aiMessage =
          response?.answer ||
          response?.message ||
          'No response received';

        this.messages.update(messages => [
          ...messages,
          {
            type: 'bot',
            text: aiMessage
          }
        ]);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(messages => [
          ...messages,
          {
            type: 'bot',
            text: 'Something went wrong.'
          }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages.set([]);
  }
}
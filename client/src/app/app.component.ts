import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  text: string = 'Join';
  title = 'client';
  log: ChatMessage[] = [];

  constructor(private chat: ChatService) {}

  event$: Subscription;

  toggleConnection(name) {
    if (this.text == 'Join') {
      this.text = 'Leave';
      this.chat.join(name);
      this.event$ = this.chat.event.subscribe((message) => {
        this.log.unshift(message);
      });
    } else {
      this.text = 'Join';
      this.chat.leave();
    }
  }

  send(payload) {
    this.chat.send(payload);
  }

  ngOnDestroy() {
    // check if subbed before unsubbed
    if (this.event$ != null) this.event$.unsubscribe();
  }
}

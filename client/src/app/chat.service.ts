import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ChatMessage {
  from: string;
  message: string;
  ts: string;
}

@Injectable()
export class ChatService {
  private ws: WebSocket;

  // listener for messages
  event = new Subject<ChatMessage>();

  join(name: string) {
    const params = new HttpParams().set('name', name);
    this.ws = new WebSocket(`ws://192.168.1.32:3000/chat?${params.toString()}`);

    // handle incoming message
    this.ws.onmessage = (payload: MessageEvent) => {
      // parse incoming message as ChatMessage object
      const chat = JSON.parse(payload.data) as ChatMessage;
      // fire message to angular
      this.event.next(chat);
    };

    // handle disconnection
    this.ws.onclose = (() => {
      this.ws.close();
      this.ws = null;
    }).bind(this);
  }

  leave() {
    if (this.ws != null) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(payload) {
    this.ws.send(payload);
  }
}

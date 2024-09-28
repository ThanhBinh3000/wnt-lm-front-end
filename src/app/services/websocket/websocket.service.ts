import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
    private stompClient: any;
    private notificationSubject = new BehaviorSubject<string>('');
  
    connect() {
        //http://10.0.2.142:8888/wnt-lm-notification-consumer/ws
      const socket = new SockJS('http://10.0.1.142:30865/ws');
      this.stompClient = Stomp.over(socket);
  
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe('/topic/notifications', (message: any) => {
          this.notificationSubject.next(message.body);
        });
      });
    }
  
    getNotificationObservable() {
      return this.notificationSubject.asObservable();
    }
}
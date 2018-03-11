import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

export class Message  {
  constructor(
    public sender: string,
    public content: string
  ) { }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {

  @ViewChild('viewer') private viewer: ElementRef;

  public serverMessages = new Array<Message>();

  public clientMessage = ' ';
  public sender = '';

  private socket$: WebSocketSubject<Message>;

  constructor() {
    this.socket$ = WebSocketSubject.create('ws://localhost:8999');

    this.socket$
    .subscribe(
      (message) => this.serverMessages.push(message),
      (err) => console.error(err),
      () => console.warn('Onnistui')
    );
  }

  public send(): void{
    const message = new Message(this.sender, this.clientMessage);
    this.serverMessages.push(message);
    this.socket$.next(<any>JSON.stringify(message));
    this.clientMessage = ' ';

  }

  public isMine(message: Message): boolean {
    return message && message.sender === this.sender;
}


}
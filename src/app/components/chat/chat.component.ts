import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ElementRef, ViewChild, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Imessage } from '../../models';
import { AuthService } from '../../services/auth.service';
import { UserNamePipe } from '../../user-name.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, UserNamePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @Input() messages: Imessage[] | null = null;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;

  @Input() userId: string | undefined;
  @Input() roomId: string | undefined;
  @Output() messageAdded: EventEmitter<Imessage> = new EventEmitter<Imessage>();

  newMessage: string = '';

  constructor(private cdRef: ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit(): void {}

  get sortedMessages(): Imessage[] {
    return this.messages ? [...this.messages].sort((a, b) => a.timestamp - b.timestamp) : [];
  }

  getTimeSince(timestamp: number): string {
    const now = new Date().getTime();
    const seconds = Math.floor((now - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return new Date(timestamp).toLocaleTimeString();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      this.scrollToBottom();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.chatContainer && this.messageList) {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
        this.cdRef.detectChanges();
      }, 100); // יש לאפשר זמן נוסף לטעינה לפני הגלילה
    }
  }

  sendMessage() {
    const message: any = {
      userId: this.userId!,
      body: this.newMessage,
      timestamp: new Date().getTime(),
      type: 'text'  // ציין שהודעה זו היא מסוג 'טקסט'
    };

    if (this.messages) {
      this.messages = [...this.messages, message]; // Update the messages array
    } else {
      this.messages = [message]; // Initialize the messages array if it's null
    }

    this.messageAdded.emit(message);
    this.newMessage = '';
    this.scrollToBottom(); // Ensure the scroll happens after adding the new message
  }

  sendMessageOnEnter(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action (form submission, etc.)
      this.sendMessage();
    }
  }
}

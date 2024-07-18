import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatService } from '../../services/chat.service';
import { IChatRoom, Imessage } from '../../models';
import { ChatComponent } from '../chat/chat.component';
import { RoomListComponent } from '../room-list/room-list.component';
import { CommonModule } from '@angular/common';
import { AddRoomComponent } from '../add-room/add-room.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RoomListComponent, ChatComponent, CommonModule],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public messages$: Observable<Imessage[]>;
  public rooms: IChatRoom[] = [];
  public userId: string | undefined;
  public currentRoomId: string | null = null; // Store current room ID

  constructor(
    private router: Router,
    private chatService: ChatService,
    private dialog: MatDialog,
    private auth: AuthService
    
  ) { }

  ngOnInit(): void {
    this.handleRouteChanges();
    this.auth.getCurrentUserAsObservable().pipe(
      filter(user => !!user)
    ).subscribe(user => {
      this.userId = user?.uid;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleRouteChanges(): void {
    this.subscription.add(
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => {
          const urlArr = event.urlAfterRedirects.split('/');
          const roomId = urlArr.length > 2 ? urlArr[2] : null;
          this.currentRoomId = roomId;
          return roomId;
        })
      ).subscribe(roomId => {
        if (roomId) {
          this.messages$ = this.chatService.getRoomMessages(roomId);
        }
      })
    );
  }

  openAddRoom(): void {
    const dialogRef = this.dialog.open(AddRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.userId) {
        this.chatService.addRoom(result, this.userId)
          .then(() => {
            // Refresh or update the rooms list if needed
          })
          .catch(error => {
            console.error('Error adding room:', error);
          });
      }
    });
  }

  // Handle new message from chat component
  handleNewMessage(message: Imessage) {
    if (this.currentRoomId && this.userId) {
      this.chatService.sendMessage(this.userId, this.currentRoomId, message).then(() => {
        console.log('Message sent successfully');
      }).catch(error => {
        console.error('Error sending message:', error);
      });
    }
  }
}

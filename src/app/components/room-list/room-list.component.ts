import { Component, Input, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { IChatRoom } from '../../models';
import { RouterLink } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatListModule,RouterLink,ChatComponent],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})  
export class RoomListComponent implements OnInit {
@Input() rooms :Array<IChatRoom>=[]

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
    console.log("rooms",this.rooms)
  }
}

// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { ChatComponent } from './components/chat/chat.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
export const routes: Routes = [
  {
  path: "chat",
  component:
  ChatContainerComponent,
  canActivate: [AuthGuardService]
  },
  {
  path: "chat/:roomId",
  component: ChatContainerComponent,
  canActivate: [AuthGuardService],},
  {  path: '',
  component: HomeComponent
  },{
  path:"**",
  redirectTo:''
}

  // { path: '**', component: PageNotFoundComponent }
];

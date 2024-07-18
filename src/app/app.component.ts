import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material.module'; // ודא שיצרת את המודול הזה
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
//  import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { RoomListComponent } from './components/room-list/room-list.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    //  BrowserAnimationsModule,
    MaterialModule,
        RoomListComponent,
     HeaderComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

 }

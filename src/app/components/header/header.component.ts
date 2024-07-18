import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MatToolbarModule, MatButtonModule,CommonModule ,MatIconModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isUserLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isUserLoggedIn$ = this.authService.isUserLoggedInAsObservable();
  }

  ngOnInit(): void {}

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signOut(): void {
    this.authService.signOut();
  }
  
}

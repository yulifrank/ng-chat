import { Pipe, PipeTransform } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from './services/auth.service';

@Pipe({
  name: 'userName',
  standalone: true // חשוב להוסיף אם אתה משתמש ב-standalone components
})
export class UserNamePipe implements PipeTransform {

  constructor(private authService: AuthService) {}

  transform(userId: string): Observable<string> {
    return from(this.authService.getUserDetails(userId).then(user => user?.displayName || 'Unknown User'));
  }
}

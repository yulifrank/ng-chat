import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { Firestore, getFirestore, doc, setDoc, DocumentReference, DocumentData, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;
  private firestore: Firestore;
  private isUserLoggedIn$: BehaviorSubject<boolean>;
  private currentUser$: BehaviorSubject<User | null>;

  constructor(private router: Router) {
    this.isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    this.currentUser$ = new BehaviorSubject<User | null>(null);

    if (this.isLocalStorageAvailable()) {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString) as User;
        this.isUserLoggedIn$.next(true);
        this.currentUser$.next(user);
      }
    }

    const firebaseApp = initializeApp(environment.firebase);
    this.auth = getAuth(firebaseApp);
    this.firestore = getFirestore(firebaseApp);

    this.checkAuthState();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  isUserLoggedInAsObservable(): Observable<boolean> {
    return this.isUserLoggedIn$.asObservable();
  }

  getCurrentUserAsObservable(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  private checkAuthState(): void {
    onAuthStateChanged(this.auth, async (user) => {
      const isLoggedIn = !!user;
      this.isUserLoggedIn$.next(isLoggedIn);

      if (isLoggedIn && user) {
        const userData = await this.getUserDetails(user.uid);
        if (userData) {
          this.currentUser$.next(userData);
          this.saveUserLocally(userData);
        }
      } else {
        this.currentUser$.next(null);
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        const userData = await this.setUserData(result.user);
        this.isUserLoggedIn$.next(true);
        if (userData) {
          this.saveUserLocally(userData);
          this.currentUser$.next(userData);
        }
        this.router.navigate(['chat']);
      }
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem('user');
      }
      this.currentUser$.next(null);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  saveUserLocally(user: User): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }



  private async setUserData(user: FirebaseAuthUser): Promise<User | null> {
    const userRef: DocumentReference<DocumentData> = doc(this.firestore, `users/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log('User data added successfully');
      return userData;
    } catch (error) {
      console.error('Error adding user data: ', error);
      return null;
    }
  }
  async getUserDetails(uid: string): Promise<User | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        return userData;
      } else {
        console.error('User data not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user details: ', error);
      return null;
    }
  }
}

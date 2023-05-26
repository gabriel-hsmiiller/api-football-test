import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const API_PUB_TOKEN = 'api_pub_token'
const API_USER_NAME = 'api_user_name'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor() { }

  checkIsAuthenticated() {
    const storedToken = localStorage.getItem(API_PUB_TOKEN);

    if (storedToken && storedToken.trim()) {
      this._isAuthenticated$.next(true);
    } else {
      this._isAuthenticated$.next(false);
    }
  }

  saveTokenOnStorage(token: string) {
    localStorage.setItem(API_PUB_TOKEN, token);
  }

  removeTokenFromStorage() {
    localStorage.removeItem(API_PUB_TOKEN);
  }

  get Token() {
    return localStorage.getItem(API_PUB_TOKEN);
  }
  
  saveNameOnStorage(token: string) {
    localStorage.setItem(API_USER_NAME, token);
  }

  removeNameFromStorage() {
    localStorage.removeItem(API_USER_NAME);
  }
  
  get Name() {
    return localStorage.getItem(API_USER_NAME);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public user_id: string = "user";

  constructor() {
    // Initialize user_id from local storage or default to "user"
    this.user_id = localStorage.getItem('user_id') || 'user';
  }

  setUserId(userId: string) {
    // Save user_id to local storage and update the value
    localStorage.setItem('user_id', userId);
    this.user_id = userId;
  }

}

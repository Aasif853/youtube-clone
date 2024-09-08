import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserInterface } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public tokenName = 'ng-token';

  public userSettingsSource = new BehaviorSubject<
    UserInterface | undefined | null
  >(undefined);
  // observable stream
  public userSettings$ = this.userSettingsSource.asObservable();
  constructor(private http: HttpClient) {
    this.updateUserSignal();
  }

  setUserSettings(data: UserInterface) {
    this.userSettingsSource.next(data);
  }

  logout() {
    this.accessToken = '';
    this.userSettingsSource.next(null);
  }

  updateUserSignal() {
    this.getCurrentUser().subscribe(
      (resp: any) => this.userSettingsSource.next(resp),
      (error) => this.userSettingsSource.next(null),
    );
  }

  getCurrentUser(): Observable<UserInterface> {
    return this.http.get('users/getCurrentUser').pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }

  signInUser(data: any): Observable<UserInterface> {
    return this.http.post('users/google_sign_in', data).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }

  getUserDetails(id: number): Observable<any> {
    return this.http.get('videos/' + id).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------


  get userData() {
    return this.userSettingsSource.value;
  }
  /**
   * Setter & getter for access token
   */
  set accessToken(token: string | undefined) {
    if (token) {
      localStorage.setItem(this.tokenName, token);
    } else {
      localStorage.removeItem(this.tokenName);
    }
  }

  get accessToken(): string {
    return localStorage.getItem(this.tokenName) ?? '';
  }
}

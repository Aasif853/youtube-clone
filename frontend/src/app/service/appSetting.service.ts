import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { User } from '../types/interfaces';
// import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocalStorageService } from './localstorage.service';
import { environment } from '../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  public tokenName = 'ng-token';
  private _userSource = new BehaviorSubject<any>(null);
  private _user = this._userSource.asObservable();
  localStorage = inject(LocalStorageService);
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this.getLocalStorageUser();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User | null) {
    // Store the value
    this._userSource.next(value);
    if (value) this.localStorage.setObject('userProfile', value);
    else this.removeLocalStoreUser();
  }

  get user$(): Observable<User | null> {
    return this._user;
  }

  get userData() {
    return this._userSource.value;
  }
  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    this.localStorage.setItem(this.tokenName, token);
  }

  get accessToken(): string {
    return this.localStorage.getItem(this.tokenName) ?? '';
  }

  removeLocalStoreUser() {
    this.localStorage.removeItem('userProfile');
  }

  getLocalStorageUser(): void {
    const user = this.localStorage.getObject('userProfile') as User;
    this.user = user && user.refreshToken ? user : null;
  }

  public prepareImgUrl(url: string) {
    return url ? url.replace(environment.mediaUrl, '') : '';
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  public queryStringFormat(queryParams: any) {
    let reqParams: any = {
      offset:
        queryParams.pageNumber > 0
          ? queryParams.pageNumber * queryParams.pageSize
          : 0,
      limit: queryParams.pageSize || '',
      sortField: 'createdAt',
      sortOrder: 'DESC',
    };

    if (queryParams.filter && Object.keys(queryParams.filter).length > 0)
      reqParams.filter = JSON.stringify(queryParams.filter);

    if (queryParams.queryString)
      reqParams.searchString = queryParams.queryString;

    if (queryParams.searchField)
      reqParams.searchField = queryParams.searchField;

    if (queryParams.sortModel) reqParams.sortModel = queryParams.sortModel;

    if (queryParams.sortField && queryParams.sortOrder) {
      reqParams.sortOrder = queryParams.sortOrder;
      reqParams.sortField = queryParams.sortField;
    }

    let queryString = Object.keys(reqParams)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(reqParams[k]);
      })
      .join('&');

    return queryString;
  }
}

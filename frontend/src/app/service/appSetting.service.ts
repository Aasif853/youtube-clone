import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { User } from "../types/interfaces";

@Injectable({
  providedIn: "root",
})
export class AppSettingService {
  public tokenName = "ng-token";

  private _user: ReplaySubject<User | null> = new ReplaySubject(1);
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
    if (value) {
      this._user.next(value);
      localStorage.setItem("userProfile", JSON.stringify(value));
    } else this.removeLocalStoreUser();
  }

  get user$(): Observable<User | null> {
    return this._user.asObservable();
  }

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  get accessToken(): string {
    return localStorage.getItem(this.tokenName) ?? "";
  }

  removeLocalStoreUser() {
    localStorage.removeItem("userProfile");
  }
  /*
   *  getLocalStorageUser function is used to get local user profile data.
   */
  getLocalStorageUser(): void {
    const user = localStorage.getItem("userProfile");
    console.log("LoggedIn user from localstore", user);
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  public queryStringFormat(queryParams: any) {
    let reqParams: any = {
      offset:
        queryParams.pageNumber > 0
          ? queryParams.pageNumber * queryParams.pageSize
          : 0,
      limit: queryParams.pageSize || "",
      sortField: "createdAt",
      sortOrder: "DESC",
    };

    if (queryParams.filter && Object.keys(queryParams.filter).length > 0)
      reqParams.filter = queryParams.filter;

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
        return encodeURIComponent(k) + "=" + encodeURIComponent(reqParams[k]);
      })
      .join("&");

    return queryString;
  }
}

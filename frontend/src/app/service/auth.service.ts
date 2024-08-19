import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User } from "../types/interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signInUser(data: User): Observable<any> {
    return this.http.post("users/signUp", data).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }

  getUserDetails(id: number): Observable<any> {
    return this.http.get("videos/" + id).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }
}

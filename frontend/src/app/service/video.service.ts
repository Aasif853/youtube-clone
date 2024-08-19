import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppSettingService } from "./appSetting.service";

@Injectable({
  providedIn: "root",
})
export class VideoService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingService,
  ) {}

  getVideosListing(params: any): Observable<any> {
    let queryParams = this.appSettingsService.queryStringFormat(params);
    return this.http.get(`videos?${queryParams}`).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }

  getSingleVideo(id: number): Observable<any> {
    return this.http.get("videos/" + id).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }
}

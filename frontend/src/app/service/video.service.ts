import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppSettingService } from "./appSetting.service";
import moment from 'moment';

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
        let retData: any = {
          items: [],
          totalCount: 0,
          error: '',
        };
        if (
          resp &&
          resp.data &&
          Array.isArray(resp.data.rows)
        ) {
          let rows = resp.data.rows;
          for (const item of rows) {
            var seconds = item.duration ?? 0;
            item.duration = moment().startOf('day').seconds(seconds).format('mm:ss');
            item.postedTime = moment(item.createdAt).fromNow()
            retData.items.push(item);
          }
          retData.totalCount = resp.data.count;
        } else {
          retData.error = resp?.error?.message ? resp.error.message : '';
        }

        return retData;
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

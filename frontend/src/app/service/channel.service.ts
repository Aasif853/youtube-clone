import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppSettingService } from './appSetting.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingService,
  ) {}

  getChennesList(params: any): Observable<any> {
    let queryParams = this.appSettingsService.queryStringFormat(params);
    return this.http.get(`chennels?${queryParams}`).pipe(
      map((resp: any) => {
        return resp.data;
      }),
    );
  }

  getSingleVideo(id: string): Observable<any> {
    return this.http.get('channels/' + id).pipe(
      map((resp: any) => {
        resp.data['subscriptions'] = resp.data._count['subscriptions'];
        return resp.data;
      }),
    );
  } 

  updateChangeDetails(id: string, params: FormData) {
    return this.http.put('channels/' + id, params).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }

  updateChangeImages(id: string, params: FormData) {
    return this.http.put('channels/image/' + id, params).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }
}

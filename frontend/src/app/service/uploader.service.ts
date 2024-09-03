import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppSettingService } from './appSetting.service';

@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingService,
  ) {}

  initializeUpload(params: any) {
    return this.http.post('upload/initialize', params).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }

  chunkUpload(params: FormData) {
    return this.http.post('upload/chunk', params).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }

  completeUpload(params: FormData) {
    return this.http.post('upload/complete', params).pipe(
      map((resp: any) => {
        return resp;
      }),
    );
  }
}

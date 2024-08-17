import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient) {}

  getVideosListing(): Observable<any> {
    return this.http.get('videos').pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  getSingleVideo(id: number): Observable<any> {
    return this.http.get('videos/' + id).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  private _snackBar = inject(MatSnackBar);

  constructor() {}

  public prepareImgUrl(url: string) {
    return url ? url.replace(environment.mediaUrl, '') : '';
  }

  showSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 10000,
    });
  }
  public queryStringFormat(queryParams: any) {
    let reqParams: any = {
      offset:
        queryParams.pageNumber > 1
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

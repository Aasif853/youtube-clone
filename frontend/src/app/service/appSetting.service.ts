import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  constructor() {}

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
        return encodeURIComponent(k) + '=' + encodeURIComponent(reqParams[k]);
      })
      .join('&');

    return queryString;
  }
}

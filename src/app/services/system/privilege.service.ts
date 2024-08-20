import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-system', 'privilege');
  }

  searchListTheoMaThanhVien(body: any) {
    const url = `/api/wnt-lm-system/privilege/search-list-theo-ma-thanh-vien`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class LuanChuyenService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-dutruhang','luan-chuyen');
  }
  searchPageHangCanHan(body: any) {
    const url = `/api/wnt-lm-dutruhang/luan-chuyen/search-page-hang-can-han`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  searchPageHangItGiaoDich(body: any) {
    const url = `/api/wnt-lm-dutruhang/luan-chuyen/search-page-hang-it-giao-dich`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class ThongTinKhuVucService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-categories','thong-tin-khu-vuc');
  }

  searchListTinhThanh(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-tinh-thanh`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListQuanHuyen(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-quan-huyen`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListPhuongXa(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-phuong-xa`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

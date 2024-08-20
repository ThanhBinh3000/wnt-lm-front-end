import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class ThuocService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-categories','tra-cuu');
  }

  searchPageDanhSachThuoc(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListDanhSachThuoc(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-nhom-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

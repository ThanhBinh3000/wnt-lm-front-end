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

  searchListDanhSachThuoc(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListNhomNganhHang(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-nhom-nganh-hang`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListNhomDuocLy(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-nhom-duoc-ly`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListNhomHoatChat(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list-nhom-hoat-chat`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

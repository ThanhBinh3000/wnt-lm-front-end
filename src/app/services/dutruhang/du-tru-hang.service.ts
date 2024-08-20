import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class DuTruHangService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-dutruhang','du-tru');
  }
  createPhieuDuTru(body: any) {
    const url = `/api/wnt-lm-dutruhang/du-tru/them-moi-phieu-du-tru`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  searchListHangDuTru(body: any) {
    const url = `/api/wnt-lm-dutruhang/du-tru/search-list-hang-du-tru`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  searchListTopHangBanChay(body: any) {
    const url = `/api/wnt-lm-dutruhang/du-tru/search-list-top-hang-ban-chay`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  override getDetail(id: number) {
    const url = `/api/wnt-lm-dutruhang/du-tru/detail/${id}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }
}

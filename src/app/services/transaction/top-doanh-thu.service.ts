import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class topDoanhThuService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'transaction','thong-ke');
  }

  searchlistTopDoanhThu(body: any) {
    const url = `/api/wnt-lm-transaction/thong-ke/top-doanh-thu`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

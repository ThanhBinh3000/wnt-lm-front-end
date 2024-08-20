import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class topSoLuongService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-transaction','thong-ke');
  }

  searchTopSoLuong(body: any) {
    const url = `/api/wnt-lm-transaction/thong-ke/top-so-luong`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class topTyXuatLoiNhuanService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'transaction','thong-ke');
  }

  searchTopListTyXuatLoiNhuan(body: any) {
    const url = `/api/wnt-lm-transaction/thong-ke/top-tsln`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

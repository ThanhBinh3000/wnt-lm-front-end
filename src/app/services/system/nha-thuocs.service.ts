import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class NhaThuocsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-system', 'thanh-vien');
  }

  deleteByMaNhaThuoc(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/delete-by-ma-nha-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  detailByMaNhaThuoc(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/detail-by-ma-nha-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  
  dsByMaNhaThuocCha(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/ds-by-ma-nha-thuoc-cha`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

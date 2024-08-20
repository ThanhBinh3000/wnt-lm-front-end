import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class HangHoaService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-products','tra-cuu');
  }

  searchPageHangHoa(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-hang-hoa`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

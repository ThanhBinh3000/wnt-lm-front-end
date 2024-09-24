import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-categories','thong-bao');
  }

  updateStatus(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/update-trang-thai`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

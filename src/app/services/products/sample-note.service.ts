import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class SampleNoteService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-products','sample-note');
  }
  
  getTranSampleNotes(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-tran-sample-notes`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}

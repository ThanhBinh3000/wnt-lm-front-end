import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class HangHoaLuanChuyenService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-dutruhang','hang-hoa-luan-chuyen');
  }
}

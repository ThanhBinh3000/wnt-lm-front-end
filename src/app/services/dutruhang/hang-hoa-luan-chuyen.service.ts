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

  cancelHH(body: any) {
    const url = `/api/wnt-lm-dutruhang/hang-hoa-luan-chuyen/delete`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getCurrentWeek(): number {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysSinceFirstDay = (currentDate.getDate() - 1);
    const weekOfMonth = Math.ceil((daysSinceFirstDay + firstDayOfMonth.getDay() + 1) / 7);
    return weekOfMonth;
  }

  uploadImage(file: File, body?: any){
    const url: string = `/api/${this.gateway}/${this.controller}/upload-image`;
    const formData = new FormData();
    const folder = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + this.getCurrentWeek();
    formData.append('file', file);
    formData.append('title', body?.dataId+'-'+body.dataType);
    formData.append('folder', 'wnt/' + folder);
    formData.append('dataId', body?.dataId);
    formData.append('dataType', body?.dataType);
    formData.append('idPhieuChiTiet', body?.idPhieuChiTiet);

    return this.httpClient.post<any>(url, formData).toPromise();
  }
}

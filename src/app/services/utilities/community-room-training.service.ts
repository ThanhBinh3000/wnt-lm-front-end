import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class CommunityRoomTrainingService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-utilities', 'community-room-training');
  }

  updateStatus(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/update-status`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
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
    return this.httpClient.post<any>(url, formData).toPromise();
  }

  getCurrentWeek(): number {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysSinceFirstDay = (currentDate.getDate() - 1);
    const weekOfMonth = Math.ceil((daysSinceFirstDay + firstDayOfMonth.getDay() + 1) / 7);
    return weekOfMonth;
  }
}

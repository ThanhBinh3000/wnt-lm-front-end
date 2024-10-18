import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class ChiTietHangLuanChuyenService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-dutruhang','/ct-hang-hoa-luan-chuyen');
  }

  searchPageHangQuanTam(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/search-page-hang-quan-tam`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageHangDangGiaoDich(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/search-page-hang-giao-dich`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageHangDen(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/search-page-hang-den`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageHangDi(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/search-page-hang-di`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getGuiThongBao(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/gui-thong-bao`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getDongYBenBan(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/update-dong-y-cung-cap-thong-tin`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getDongYBenMua(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/update-dong-y-luan-chuyen`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getTuChoiBenMua(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/update-tu-choi-ben-mua`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getTuChoiBenBan(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/update-tu-choi-ben-ban`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getHoanThanhGiaoDich(body: any) {
    const url = `/api/wnt-lm-dutruhang/ct-hang-hoa-luan-chuyen/ket-thuc-giao-dich`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}

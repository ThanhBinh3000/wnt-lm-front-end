import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from './storage.service';
import {STORAGE_KEY} from '../constants/config';
import {ResponseData} from "../models/response-data";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(private router: Router, private storageService: StorageService, httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-security', '');
  }

  saveToken(token: string) {
    return this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, token);
  }

  getToken(): string {
    // @ts-ignore
    return JSON.parse(this.storageService.getString(STORAGE_KEY.ACCESS_TOKEN));
  }

  saveUser(user: any) {
    return this.storageService.set(STORAGE_KEY.USER_INFO, user);
  }

  getUser() {
    return this.storageService.get(STORAGE_KEY.USER_INFO);
  }

  getNhaThuoc() {
    // return this.storageService.get(STORAGE_KEY.NHA_THUOC);
    return this.storageService.get(STORAGE_KEY.USER_INFO)?.nhaThuoc;
  }

  getMaNhaThuoc() {
    return this.getNhaThuoc()?.maNhaThuoc;
  }

  getUserId() {
    return this.getUser()?.id;
  }

  saveNhaThuoc(data: any) {
    return this.storageService.set(STORAGE_KEY.NHA_THUOC, data);
  }

  saveRole(role: number) {
    return this.storageService.set(STORAGE_KEY.ROLE, role);
  }

  getRole(): number {
    return this.storageService.get(STORAGE_KEY.ROLE);
  }

  login(body: any) {
    const url = `/api/${this.gateway}/login`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  wntAuthenticate(key: string) {
    const url = `/api/${this.gateway}/wnt-authenticate?key=${key}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  profile() {
    const url = `/api/${this.gateway}/profile`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  chooseNhaThuoc(body: any) {
    const url = `/api/wnt-security/choose-nha-thuoc`;
    return this.httpClient.put<ResponseData>(url, body).toPromise();
  }

  isLogin() {
    return (!(this.getUser() == null || this.getUser() == undefined));
  }

  isSuperUser() {
    return true;
    // return this.getUser()?.roles?.some((item: any) => item.roleName === "Super User");
  }

  isAdmin() {
    return true;
    // return this.getUser()?.roles?.some((item: any) => item.roleName === "Admin");
  }

  isUser() {
    return this.getUser()?.roles?.some((item: any) => item.roleName === "User");
  }

  getSettingByKey(key: string) {
    return {
      activated: this.getUser()?.applicationSettings.find((item: any) => item.settingKey === key)?.activated,
      value: this.getUser()?.applicationSettings.find((item: any) => item.settingKey === key)?.settingValue
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']).then(r => {
    });
  }
}

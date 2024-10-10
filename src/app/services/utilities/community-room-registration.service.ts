import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class CommunityRoomRegistrationService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-lm-utilities','community-room-registration');
  }
}

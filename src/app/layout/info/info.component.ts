import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/categories/notifications.service';
import { STATUS_API } from '../../constants/message';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent  implements OnInit {

  public display: any = {};
  public lstNotification : any = [];
  @Input() isLogin: boolean = false;
  constructor(
    public authService: AuthService,
    private service : NotificationsService
  ) {
  }

  ngOnInit() {
    if(this.isLogin && this.authService.getUser()?.maCoSo){
        this.searchPage();
    }
  }

   async searchPage() {
    let body : any = {}
    body.paggingReq = {
      limit: 10,
      page: 1
    }
    let res = await this.service.searchPage(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.lstNotification = res.data;
    } else {
    }
  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
  }

  isDisplay(key: string) {
    if (!this.display[key]) {
      return 'none';
    }
    return this.display[key];
  }
  getFullName(){
    return this.authService.getUser()?.fullName;
  }

  async openChangePasswordDialog() {
    // this.dialog.open(ChangePasswordDialogComponent, {
    //   width: '600px',
    // });
  }
}

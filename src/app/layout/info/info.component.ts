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
  public countNotification : any = 0;
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
      limit: 5,
      page: 1
    }
    let res = await this.service.searchPage(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.lstNotification = res.data;
      this.countNotification = this.lstNotification.filter((x : any)=>x.status == 0).length;
      console.log(this.countNotification);
    } else {
    }
  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
    this.updateStatus();
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

  updateStatus(){
    if(this.countNotification > 0){
      this.service.updateStatus(this.lstNotification).then((res) => {
        if (res?.status === STATUS_API.SUCCESS) {
          this.countNotification = 0;
        }
      })
    }
  }

  async openChangePasswordDialog() {
    // this.dialog.open(ChangePasswordDialogComponent, {
    //   width: '600px',
    // });
  }
}

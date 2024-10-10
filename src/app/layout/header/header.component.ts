import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {SETTING} from "../../constants/setting";
import {LOAI_THU_CHI} from "../../constants/config";
import {ComponentsModule} from "../../component/base/components.module";
import {MemberDetailDialogComponent} from "../../pages/member/member-detail-dialog/member-detail-dialog.component";
import { InfoComponent } from '../info/info.component';
import { MemberChooseDialogComponent } from '../../pages/member/member-choose-dialog/member-choose-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public store: any;
  public storeName: string = '';
  public display: any = {};

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.store = authService.getNhaThuoc();
    if (this.store) {
      this.storeName = this.store.name;
    }
  }

  ngOnInit(): void {
  }

  onRegionChanged() {

  }

  onCityChanged() {

  }

  onWardChanged() {

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

  getMaNhaThuoc(){
    return this.authService.getNhaThuoc()?.maNhaThuoc;
  }

  getTenNhaThuoc(){
    return this.authService.getNhaThuoc()?.tenNhaThuoc;
  }

  getMuNhaThuoc(){
    let muNhaThuoc = '';
    const nhaThuoc = this.authService.getNhaThuoc();
    const enableConnectivityStoreToManageStore = this.authService.getSettingByKey(SETTING.ENABLE_CONNECTIVITY_STORE_TO_MANAGE_STORE);
    const useClinicIntegration = this.authService.getSettingByKey(SETTING.USE_CLINIC_INTEGRATION);
    if(nhaThuoc){
      if(nhaThuoc.isConnectivity){
        if(nhaThuoc.upgradeToPlus) muNhaThuoc = "LT+";
        else if (enableConnectivityStoreToManageStore.activated) muNhaThuoc = "QL + LT";
        else muNhaThuoc = "LT";
      } else if (nhaThuoc.isGeneralPharmacy){
        if(useClinicIntegration.activated) muNhaThuoc = "PK"; else muNhaThuoc = "CTY";
      } else {
        if(useClinicIntegration.activated)muNhaThuoc = "PK"; else muNhaThuoc = "QL";
      }
      if (nhaThuoc.expiredDate) muNhaThuoc = "PLUS";
    }
    return muNhaThuoc;
  }

  async openChangePasswordDialog() {
    // this.dialog.open(ChangePasswordDialogComponent, {
    //   width: '600px',
    // });
  }

  async openDrugStoreInfoDialog() {
    // let maNhaThuoc = this.getMaNhaThuoc();
    // this.dialog.open(DrugStoreAddEditDialogComponent, {
    //   data: {
    //     maNhaThuoc: maNhaThuoc
    //   },
    //   width: '90%',
    // });
  }

    protected readonly LOAI_THU_CHI = LOAI_THU_CHI;

  haveRoles(roles: string[]){
    return roles.some((code:any) => this.authService.getUser().roles.some((role:any) => role.roleName === code));
  }

  havePermissions(permissions: string[]){
    return permissions.some((code:any) => this.authService.getUser().authorities.some((auth:any) => auth.authority === code));
  }

  isAdmin(){
    return this.authService.getUser().isAdmin;
  }

  isLogin() {
    return this.authService.isLogin();
  }

  isChooseCS(){
    return this.authService.getUser().soCoSo > 1;
  }

  async openDetailMemberDialog() {
    console.log('open');
    var maCoSo = this.authService.getUser().maCoSo;
    this.dialog.open(MemberDetailDialogComponent, {
      data: maCoSo,
      width: '400px;',
    });
  }

  async openChooseMemberDialog() {
    console.log('open');
    var maNhaCha = this.authService.getUser().maNhaCha;
    this.dialog.open(MemberChooseDialogComponent, {
      data: maNhaCha,
      width: '900px;',
    });
  }
}

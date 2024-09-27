import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LayoutComponent} from "./layout/layout.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {NotAuthenticatedComponent} from "./pages/not-authenticated/not-authenticated.component";
import {LoginComponent} from "./pages/login/login.component";
import {MemberListComponent} from "./pages/member/member-list/member-list.component";
import {
  TransferHangCanHanListComponent
} from "./pages/transfer/transfer-hang-can-han-list/transfer-hang-can-han-list.component";
import {
  TransferHangItGiaoDichListComponent
} from "./pages/transfer/transfer-hang-it-giao-dich-list/transfer-hang-it-giao-dich-list.component";
import {
  TransferHangLuanChuyenListComponent
} from "./pages/transfer/transfer-hang-luan-chuyen-list/transfer-hang-luan-chuyen-list.component";
import {
  LookUpDoanhThuHangHoaListComponent
} from "./pages/look-up/look-up-doanh-thu-hang-hoa-list/look-up-doanh-thu-hang-hoa-list.component";
import {
  LookUpSoLuongHangHoaListComponent
} from "./pages/look-up/look-up-so-luong-hang-hoa-list/look-up-so-luong-hang-hoa-list.component";
import {
  LookUpTySuatLoiNhuanHangHoaListComponent
} from "./pages/look-up/look-up-ty-suat-loi-nhuan-hang-hoa-list/look-up-ty-suat-loi-nhuan-hang-hoa-list.component";
import {
  LookUpDuTruHangHoaListComponent
} from "./pages/look-up/look-up-du-tru-hang-hoa-list/look-up-du-tru-hang-hoa-list.component";
import {
  LookUpHangHoaLienMinhListComponent
} from "./pages/look-up/look-up-hang-hoa-lien-minh-list/look-up-hang-hoa-lien-minh-list.component";
import {AuthGuard} from "./guard/auth.guard";
import {ProductDuTruComponent} from "./pages/product/product-du-tru/product-du-tru.component";
import { DetailDuTruComponent } from './pages/product/detail-du-tru/detail-du-tru.component';
import {SystemListComponent} from "./pages/system/system-list/system-list.component";
import {NotificationHistoryComponent} from "./pages/notification/notification-history/notification-history.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {
        path: 'member',
        canActivate: [AuthGuard],
        children: [
          {path: 'list', component: MemberListComponent},
        ]
      },
      {
        path: 'look-up',
        canActivate: [AuthGuard],
        children: [
          {path: 'doanh-thu-hang-hoa/list', component: LookUpDoanhThuHangHoaListComponent},
          {path: 'so-luong-hang-hoa/list', component: LookUpSoLuongHangHoaListComponent},
          {path: 'ty-suat-loi-nhuan-hang-hoa/list', component: LookUpTySuatLoiNhuanHangHoaListComponent},
          {path: 'du-tru-hang-hoa/list', component: LookUpDuTruHangHoaListComponent},
          {path: 'hang-hoa-lien-minh/list', component: LookUpHangHoaLienMinhListComponent},
        ]
      },
      {
        path: 'product',
        canActivate: [AuthGuard],
        children: [
          {path: 'du-tru', component: ProductDuTruComponent},
          {path: 'detail-du-tru/:id', component: DetailDuTruComponent},
        ]
      },
      {
        path: 'transfer',
        canActivate: [AuthGuard],
        children: [
          {path: 'hang-can-han/list', component: TransferHangCanHanListComponent},
          {path: 'hang-it-giao-dich/list', component: TransferHangItGiaoDichListComponent},
          {path: 'hang-luan-chuyen/list', component: TransferHangLuanChuyenListComponent},
        ]
      },
      {
        path: 'system',
        canActivate: [AuthGuard],
        children: [
          {path: 'list', component: SystemListComponent},
        ]
      },
      {
        path: 'Notification',
        canActivate: [AuthGuard],
        children: [
          {path: 'History', component: NotificationHistoryComponent},
        ]
      },
    ],
  },
  {path: 'login', component: LoginComponent},
  {path: '401', component: NotAuthenticatedComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '404', pathMatch: 'full'},
];

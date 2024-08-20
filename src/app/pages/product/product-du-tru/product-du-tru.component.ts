import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../component/base/base.component";
import { TitleService } from "../../../services/title.service";
import { NhaThuocsService } from "../../../services/system/nha-thuocs.service";
import { EntityService } from "../../../services/system/entity.service";
import { MESSAGE, STATUS_API } from "../../../constants/message";
import { MemberAddEditDialogComponent } from "../../member/member-add-edit-dialog/member-add-edit-dialog.component";
import {
  MemberPermissionManagerDialogComponent
} from "../../member/member-permission-manager-dialog/member-permission-manager-dialog.component";
import { MemberHistoryDialogComponent } from "../../member/member-history-dialog/member-history-dialog.component";
import { MemberDeleteDialogComponent } from "../../member/member-delete-dialog/member-delete-dialog.component";
import { ComponentsModule } from "../../../component/base/components.module";
import { Observable, Subject } from "rxjs";
import { DuTruHangService } from '../../../services/dutruhang/du-tru-hang.service';

@Component({
  selector: 'app-product-du-tru',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './product-du-tru.component.html',
  styleUrl: './product-du-tru.component.css'
})
export class ProductDuTruComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng cần dự trù";
  listThuocType: any[] = [
    { name: '--Tất cả--', value: 0 },
    { name: 'Theo nhóm', value: 1 },
    { name: 'Theo tên', value: 2 },
  ];
  listNhomThuoc$ = new Observable<any[]>;
  listThuoc$ = new Observable<any[]>;
  searchNhomThuocTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  displayedColumns = ['#', 'tenThuoc', 'tenNhomThuoc', 'duTru', 'donViDuTru', 'donGia', 'thanhTien', 'action'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: DuTruHangService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      tongTien: [0],
      soPhieu: [],
      ngayTao: [],
      textSearch: [''],
      thuocType: [0],
      thuocGroupId: [null],
      thuocId: [null],
      checkOutStock: [false],
      maNhaCungCap: [''],
      maNhomThuoc: [''],
      loaiIn: [''],
      supplierId: [0]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    //kiểm tra data truyền từ form danh sách hàng dự trù
    let thuocCanDuTrus = this.storageService.get("thuocCanDuTru");
    //this.storageService.removeItem("thuocCanDuTru");
    console.log(thuocCanDuTrus);
    thuocCanDuTrus.forEach((x: any) => {
      x.maThuoc = x.thuocId;
      x.duTru = x.deXuatDuTru;
    })
    this.dataTable = thuocCanDuTrus;
  }

  async ngAfterViewInit() {
    this.updateTotal();
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  removeDrug(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.reduce((acc, val) => acc += (val.duTru * val.donGia), 0));
  }

  async create() {
    if (this.dataTable.filter(x => x.duTru > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    body.chiTiets = this.dataTable.filter(x => x.duTru > 0);
    let res = await this._service.createPhieuDuTru(body);
    if (res && res.status == STATUS_API.SUCCESS) {
      if (res.data && res.data.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.router.navigate(['/product/detail-du-tru', res.data.id]);
      } 
    }
  }

}

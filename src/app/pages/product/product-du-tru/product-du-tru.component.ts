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
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from "rxjs";
import { DuTruHangService } from '../../../services/dutruhang/du-tru-hang.service';
import { LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../constants/config';
import { ThuocService } from '../../../services/categories/thuoc.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';


@Component({
  selector: 'app-product-du-tru',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './product-du-tru.component.html',
  styleUrl: './product-du-tru.component.css'
})
export class ProductDuTruComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng cần dự trù";
  listNhomThuoc: any[] = [];
  listThuoc$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();

  searchTypes = [
    {name: "Tất cả", value: 0},
    {name: "Theo nhà cung cấp", value: 1},
    {name: "Nhóm thuốc", value: 2},
    {name: "Tên thuốc", value: 3},
  ]
  displayedColumns = ['#', 'tenThuoc', 'tenNhomThuoc', 'duTru', 'donViDuTru', 'donGia', 'thanhTien', 'action'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: DuTruHangService,
    private thuocService: ThuocService,
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
      supplierId: [0],
      searchType: [0],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
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

  getDataFilter() {
    // Danh sách nhóm thuốc
    this.thuocService.searchListNhomThuoc({maNhaThuoc: this.getMaNhaThuoc()}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    });
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            tenThuoc: term,
            dataDelete: false,
            typeService: LOAI_SAN_PHAM.THUOC,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.thuocService.searchListDanhSachThuoc(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              console.log(res.data);
              return res.data;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            tenNhaCungCap: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.thuocService.searchListNhaCungCap(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );

  }

  getMaNhaThuoc() {
    return this.authService.getUser().maCoSo;
  }

  async addItemReserve() {
    switch (this.formData.value?.searchType) {
      case 1:
        if (this.formData.value?.maNhaCungCap == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 nhà cung cấp.');
          return;
        } else {
        }
        break;
      case 2:
        if (this.formData.value?.maNhomThuoc == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 nhóm sản phẩm.');
          return;
        }
        break;
      case 3:
        if (this.formData.value?.thuocId == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 sản phẩm.');
          return;
        }
        break;
    }
    let body = {
      id: this.formData.value?.thuocId,
      nhomThuocMaNhomThuoc: this.formData.value?.maNhomThuoc,
      nhaCungCapMaNhaCungCap: this.formData.value?.maNhaCungCap,
      checkOutStock: this.formData.value?.checkOutStock,
      paggingReq: {limit: 1000, page: 0},
    };
    this._service.initCreateReserve(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        var data = res.data.content;
        var numItemAdd = 0;
        data.forEach((item: any) => {
          item.maThuocText = item.maThuoc;
          item.maThuoc = item.id;
          item.tenThuocText = item.tenThuoc;
          item.soLuongCanhBao = item.duTru;
          item.duTru = 0;
          item.maDonViTon = item.donViXuatLeMaDonViTinh;
          item.maDonViTonText = item.tenDonViTinhXuatLe;
          item.maDonViDuTru = item.donViThuNguyenMaDonViTinh > 0 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          item.tenDonViTinh = item.donViThuNguyenMaDonViTinh > 0 ? item.tenDonViTinhThuNguyen : item.tenDonViTinhXuatLe;
          item.donGia = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
          if (this.dataTable.filter(x => x.id == item.id).length == 0) {
            this.dataTable.push(item);
            numItemAdd++;
          }
        });
        this.notification.success(MESSAGE.SUCCESS, 'Đã thêm ' + numItemAdd + " thuốc vào danh sách.");
      }
    });
  }

  removeDrug(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
    this.updateTotal();
  }

  removeAllItem() {
    this.dataTable = [];
    this.formData.patchValue({tongTien: 0});
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

  async createUpdateNhaCC() {
    // const validDataTable = this.dataTable.filter(x => x.duTru > 0);
    // if (validDataTable.length === 0) {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    //   return;
    // }
    // const dataGroup = _.chain(validDataTable).groupBy('maNhaCungCap').map((value: any[], key: any) => ({
    //   supplierId: key,
    //   tongTien: value.reduce((acc: number, val: { duTru: number; donGia: number; }) => acc + (val.duTru * val.donGia), 0),
    //   chiTiets: value
    // })).value();
    // if (dataGroup) {
    //   this.markFormGroupTouched(dataGroup);
    //   const res = await this._service.createNhaCC(dataGroup);
    //   if (res?.status === STATUS_API.SUCCESS && res?.data) {
    //     if (res.data.length === 1) {
    //       this.router.navigate(['/product/detail-du-tru', res.data[0].id]);
    //     } else {
    //       this.router.navigate(['/management/note-management/list'],
    //         {queryParams: {noteTypeId: LOAI_PHIEU.PHIEU_DU_TRU}});
    //     }
    //   }
    // }
  }

  onGetDrugOutOfStock() {
    this.formData.patchValue({checkOutStock: true});
    this.addItemReserve();
    this.formData.patchValue({checkOutStock: false});
  }

  clearSearchTypeValue() {
    this.formData.patchValue({
      maNhaCungCap: '',
      maNhomThuoc: '',
      thuocId: ''
    });
  }

}

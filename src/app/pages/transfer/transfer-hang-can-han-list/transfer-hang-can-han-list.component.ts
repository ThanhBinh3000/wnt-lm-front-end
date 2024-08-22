import { Component, Injector, OnInit } from '@angular/core';
import { ComponentsModule } from "../../../component/base/components.module";
import { BaseComponent } from "../../../component/base/base.component";
import { TitleService } from "../../../services/title.service";
import { NhaThuocsService } from "../../../services/system/nha-thuocs.service";
import { Observable, Subject } from "rxjs";
import { TransferHangDialogComponent } from "../transfer-hang-dialog/transfer-hang-dialog.component";
import { LuanChuyenService } from '../../../services/dutruhang/luan-chuyen.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { HangHoaLuanChuyenService } from '../../../services/dutruhang/hang-hoa-luan-chuyen.service';

@Component({
  selector: 'app-transfer-hang-can-han-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './transfer-hang-can-han-list.component.html',
  styleUrl: './transfer-hang-can-han-list.component.css'
})
export class TransferHangCanHanListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng cận hạn";
  listData: any = [];
  listThuocType: any[] = [
    { name: '--Tất cả--', value: 0 },
    { name: 'Theo nhóm', value: 1 },
    { name: 'Theo tên', value: 2 },
  ];
  listLuanChuyenType: any[] = [
    { name: 'Chưa đăng ký', value: 0 },
    { name: 'Đã đăng ký', value: 1 },
  ];
  listNhomThuoc$ = new Observable<any[]>;
  listThuoc$ = new Observable<any[]>;
  searchNhomThuocTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  displayedColumns = ['checkbox', '#', 'soPhieuNhap', 'ngayNhap', 'maThuoc', 'tenThuoc', 'donVi', 'soLuongTon', 
    'soLo', 'hanSuDung', 'soDangKy', 'ghiChu', 'action'
  ];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: HangHoaLuanChuyenService,
    private luanChuyenService: LuanChuyenService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      thuocType: [0],
      thuocGroupId: [null],
      thuocId: [null],
      hangLuanChuyen: [0],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPage();
  }

  override async searchPage() {
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.luanChuyenService.searchPageHangCanHan(body);
    if (res?.status == STATUS_API.SUCCESS) {
      let data = res.data;
      console.log(data);
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }

  async luanChuyenMulti() {
    let dataLuanChuyen: any[] = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.hangLuanChuyen) {
          dataLuanChuyen.push(item);
        }
      });
    }
    if (dataLuanChuyen && dataLuanChuyen.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: 'Bạn có chắc chắn muốn đăng ký hàng hoá đã chọn không?',
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this.service.create(dataLuanChuyen);
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, 'Đăng ký hàng hoá thành công');
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có hàng hoá phù hợp để đăng ký.");
    }
  }

  override updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.hangLuanChuyen = true;
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.hangLuanChuyen = false;
        });
      }
    }
  }

  override updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.hangLuanChuyen)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.hangLuanChuyen)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async cancelHangLuanChuyen(data : any) {
    if (data && data.hangLuanChuyen) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: 'Bạn có chắc chắn muốn huỷ đăng ký mặt hàng này?',
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this._service.cancelHH(data);
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, 'Huỷ thành công');
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Hàng này chưa đăng ký luân chuyển");
    }
  }

  async openTransferHangDialog(hangHoa: any) {
    const dialogRef = this.dialog.open(TransferHangDialogComponent, {
      data: hangHoa,
      width: '600px',
    });
  }
}

import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup} from "@angular/forms";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {ComponentsModule} from "../../../../component/base/components.module";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {ChiTietHangLuanChuyenService} from "../../../../services/dutruhang/chi-tiet-hang-luan-chuyen.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {ModalComponent} from "../../../../component/modal/modal.component";


@Component({
  selector: 'app-transaction-history-out-item-table',
  standalone: true,
  imports: [
    ComponentsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable
  ],
  templateUrl: './transaction-history-out-item-table.component.html',
  styleUrl: './transaction-history-out-item-table.component.css'
})
export class TransactionHistoryOutItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: ChiTietHangLuanChuyenService,
  ) {
    super(injector, _service);
  }

  showModelDongY: boolean = false;
  showModelTuChoi: boolean = false;
  showModelHoaThanh: boolean = false;
  modalData: any;
  inputText?: string;

  trangThais: any[] = [
    { name: 'Chờ phản hồi bên bán', value: 1},
    { name: 'Chờ phản hồi bên mua', value: 6},
    { name: 'Đang giao dịch', value: 2},
    { name: 'Đang chuẩn bị hàng', value: 8 },
    { name: 'Đang giao hàng', value: 9 },
    { name: 'Bên bán từ chối', value: 4 },
    { name: 'Bên mua từ chối', value: 7 },
    { name: 'Giao dịch thành công', value: 3 },
    { name: 'Giao dịch thất bại', value: 5 },
  ];

  displayedColumns = [
    '#',
    'coSo',
    'maGiaoDich',
    'trangThai',
    'created',
    'tenThuoc',
    'donVi',
    'giaBan',
    'phiVanChuyen',
    'soLuong',
    'soLo',
    'hanSuDung',
    'loaiHang',
    'ghiChu',
    'action'
  ];

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateNgayXuat: newValue.fromDate,
        toDateNgayXuat: newValue.toDate,
      });
    });
    await this.searchPageHangDi();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  async searchPageHangDi() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.searchPageHangDi(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }

  openConfirmDialogDongY(data: any) {
    this.showModelDongY = true;
    this.modalData = data;
    this.modalData.tenCoSo1 = this.authService.getUser().tenNhaThuoc;
    this.modalData.diaChi1 = this.authService.getUser().diaChi;
    this.modalData.soDienThoai1 = this.authService.getUser().soDienThoai;
    console.log(this.authService.getUser());
    this.inputText = '';
  }

  closeModalDongY() {
    this.showModelDongY = false;
  }

  async onModalDongY() {
    if (!this.modalData) {
      return;
    }
    try {
      var body = this.modalData;
      body.soDienThoai = body.soDienThoai1;
      body.diaChi = body.diaChi1;
      body.tenCoSo = body.tenCoSo1;
      const res = await this._service.getDongYBenBan(body);
      if (res?.status === STATUS_API.SUCCESS) {
        this.requestSearchPage.emit();
        this.notification.success(MESSAGE.SUCCESS, 'Bạn đã đồng ý cung cấp thông tin thành công.');
        this.closeModalDongY();
      } else {
        this.notification.error(MESSAGE.ERROR, 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.notification.error(MESSAGE.ERROR, 'Cập nhật thất bại.');
    } finally {
      this.closeModalTuChoi();
    }
  }

  openConfirmDialogTuChoi(data: any) {
    this.showModelTuChoi = true;
    this.modalData = data;
    this.inputText = '';
  }

  closeModalTuChoi() {
    this.showModelTuChoi = false;
  }

  async onModalTuChoi() {
    if (!this.modalData) {
      return;
    }
    this.modalData.ghiChu = this.inputText;
    try {
      const res = await this._service.getTuChoiBenBan(this.modalData);
      if (res?.status === STATUS_API.SUCCESS) {
        this.requestSearchPage.emit();
        this.notification.success(MESSAGE.SUCCESS, 'Cập nhật trạng thái giao dịch thành công.');
      } else {
        this.notification.error(MESSAGE.ERROR, 'Cập nhật trạng thái giao dịch thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      this.notification.error(MESSAGE.ERROR, 'Cập nhật trạng thái giao dịch thất bại');
    } finally {
      this.closeModalTuChoi();
    }
  }

  openConfirmDialogHoanThanh(data: any) {
    this.showModelHoaThanh = true;
    this.modalData = data;
  }

  closeModalHoanThanh() {
    this.showModelHoaThanh = false;
  }

  async onModalHoanThanh(check: boolean) {
    if (!this.modalData) {
      return;
    }
    this.modalData.thanhCong = check;
    try {
      const res = await this._service.getHoanThanhGiaoDich(this.modalData);
      if (res?.status === STATUS_API.SUCCESS) {
        this.requestSearchPage.emit();
        this.notification.success(MESSAGE.SUCCESS, check ?  'Bạn đã hoàn thành giao dịch thành công.' : 'Bạn đã từ chối giao dịch thành công.');
      } else {
        this.notification.error(MESSAGE.ERROR, 'Hoàn thành thất bại.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.notification.error(MESSAGE.ERROR, 'Hoàn thành thất bại.');
    } finally {
      this.closeModalHoanThanh();
    }
  }

  async changePageSizeHangDi(event: any) {
    try {
      this.pageSize = event;
      this.searchPageHangDi();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndexHangDi(event: any) {
    try {
      this.page = event;
      this.searchPageHangDi();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeTrangThai(data: any) {
    try {
      const res = await this.service.update(data);
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, `Cập nhật trạng thái thành công`);
            } else {
              this.notification.error(MESSAGE.ERROR, 'Cập nhật trạng thái thất bại!');
              await this.searchPageHangDi();
            }
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      await this.searchPageHangDi();
    }
  }
}

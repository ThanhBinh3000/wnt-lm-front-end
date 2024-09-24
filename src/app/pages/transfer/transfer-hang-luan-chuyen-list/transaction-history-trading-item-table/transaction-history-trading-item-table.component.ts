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
  selector: 'app-transaction-history-trading-item-table',
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
  templateUrl: './transaction-history-trading-item-table.component.html',
  styleUrl: './transaction-history-trading-item-table.component.css'
})
export class TransactionHistoryTradingItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: ChiTietHangLuanChuyenService,
  ) {
    super(injector, _service);
  }

  showModelTuChoi: boolean = false;
  showModelHoaThanh: boolean = false;
  modalData: any;
  inputText?: string;


  displayedColumns = [
    '#',
    'coSo',
    'maGiaoDich',
    'trangThai',
    'created',
    'tenThuoc',
    'donVi',
    'soLuong',
    'soLo',
    'hanSuDung',
    'loaiHang',
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
    await this.searchPageHangDangGiaoDich();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  async searchPageHangDangGiaoDich() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.searchPageHangDangGiaoDich(body);
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
    const itemName = data.tenThuoc || 'này';
    let message = `Bạn có đồng ý luân chuyển mặt hàng này và chia sẽ thông tin cơ sở để thực hiện hay không?`;
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      cancelText: 'Đóng',
      okText: 'Đồng ý',
      okDanger: true,
      width: 310,
      onOk: async () => {
        if (data && typeof data === 'object') {
          try {
            const res = await this._service.getDongYGiaoDich(data);
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, 'Bạn đã thực hiện việc luân chuyển thành công.');
            } else {
              this.notification.error(MESSAGE.ERROR, 'Luân chuyển thất bại.');
            }
          } catch {
            this.notification.error(MESSAGE.ERROR, 'Luân chuyển thất bại.');
          }
        }
      }
    });
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
      const res = await this._service.getTuChoiGiaoDich(this.modalData);
      if (res?.status === STATUS_API.SUCCESS) {
        this.requestSearchPage.emit();
        this.notification.success(MESSAGE.SUCCESS, 'Bạn đã từ chối giao dịch thành công.');
      } else {
        this.notification.error(MESSAGE.ERROR, 'Giao dịch thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      this.notification.error(MESSAGE.ERROR, 'Giao dịch thất bại');
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

  async changePageSizeHangQuanTam(event: any) {
    try {
      this.pageSize = event;
      this.searchPageHangDangGiaoDich();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndexHangQuanTam(event: any) {
    try {
      this.page = event;
      this.searchPageHangDangGiaoDich();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}

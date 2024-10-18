import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup} from "@angular/forms";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {ChiTietHangLuanChuyenService} from "../../../../services/dutruhang/chi-tiet-hang-luan-chuyen.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
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

@Component({
  selector: 'app-transaction-history-care-about-item-table',
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
  templateUrl: './transaction-history-care-about-item-table.component.html',
  styleUrl: './transaction-history-care-about-item-table.component.css'
})
export class TransactionHistoryCareAboutItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: ChiTietHangLuanChuyenService,
  ) {
    super(injector, _service);
  }

  displayedColumns = [
    'checkbox',
    '#',
    'coSo',
    'maGiaoDich',
    'trangThai',
    'created',
    'tenThuoc',
    'donVi',
    'giaBan',
    'soLuong',
    'soLo',
    'hanSuDung',
    'loaiHang',
    'action',
  ];

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateNgayXuat: newValue.fromDate,
        toDateNgayXuat: newValue.toDate,
      });
    });
    await this.searchPageHangQuanTam();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  async searchPageHangQuanTam() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }

      let res = await this._service.searchPageHangQuanTam(body);
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

  openCareAboutDialog(data?: any,) {
    const hasChecked = this.dataTable?.some(item => item.checked);
    if (!hasChecked && data === null) {
      this.notification.error(MESSAGE.ERROR, 'Bạn vui lòng chọn mặt hàng để mua.');
      return;
    }
    let message = this.dataTable.filter(item => item.checked).length > 1 
    ? `Bạn có muốn mua những mặt hàng đã chọn này hay không ?` : `Bạn có muốn mua mặt hàng này hay không ?`;
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      cancelText: 'Đóng',
      okText: 'Đồng ý',
      okDanger: true,
      width: 310,
      onOk: async () => {
        const checkedItems = data === null ? this.dataTable.filter(item => item.checked) : [data];
        if (checkedItems.length > 0) {
          try {
            const res = await this._service.getGuiThongBao(checkedItems);
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, 'Đã đặt mua thành công, vui lòng đợi phản hồi.');
            } else {
              this.notification.error(MESSAGE.ERROR, 'Đặt mua thất bại.');
            }
          } catch {
            this.notification.error(MESSAGE.ERROR, 'Đặt mua thất bại.');
          }
        }
      }
    });
  }

  openConfirmDialog(data: any) {
    let message = 'Bạn muốn huỷ mặt hàng này không ?';
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
          if (!([0,1].includes(data.trangThai))) {
            this.notification.error(MESSAGE.ERROR, 'Hàng đang trong quá trình giao dịch, hiện không thể hủy mặt hàng.');
            return;
          }
          try {
            const res = await this._service.delete(data);
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, 'Bạn đã hũy mặt hàng thành công.');
            } else {
              this.notification.error(MESSAGE.ERROR, 'Yêu cầu hũy thất bại.');
            }
          }catch {
            this.notification.error(MESSAGE.ERROR, 'Yêu cầu hũy thất bại.');
          }
        }
      }
    });
  }

  async changePageSizeHangQuanTam(event: any) {
    try {
      this.pageSize = event;
      this.searchPageHangQuanTam();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndexHangQuanTam(event: any) {
    try {
      this.page = event;
      this.searchPageHangQuanTam();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}

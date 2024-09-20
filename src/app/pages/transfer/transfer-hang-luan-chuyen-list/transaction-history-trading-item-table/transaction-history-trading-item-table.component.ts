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

  openConfirmDialog(data: any) {
    let message = `Bạn có muốn chia sẻ thông tin mặt hàng cho cơ sở ${data.tenCoSo ? data.tenCoSo : 'này'} không?`;
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
          this._service.update(data).then((res) => {
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, 'Bạn đã chia sẽ  hàng thành công.');
            } else {
              this.notification.error(MESSAGE.ERROR, 'Chia sẽ thông tin thất bại.');
            }
          }).catch(() => {
            this.notification.error(MESSAGE.ERROR, 'Chia sẽ thông tin thất bại.');
          });
        }
      }
    });
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

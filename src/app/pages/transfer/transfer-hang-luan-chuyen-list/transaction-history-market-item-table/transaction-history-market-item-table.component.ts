import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BaseComponent} from "../../../../component/base/base.component";
import {HangHoaLuanChuyenService} from "../../../../services/dutruhang/hang-hoa-luan-chuyen.service";
import {MatSort} from "@angular/material/sort";
import {ComponentsModule} from "../../../../component/base/components.module";
import {ChiTietHangLuanChuyenService} from "../../../../services/dutruhang/chi-tiet-hang-luan-chuyen.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";

@Component({
  selector: 'app-transaction-history-market-item-table',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './transaction-history-market-item-table.component.html',
  styleUrl: './transaction-history-market-item-table.component.css'
})
export class TransactionHistoryMarketItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: HangHoaLuanChuyenService,
    private chiTietHangLuanChuyenService: ChiTietHangLuanChuyenService,
  ) {
    super(injector, _service);
  }

  displayedColumns = [
    '#',
    'coSo',
    'diaChi',
    'created',
    'tenThuoc',
    'donVi',
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
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  async openConfirmDialog(data: any) {
    let message = 'Bạn đang quan tâm mặt hàng này và muốn biết thông tin giao dịch của mặt hàng này phải không ?';
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
          const body = {
            thuocId: data.thuocId,
            soLuong: data.soLuong,
            maCoSoGui: data.maCoSo,
            idLuanChuyen: data.id,
          };
          try {
            const res = await this.chiTietHangLuanChuyenService.create(body);
            if (res?.status === STATUS_API.SUCCESS) {
              this.requestSearchPage.emit();
              this.notification.success(MESSAGE.SUCCESS, 'Yêu cầu của bạn đã được gửi tới cơ sở có mặt hàng này. Đang chờ phản hồi.');
            } else {
              this.notification.error(MESSAGE.ERROR, 'Yêu cầu thất bại.');
            }
          } catch {
            this.notification.error(MESSAGE.ERROR, 'Yêu cầu thất bại.');
          }
        }
      }
    });
  }

}

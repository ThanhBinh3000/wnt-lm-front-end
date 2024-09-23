import {Component, EventEmitter, Injector, OnInit, ViewChild} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap} from "rxjs";
import {TitleService} from "../../../services/title.service";
import {TransferHangDialogComponent} from "../transfer-hang-dialog/transfer-hang-dialog.component";
import {HangHoaLuanChuyenService} from '../../../services/dutruhang/hang-hoa-luan-chuyen.service';
import {ThongTinKhuVucService} from '../../../services/categories/thong-tin-khu-vuc.service';
import {STATUS_API} from '../../../constants/message';
import {LOAI_SAN_PHAM} from '../../../constants/config';
import {ThuocService} from '../../../services/categories/thuoc.service';
import {
  TransactionHistoryMarketItemTableComponent
} from "./transaction-history-market-item-table/transaction-history-market-item-table.component";
import {
  TransactionHistoryCareAboutItemTableComponent
} from "./transaction-history-care-about-item-table/transaction-history-care-about-item-table.component";
import {
  TransactionHistoryTradingItemTableComponent
} from "./transaction-history-trading-item-table/transaction-history-trading-item-table.component";

@Component({
  selector: 'app-transfer-hang-luan-chuyen-list',
  standalone: true,
  imports: [ComponentsModule,
    TransactionHistoryMarketItemTableComponent,
    TransactionHistoryCareAboutItemTableComponent,
    TransactionHistoryTradingItemTableComponent],
  templateUrl: './transfer-hang-luan-chuyen-list.component.html',
  styleUrl: './transfer-hang-luan-chuyen-list.component.css'
})
export class TransferHangLuanChuyenListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng luân chuyển";
  @ViewChild(TransactionHistoryMarketItemTableComponent) transactionHistoryMarketItemTableComponent?: TransactionHistoryMarketItemTableComponent;
  @ViewChild(TransactionHistoryCareAboutItemTableComponent) transactionHistoryCareAboutItemTableComponent?: TransactionHistoryCareAboutItemTableComponent;
  @ViewChild(TransactionHistoryTradingItemTableComponent) transactionHistoryTradingItemTableComponent?: TransactionHistoryTradingItemTableComponent;
  formDataChange = new EventEmitter();
  checkTab: string = 'market';
  listLoaiHang: any = [
    {name: 'Hàng cận hạn', value: 1},
    {name: 'Hàng ít giao dịch', value: 2},
  ];
  listTinhThanh: any = [];
  listQuanHuyen: any = [];
  listPhuongXa: any = [];
  listNhomNganhHang: any = [];
  listNhomDuocLy: any = [];
  listNhomHoatChat: any = [];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  displayedColumns = ['#', 'coSo', 'diaChi', 'created', 'tenThuoc', 'donVi', 'soLuong', 'soLo', 'hanSuDung', 'loaiHang', 'ghiChu'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: HangHoaLuanChuyenService,
    private thongTinKhuVucService: ThongTinKhuVucService,
    private thuocService: ThuocService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      thuocType: [0],
      thuocGroupId: [null],
      thuocId: [null],
      loaiHang: [null],
      regionId: [this.authService.getUser().regionId],
      cityId: [this.authService.getUser().cityId],
      wardId: [this.authService.getUser().wardId],
      recordStatusId: [0],
      nhomNganhHangId: [],
      nhomDuocLyId: [],
      nhomHoatChatId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      this.checkTab = (tab == 1) ? 'market' : (tab == 2) ? 'careAbout' : (tab == 3) ? 'trading' : this.checkTab;
    });
    await this.getDataFilter();
  }

  override async searchPage() {
    this.formDataChange.emit(this.formData.value);
    await this.transactionHistoryMarketItemTableComponent?.searchPage();
    await this.transactionHistoryCareAboutItemTableComponent?.searchPageHangQuanTam();
    await this.transactionHistoryTradingItemTableComponent?.searchPageHangDangGiaoDich();
  }

  async getDataFilter() {
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            tenThuoc: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: '0012',
            typeService: LOAI_SAN_PHAM.THUOC
          };
          return from(this.thuocService.searchListDanhSachThuoc(body).then((res) => {
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
    await this.getListTinhThanh();
    await this.getListQuanHuyen(this.formData.get('regionId')?.value);
    await this.getListPhuongXa(this.formData.get('cityId')?.value);
    await this.getListNhomNganhHang();
    await this.getListNhomDuocLy();
    await this.getListNhomHoatChat();
    await this.searchPage();
  }

  async getListTinhThanh() {
    this.thongTinKhuVucService.searchListTinhThanh({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
  }

  async getListQuanHuyen(tinhThanhId: any) {
    if (tinhThanhId) {
      let body: any = {
        regionId: tinhThanhId
      }
      this.thongTinKhuVucService.searchListQuanHuyen(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listQuanHuyen = res.data;
        }
      });
    }
  }

  async getListPhuongXa(quanHuyenId: any) {
    if (quanHuyenId) {
      let body: any = {
        cityId: quanHuyenId
      }
      this.thongTinKhuVucService.searchListPhuongXa(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listPhuongXa = res.data;
        }
      });
    }
  }

  async getListNhomNganhHang() {
    const res = await this.thuocService.searchListNhomNganhHang({});
    if (res?.status === STATUS_API.SUCCESS) {
      this.listNhomNganhHang = res.data?.map(({id, ...item}: any) => ({
        ...item,
        nhomNganhHangId: id
      })) || [];
    }
  }

  async getListNhomDuocLy() {
    const res = await this.thuocService.searchListNhomDuocLy({});
    if (res?.status === STATUS_API.SUCCESS) {
      this.listNhomDuocLy = res.data?.map(({id, ...item}: any) => ({
        ...item,
        nhomDuocLyId: id
      })) || [];
    }
  }

  async getListNhomHoatChat() {
    const res = await this.thuocService.searchListNhomHoatChat({});
    if (res?.status === STATUS_API.SUCCESS) {
      this.listNhomHoatChat = res.data?.map(({id, ...item}: any) => ({
        ...item,
        nhomHoatChatId: id
      })) || [];
    }
  }

  async changeTinhThanh($event: any) {
    this.formData.patchValue({cityId: null, wardId: null});
    if ($event) await this.getListQuanHuyen($event.id);
  }

  async changeQuanHuyen($event: any) {
    this.formData.patchValue({wardId: null});
    if ($event) await this.getListPhuongXa($event.id);
  }

  async openTransferHangDialog(hangHoa: any) {
    const dialogRef = this.dialog.open(TransferHangDialogComponent, {
      data: hangHoa,
      width: '600px',
    });
  }

  async onRequestSearchPage() {
    await this.searchPage();
  }
}

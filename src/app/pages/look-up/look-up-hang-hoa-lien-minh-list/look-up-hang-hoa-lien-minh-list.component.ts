import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {LookUpNguonHangDialogComponent} from "../look-up-nguon-hang-dialog/look-up-nguon-hang-dialog.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {HangHoaService} from "../../../services/products/hang-hoa.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {ThuocService} from "../../../services/categories/thuoc.service";

@Component({
  selector: 'app-look-up-hang-hoa-lien-minh-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-hang-hoa-lien-minh-list.component.html',
  styleUrl: './look-up-hang-hoa-lien-minh-list.component.css'
})
export class LookUpHangHoaLienMinhListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng hoá Liên Minh";
  listNhomThuoc: any = [];
  listNhomDuocLy: any = [];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  collapseColumns = ['thongTinChung', 'phoGiaBan', 'phoGiaNhap', 'doanhThu', 'action1'];
  displayedColumns = ['#', 'tenThuoc', 'tenNhomHoatChat', 'tenNhomThuoc', 'tenNhomDuocLy', 'tenDonVi', 'giaBanMin', 'giaBanMax', 'giaNhapMin', 'giaNhapMax', 'doanhSoTT', 'doanhSoCS', 'action2'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: HangHoaService,
    private thuocService: ThuocService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      thuocIds: [null],
      hoatChat: [''],
      nhomThuocId: [],
      nhomDuocLy: [null],
      hangBanKem: [''],
      hangThayThe: [''],
      thuocId: [],
      hamLuong:[],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPageHangHoa();
    this.getDataFilter();
  }

  getDataFilter() {

    this.thuocService.searchListDanhSachThuoc({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    });

    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
            recordStatusId: 0,
            searchInfoType: 0,
            searchType: 5,
            ignoreLoadingIndicator: true,
            typeService: 0
          };
          return from(this.thuocService.searchPageDanhSachThuoc(bodyThuoc).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
  }

  async onDrugChange(data: any) {
    if (data && data.thuocId > 0) {
      this.dataTable[0].tenThuoc = data.tenThuoc;
      this.formData.value.thuocId = data.thuocId;
    }
  }

  async searchPageHangHoa() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.searchPageHangHoa(body);
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

  async openNguonHangDialog(nguonHang: any) {
    const dialogRef = this.dialog.open(LookUpNguonHangDialogComponent, {
      data: nguonHang,
      width: '600px',
    });
  }

  async changePageSizeHangHoa(event: any) {
    try {
      this.pageSize = event;
      await this.searchPageHangHoa();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndexHangHoa(event: any) {
    try {
      this.page = event;
      await this.searchPageHangHoa();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


}

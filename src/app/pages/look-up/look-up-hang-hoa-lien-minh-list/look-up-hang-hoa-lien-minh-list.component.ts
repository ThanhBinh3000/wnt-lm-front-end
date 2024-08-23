import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {LookUpNguonHangDialogComponent} from "../look-up-nguon-hang-dialog/look-up-nguon-hang-dialog.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {HangHoaService} from "../../../services/products/hang-hoa.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {ThuocService} from "../../../services/categories/thuoc.service";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-look-up-hang-hoa-lien-minh-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-hang-hoa-lien-minh-list.component.html',
  styleUrl: './look-up-hang-hoa-lien-minh-list.component.css'
})
export class LookUpHangHoaLienMinhListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng hoá Liên Minh";
  listNhomNganhHang: any = [];
  listNhomDuocLy: any = [];
  listNhomHoatChat: any = [];
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
      thuocId: [],
      nhomNganhHangId: [],
      nhomDuocLyId: [],
      nhomHoatChatId: [],
      hangThayTheId: [],
      hangBanKemId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPageHangHoa();
    await this.getDataFilter();
  }

  async getDataFilter() {

    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            tenThuoc: term,
          };
          return from(this.thuocService.searchListDanhSachThuoc(bodyThuoc).then((res) =>
            res?.status === STATUS_API.SUCCESS ? res.data : []));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );

    const res = await this.thuocService.searchListNhomNganhHang({});
    if (res?.status === STATUS_API.SUCCESS) {
      this.listNhomNganhHang = res.data?.map((item: any) => ({
        ...item,
        nhomNganhHangId: item.id
      })) || [];
    }
  }

  async onFieldChange(data: any, fieldName: string) {
    if (data?.thuocId > 0) {
      const patchObject: { [key: string]: any } = {};
      patchObject[fieldName] = data.thuocId;
      this.formData.patchValue(patchObject);
    }
  }

  async onDuocLyChange(data: any) {
    if (data?.nhomNganhHangId > 0) {
      const res = await this.thuocService.searchListNhomDuocLy({
        nhomNganhHangId: data.nhomNganhHangId
      });
      if (res?.status === STATUS_API.SUCCESS) {
        this.listNhomDuocLy = res.data?.map((item: any) => ({
          ...item,
          nhomDuocLyId: item.id
        })) || [];
      }
    }
  }

  async onHoatChatChange(data: any) {
    if (data?.nhomDuocLyId > 0) {
      const res = await this.thuocService.searchListNhomHoatChat({
        nhomDuocLyId: data.nhomDuocLyId
      });
      if (res?.status === STATUS_API.SUCCESS) {
        this.listNhomHoatChat = res.data?.map((item: any) => ({
          ...item,
          nhomHoatChatId: item.id
        })) || [];
      }
    }
  }

  async searchPageHangHoa() {
    try {
      const body = {
        ...this.formData.value,
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1
        }
      };
      const res = await this._service.searchPageHangHoa(body);
      if (res?.status === STATUS_API.SUCCESS) {
        const {content, totalElements, totalPages} = res.data;
        this.dataTable = content;
        this.totalRecord = totalElements;
        this.totalPages = totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.totalPages = 0;
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

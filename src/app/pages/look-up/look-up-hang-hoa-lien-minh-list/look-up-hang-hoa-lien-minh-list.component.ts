import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {LookUpNguonHangDialogComponent} from "../look-up-nguon-hang-dialog/look-up-nguon-hang-dialog.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {HangHoaService} from "../../../services/products/hang-hoa.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {ThuocService} from "../../../services/categories/thuoc.service";
import { SETTING } from '../../../constants/setting';


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
  collapseColumns = ['thongTinChung', 'phoGiaBan', 'phoGiaNhap','soLuong', 'doanhThu', 'action1'];
  displayedColumns = ['#', 'tenThuoc','hinhAnh', 'tenDonVi', 'giaBanMin', 'giaBanMax', 'giaNhapMin', 'giaNhapMax','soLuongCs',
    'soLuongTT', 'doanhSoCS', 'doanhSoTT', 'action2'];
 
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
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.getDataFilter();
    await this.searchPageHangHoa();
  }

  async getDataFilter() {
    // search nhóm thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            tenThuoc: term,
            maNhaThuoc: "0012",
            paggingReq: {limit: 25, page: 0},
          };
          return from(this.thuocService.searchListDanhSachThuoc(bodyThuoc).then((res) =>
            res?.status === STATUS_API.SUCCESS ? res.data : []));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
    // search nhóm khách hàng
    this.thuocService.searchListNhomNganhHang({}).then((res) => {
      if (res?.status === STATUS_API.SUCCESS) {
        this.listNhomNganhHang = res.data?.map((item: any) => ({
          ...item,
          nhomNganhHangId: item.id
        })) || [];
      }
    })
    // search nhóm dược lý
    this.thuocService.searchListNhomDuocLy({}).then((res) => {
      if (res?.status === STATUS_API.SUCCESS) {
        this.listNhomDuocLy = res.data?.map((item: any) => ({
          ...item,
          nhomDuocLyId: item.id
        })) || [];
      }
    })
    // search nhóm hoạt chất
    this.thuocService.searchListNhomHoatChat({}).then((res) => {
      if (res?.status === STATUS_API.SUCCESS) {
        this.listNhomHoatChat = res.data?.map((item: any) => ({
          ...item,
          nhomHoatChatId: item.id
        })) || [];
      }
    })
  }

  async onThuocChange(data: any) {
    if (data?.thuocId > 0) {
      this.formData.patchValue({thuocId: data.thuocId});
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

  toggleShowMore(data: any): void {
    const dataArray = this.dataSource.data;
    dataArray.forEach((item: any) => {
      if (item !== data) {
        item.showMore = false;
      }
    });
    data.showMore = !data.showMore;
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

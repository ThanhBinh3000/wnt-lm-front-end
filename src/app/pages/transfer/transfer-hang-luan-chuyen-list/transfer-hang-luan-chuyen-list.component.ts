import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {Observable, Subject} from "rxjs";
import {TitleService} from "../../../services/title.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {TransferHangDialogComponent} from "../transfer-hang-dialog/transfer-hang-dialog.component";
import { HangHoaLuanChuyenService } from '../../../services/dutruhang/hang-hoa-luan-chuyen.service';
import { ThongTinKhuVucService } from '../../../services/categories/thong-tin-khu-vuc.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-transfer-hang-luan-chuyen-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './transfer-hang-luan-chuyen-list.component.html',
  styleUrl: './transfer-hang-luan-chuyen-list.component.css'
})
export class TransferHangLuanChuyenListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng luân chuyển";
  listData: any = [];
  listLoaiHang: any = [
    {name: 'Hàng cận hạn', value: 1},
    {name: 'Hàng ít giao dịch', value: 2},
  ];
  listTinhThanh: any = [];
  listQuanHuyen: any = [];
  listPhuongXa: any = [];
  listThuocType: any[] = [
    {name: '--Tất cả--', value: 0},
    {name: 'Theo nhóm', value: 1},
    {name: 'Theo tên', value: 2},
  ];
  listNhomThuoc$ = new Observable<any[]>;
  listThuoc$ = new Observable<any[]>;
  searchNhomThuocTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  displayedColumns = ['#', 'coSo', 'diaChi', 'tenThuoc', 'donVi', 'soLuong', 'soLo', 'hanSuDung', 'loaiHang', 'ghiChu'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: HangHoaLuanChuyenService,
    private thongTinKhuVucService: ThongTinKhuVucService,
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
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.getListTinhThanh();
    await this.getListQuanHuyen(this.formData.get('regionId')?.value);
    await this.getListPhuongXa(this.formData.get('cityId')?.value);
    await this.searchPage();
    //console.log(this.dataTable);
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

  async changeTinhThanh($event: any) {
    this.formData.patchValue({cityId: null, wardId: null});
    if($event) await this.getListQuanHuyen($event.id);
  }

  async changeQuanHuyen($event: any) {
    this.formData.patchValue({wardId: null});
    if($event) await this.getListPhuongXa($event.id);
  }

  async openTransferHangDialog(hangHoa: any) {
    const dialogRef = this.dialog.open(TransferHangDialogComponent, {
      data: hangHoa,
      width: '600px',
    });
  }
}

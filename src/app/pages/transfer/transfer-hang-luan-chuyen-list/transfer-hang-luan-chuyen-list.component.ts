import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {Observable, Subject} from "rxjs";
import {TitleService} from "../../../services/title.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {TransferHangDialogComponent} from "../transfer-hang-dialog/transfer-hang-dialog.component";

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
  listLoaiHang: any = [];
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
  displayedColumns = ['#', 'coSo', 'diaChi', 'tenThuoc', 'donVi', 'soLuong', 'soLo', 'hanSuDung', 'loaiHang', 'ghiChu', 'action' ];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: NhaThuocsService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      thuocType: [0],
      thuocGroupId: [null],
      thuocId: [null],
      loaiHang: [null],
      tinhThanh: [null],
      quanHuyen: [null],
      phuongXa: [null],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    // await this.searchPage();
  }

  async openTransferHangDialog(hangHoa: any) {
    const dialogRef = this.dialog.open(TransferHangDialogComponent, {
      data: hangHoa,
      width: '600px',
    });
  }
}

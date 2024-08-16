import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {Observable, Subject} from "rxjs";
import {TransferHangDialogComponent} from "../transfer-hang-dialog/transfer-hang-dialog.component";

@Component({
  selector: 'app-transfer-hang-can-han-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './transfer-hang-can-han-list.component.html',
  styleUrl: './transfer-hang-can-han-list.component.css'
})
export class TransferHangCanHanListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng cận hạn";
  listData: any = [];
  listThuocType: any[] = [
    {name: '--Tất cả--', value: 0},
    {name: 'Theo nhóm', value: 1},
    {name: 'Theo tên', value: 2},
  ];
  listNhomThuoc$ = new Observable<any[]>;
  listThuoc$ = new Observable<any[]>;
  searchNhomThuocTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  displayedColumns = ['#', 'soPhieuNhap', 'ngayNhap', 'maThuoc', 'tenThuoc', 'donVi', 'soLuongTon', 'soNgayKhongGiaoDich', 'soLo', 'hanSuDung', 'soDangKy', 'action' ];

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
      thuocId: [null]
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

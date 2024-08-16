import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {MemberDeleteDialogComponent} from "../../member/member-delete-dialog/member-delete-dialog.component";
import {LookUpNguonHangDialogComponent} from "../look-up-nguon-hang-dialog/look-up-nguon-hang-dialog.component";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-look-up-hang-hoa-lien-minh-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-hang-hoa-lien-minh-list.component.html',
  styleUrl: './look-up-hang-hoa-lien-minh-list.component.css'
})
export class LookUpHangHoaLienMinhListComponent   extends BaseComponent implements OnInit {
  title = "Danh sách hàng hoá Liên Minh";
  listData: any = [];
  listNhomThuoc: any = [];
  listNhomDuocLy: any = [];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  collapseColumns = ['thongTinChung', 'phoGiaBan', 'phoGiaNhap', 'doanhThu', 'action1'];
  displayedColumns = ['#', 'tenThuoc', 'hamLuong', 'hoatChat', 'nhomThuoc', 'nhomDuocLy', 'donVi', 'phoGiaBanThapNhat', 'phoGiaBanCaoNhat', 'phoGiaNhapThapNhat', 'phoGiaNhapCaoNhat', 'doanhThuThiTruong', 'doanhThuCoSo', 'action2' ];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: NhaThuocsService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      thuocIds: [null],
      hamLuong: [''],
      hoatChat: [''],
      nhomThuoc: [null],
      nhomDuocLy: [null],
      hangBanKem: [''],
      hangThayThe: ['']
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    // await this.searchPage();
  }

  async openNguonHangDialog(nguonHang: any) {
    const dialogRef = this.dialog.open(LookUpNguonHangDialogComponent, {
      data: nguonHang,
      width: '600px',
    });
  }
}

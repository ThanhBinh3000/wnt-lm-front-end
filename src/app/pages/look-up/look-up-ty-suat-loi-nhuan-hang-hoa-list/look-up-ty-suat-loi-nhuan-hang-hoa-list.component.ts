import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {topTyXuatLoiNhuanService} from "../../../services/transaction/top-ty-xuat-loi-nhuan.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'app-look-up-ty-suat-loi-nhuan-hang-hoa-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.html',
  styleUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.css'
})
export class LookUpTySuatLoiNhuanHangHoaListComponent extends BaseComponent implements OnInit {
  title!: string
  listNhomThuoc: any = [];
  listNhomDuocLy: any = [];
  listHoatChat: any = [];
  displayedColumns = ['#', 'tenThuoc', 'tenNhomThuoc', 'tenDonVi', 'soLieuThiTruong', 'soLieuCoSo'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: topTyXuatLoiNhuanService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      pageSize: [50],
      nganhHangId: [],
      nhomDuocLyId: [],
      hoatChatId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);

    await this.searchTopTyXuatLoiNhuan();
  }



  async searchTopTyXuatLoiNhuan() {
    await this.updateTitle();
    try {
      const body = this.formData.value
      const res = await this._service.searchTopTyXuatLoiNhuan(body);
      this.dataTable = res?.status === STATUS_API.SUCCESS ? res.data.slice(0, body.pageSize) : [];
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
    await this.updateTitle()
  }

  async updateTitle() {
    this.title = `Top ${this.formData.value.pageSize} hàng hoá có tỷ suất lợi nhuận cao nhất`;
  }
}

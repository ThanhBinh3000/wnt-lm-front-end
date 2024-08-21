import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {topDoanhThuService} from "../../../services/transaction/top-doanh-thu.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'app-look-up-doanh-thu-hang-hoa-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-doanh-thu-hang-hoa-list.component.html',
  styleUrl: './look-up-doanh-thu-hang-hoa-list.component.css'
})
export class LookUpDoanhThuHangHoaListComponent extends BaseComponent implements OnInit {
  title!: string
  listNganhHang: any = [];
  listNhomDuocLy: any = [];
  listHoatChat: any = [];
  displayedColumns = ['#', 'tenThuoc', 'tenNhomThuoc', 'tenDonVi', 'soLieuThiTruong', 'soLieuCoSo'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: topDoanhThuService,
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
    this.titleService.setTitle('Top doanh thu');
    await this.searchTopDoanhThu();
  }

  async searchTopDoanhThu() {
    await this.updateTitle();
    try {
      const body = this.formData.value;
      const res = await this._service.searchTopDoanhThu(body);
      this.dataTable = res?.status === STATUS_API.SUCCESS ? res.data.slice(0, body.pageSize) : [];
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }

  async updateTitle() {
    this.title = `Top ${this.formData.value.pageSize} hàng hoá có doanh thu cao nhất`;
  }
}

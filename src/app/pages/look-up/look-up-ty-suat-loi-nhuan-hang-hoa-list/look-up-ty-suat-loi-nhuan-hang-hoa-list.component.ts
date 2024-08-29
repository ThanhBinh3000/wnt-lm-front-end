import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {topTyXuatLoiNhuanService} from "../../../services/transaction/top-ty-xuat-loi-nhuan.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {ThuocService} from "../../../services/categories/thuoc.service";

@Component({
  selector: 'app-look-up-ty-suat-loi-nhuan-hang-hoa-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.html',
  styleUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.css'
})
export class LookUpTySuatLoiNhuanHangHoaListComponent extends BaseComponent implements OnInit {
  title!: string
  listNhomNganhHang: any = [];
  listNhomDuocLy: any = [];
  listNhomHoatChat: any = [];
  displayedColumns = ['#', 'tenThuoc', 'tenNhomNganhHang', 'tenDonVi', 'soLieuThiTruong', 'soLieuCoSo'];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: topTyXuatLoiNhuanService,
    private thuocService: ThuocService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      pageSize: [50],
      nhomNganhHangId: [],
      nhomDuocLyId: [],
      nhomHoatChatId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle('Tỉ xuất lợi nhuận');
    await this.getDataFilter();
    await this.searchTopTyXuatLoiNhuan();
  }

  async getDataFilter() {
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



  async searchTopTyXuatLoiNhuan() {
    try {
      const body = this.formData.value
      const res = await this._service.searchTopListTyXuatLoiNhuan(body);
      this.dataTable = res?.status === STATUS_API.SUCCESS ? res.data.slice(0, body.pageSize) : [];
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.updateTitle();
    }
  }

  async updateTitle() {
    this.title = `Top ${this.formData.value.pageSize} hàng hoá có tỷ suất lợi nhuận cao nhất`;
  }
}

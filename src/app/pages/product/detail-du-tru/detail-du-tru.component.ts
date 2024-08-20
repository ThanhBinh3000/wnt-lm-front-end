import { Component, Injector, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { DuTruHangService } from '../../../services/dutruhang/du-tru-hang.service';
import { ComponentsModule } from "../../../component/base/components.module";
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-detail-du-tru',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './detail-du-tru.component.html',
  styleUrl: './detail-du-tru.component.css'
})
export class DetailDuTruComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu dự trù";
  displayedColumns = ['#', 'maThuoc', 'tenThuoc', 'duTru', 'donViDuTru', 'donGia', 'thanhTien'];
  data: any = {};
  permittedFields: any = {
    drug_ViewInputPrice: true
  };

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: DuTruHangService,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl){
      let res = await this._service.getDetail(this.idUrl);
      if (res?.status == STATUS_API.SUCCESS) {
        this.data = res.data;
        this.dataTable = res.data.chiTiets;
      }
    }
  }
}

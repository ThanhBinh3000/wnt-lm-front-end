import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup} from "@angular/forms";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {MatSort} from "@angular/material/sort";
import {ComponentsModule} from "../../../../component/base/components.module";
import { STATUS_API } from '../../../../constants/message';
import { DuTruHangService } from '../../../../services/dutruhang/du-tru-hang.service';

@Component({
  selector: 'app-look-up-du-tru-hang-goi-y-chua-kinh-doanh-table',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-du-tru-hang-goi-y-chua-kinh-doanh-table.component.html',
  styleUrl: './look-up-du-tru-hang-goi-y-chua-kinh-doanh-table.component.css'
})
export class LookUpDuTruHangGoiYChuaKinhDoanhTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['#', 'tenThuoc', 'tenNhomThuoc', 'tenDonViTinh', 'deXuatDuTru'];

  constructor(
    injector: Injector,
    private _service : DuTruHangService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    let res = await this._service.searchListTopHangBanChay({});
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        console.log(res);
        this.dataTable = data;
        this.dataTable.forEach(x=>{
          x.isHangBanChay = true;
        });
      } 
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }
}


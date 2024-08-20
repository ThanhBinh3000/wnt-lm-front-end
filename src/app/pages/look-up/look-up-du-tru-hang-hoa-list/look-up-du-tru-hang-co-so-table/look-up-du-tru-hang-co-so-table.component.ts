import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup} from "@angular/forms";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {ComponentsModule} from "../../../../component/base/components.module";
import { DuTruHangService } from '../../../../services/dutruhang/du-tru-hang.service';
import { STATUS_API } from '../../../../constants/message';

@Component({
  selector: 'app-look-up-du-tru-hang-co-so-table',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-du-tru-hang-co-so-table.component.html',
  styleUrl: './look-up-du-tru-hang-co-so-table.component.css'
})
export class LookUpDuTruHangCoSoTableComponent extends BaseComponent implements OnInit, AfterViewInit {
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
    let res = await this._service.searchListHangDuTru({});
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        console.log(res);
        this.dataTable = data;
        // this.totalRecord = data.totalElements;
        // this.totalPages = data.totalPages;
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


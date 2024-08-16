import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup} from "@angular/forms";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {MatSort} from "@angular/material/sort";
import {ComponentsModule} from "../../../../component/base/components.module";

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
  displayedColumns = ['#', 'thuoc', 'nhomThuoc', 'donVi', 'deXuatDuTru'];

  constructor(
    injector: Injector,
    private _service : ThuocService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      // this.formData = this.fb.group({
      //   ...newValue,
      //   idCus: newValue.idPatient,
      // });
      // this.formData.removeControl('fromDateNote');
      // this.formData.removeControl('toDateNote');
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }
}


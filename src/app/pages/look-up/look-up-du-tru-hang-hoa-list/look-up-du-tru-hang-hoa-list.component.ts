import { Component, EventEmitter, Injector, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from "../../../component/base/base.component";
import { Observable, Subject } from "rxjs";
import { TitleService } from "../../../services/title.service";
import { NhaThuocsService } from "../../../services/system/nha-thuocs.service";
import { TransferHangDialogComponent } from "../../transfer/transfer-hang-dialog/transfer-hang-dialog.component";
import { AsyncPipe, NgIf } from "@angular/common";
import { ComponentsModule } from "../../../component/base/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from "@ng-select/ng-select";
import { LOAI_HANG_DU_TRU } from "../../../constants/config";
import {
  LookUpDuTruHangCoSoTableComponent
} from "./look-up-du-tru-hang-co-so-table/look-up-du-tru-hang-co-so-table.component";
import {
  LookUpDuTruHangGoiYChuaKinhDoanhTableComponent
} from "./look-up-du-tru-hang-goi-y-chua-kinh-doanh-table/look-up-du-tru-hang-goi-y-chua-kinh-doanh-table.component";

@Component({
  selector: 'app-look-up-du-tru-hang-hoa-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ComponentsModule,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgIf,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    ReactiveFormsModule,
    LookUpDuTruHangCoSoTableComponent,
    LookUpDuTruHangGoiYChuaKinhDoanhTableComponent
  ],
  templateUrl: './look-up-du-tru-hang-hoa-list.component.html',
  styleUrl: './look-up-du-tru-hang-hoa-list.component.css'
})
export class LookUpDuTruHangHoaListComponent extends BaseComponent implements OnInit {
  title = "Danh sách hàng dự trù";
  listData: any = [];
  listThuocType: any[] = [
    { name: '--Tất cả--', value: 0 },
    { name: 'Theo nhóm', value: 1 },
    { name: 'Theo tên', value: 2 },
  ];
  listNhomThuoc$ = new Observable<any[]>;
  listThuoc$ = new Observable<any[]>;
  searchNhomThuocTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  formDataChange = new EventEmitter();
  @ViewChild(LookUpDuTruHangCoSoTableComponent) lookUpDuTruHangCoSoTableComponent?: LookUpDuTruHangCoSoTableComponent;
  @ViewChild(LookUpDuTruHangGoiYChuaKinhDoanhTableComponent) lookUpDuTruHangGoiYChuaKinhDoanhTableComponent?: LookUpDuTruHangGoiYChuaKinhDoanhTableComponent;

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
      loaiHangDuTru: [0]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    // await this.searchPage();
  }

  //lưu vào storage
  lapPhieuDuTru() {
    if(this.lookUpDuTruHangCoSoTableComponent?.dataTable){
      this.dataTable.push(...this.lookUpDuTruHangCoSoTableComponent?.dataTable);
    }
    if(this.lookUpDuTruHangGoiYChuaKinhDoanhTableComponent?.dataTable){
      this.dataTable.push(...this.lookUpDuTruHangGoiYChuaKinhDoanhTableComponent?.dataTable);
    }
    if (this.dataTable.length > 0) {
      this.storageService.set("thuocCanDuTru", this.dataTable);
    }
    this.router.navigate(['/product/du-tru']);
  }

  getLoaiHangDuTru() {
    return this.formData.get('loaiHangDuTru')?.value;
  }

  setLoaiHangDuTru(loaiHangDuTru: any) {
    this.formData.get('loaiHangDuTru')?.setValue(loaiHangDuTru);
  }

  protected readonly LOAI_HANG_DU_TRU = LOAI_HANG_DU_TRU;
}


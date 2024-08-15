import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {LichSuCapNhatThanhVienService} from "../../../services/system/lich-su-cap-nhat-thanh-vien.service";
import {STATUS_API} from "../../../constants/message";
import {ComponentsModule} from "../../../component/base/components.module";

@Component({
  selector: 'app-member-history-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-history-dialog.component.html',
  styleUrl: './member-history-dialog.component.css'
})
export class MemberHistoryDialogComponent extends BaseComponent implements OnInit {
  listHistory: any = [];

  constructor(
    injector: Injector,
    private _service: LichSuCapNhatThanhVienService,
    private dialogRef: MatDialogRef<MemberHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public thanhVien: any) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.thanhVien) {
      let body = {
        maThanhVien : this.thanhVien.maNhaThuoc,
      };
      const res = await this._service.searchList(body);
      if (res?.status == STATUS_API.SUCCESS) {
        this.listHistory = res.data;
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}

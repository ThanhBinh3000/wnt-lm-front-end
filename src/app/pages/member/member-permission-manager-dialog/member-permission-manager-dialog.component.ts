import {Component, computed, Inject, Injector, OnInit, signal} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComponentsModule} from "../../../component/base/components.module";
import {PrivilegeService} from "../../../services/system/privilege.service";
import {STATUS_API} from "../../../constants/message";

@Component({
  selector: 'app-member-permission-manager-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-permission-manager-dialog.component.html',
  styleUrl: './member-permission-manager-dialog.component.css'
})
export class MemberPermissionManagerDialogComponent extends BaseComponent implements OnInit {
  listPrivilege: any = [];

  constructor(
    injector: Injector,
    private _service: PrivilegeService,
    private dialogRef: MatDialogRef<MemberPermissionManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public thanhVien: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.thanhVien.maNhaThuoc],
    });
  }

  async ngOnInit() {
    await this.getListPrivilege();
  }

  async getListPrivilege() {
    this._service.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPrivilege = res.data;
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}

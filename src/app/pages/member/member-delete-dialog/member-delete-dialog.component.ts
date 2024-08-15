import {Component, Inject, Injector} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MESSAGE} from "../../../constants/message";

@Component({
  selector: 'app-member-delete-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-delete-dialog.component.html',
  styleUrl: './member-delete-dialog.component.css'
})
export class MemberDeleteDialogComponent extends BaseComponent{

  constructor(
    injector: Injector,
    private _service: NhaThuocsService,
    private dialogRef: MatDialogRef<MemberDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public thanhVien: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.thanhVien.maNhaThuoc],
      description: [null],
    });
  }

  override delete(message: string, item: any) {
    this._service.deleteByMaNhaThuoc(this.formData.value).then(async (res) => {
      if (res && res?.data) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
        this.dialogRef.close(res?.data);
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}

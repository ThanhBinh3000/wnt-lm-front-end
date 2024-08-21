import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {ComponentsModule} from "../../../component/base/components.module";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-member-add-edit-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-detail-dialog.component.html',
  styleUrl: './member-detail-dialog.component.css'
})
export class MemberDetailDialogComponent extends BaseComponent implements OnInit {
  info: any = {};

  constructor(
    injector: Injector,
    private _service: NhaThuocsService,
    private dialogRef: MatDialogRef<MemberDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public maCoSo: any) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.maCoSo) {
      const data = this._service.detailByMaNhaThuoc( {maNhaThuoc : this.maCoSo }).then(res=>{
        if (res?.status == STATUS_API.SUCCESS) {
          this.info = res.data;
          console.log(this.info);
        }
      });
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}

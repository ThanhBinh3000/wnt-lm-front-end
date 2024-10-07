import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {ComponentsModule} from "../../../component/base/components.module";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-member-choose-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-choose-dialog.component.html',
  styleUrl: './member-choose-dialog.component.css'
})
export class MemberChooseDialogComponent extends BaseComponent implements OnInit {
  nhaThuoc : any = {};
  constructor(
    injector: Injector,
    private _service: NhaThuocsService,
    private dialogRef: MatDialogRef<MemberChooseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public maNhaCha: any) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.maNhaCha) {
      const data = this._service.dsByMaNhaThuocCha( {maNhaCha : this.maNhaCha }).then(res=>{
        if (res?.status == STATUS_API.SUCCESS) {
          this.dataTable = res.data;
        }
      });
    }
  }

  async chooseNhaThuoc() {
    if (this.nhaThuoc) {
      let res = await this.authService.chooseNhaThuoc({maCoSo: this.nhaThuoc.maNhaThuoc});
      if (res && res.status == 0) {
        this.authService.saveUser(res.data);
        this.router.navigate(['']).then(async r => {});
        this.dialogRef.close();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, 'Chưa chọn cơ sở.');
    }
  }

  chooseRow(data: any) {
    this.nhaThuoc = data;
    data.Active = true;
  }

  closeModal() {
    this.dialogRef.close();
  }
}

import {Component, Inject, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {NgForOf} from "@angular/common";
import {BaseComponent} from "../../../component/base/base.component";
import {LichSuCapNhatThanhVienService} from "../../../services/system/lich-su-cap-nhat-thanh-vien.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {STATUS_API} from "../../../constants/message";

@Component({
  selector: 'app-look-up-nguon-hang-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-nguon-hang-dialog.component.html',
  styleUrl: './look-up-nguon-hang-dialog.component.css'
})
export class LookUpNguonHangDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: LichSuCapNhatThanhVienService,
    private dialogRef: MatDialogRef<LookUpNguonHangDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public nguonHang: any) {
    super(injector, _service);
  }

  async ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }
}

import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {LichSuCapNhatThanhVienService} from "../../../services/system/lich-su-cap-nhat-thanh-vien.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-transfer-hang-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './transfer-hang-dialog.component.html',
  styleUrl: './transfer-hang-dialog.component.css'
})
export class TransferHangDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: LichSuCapNhatThanhVienService,
    private dialogRef: MatDialogRef<TransferHangDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public hangHoa: any) {
    super(injector, _service);
    this.formData = this.fb.group({
    });
  }

  async ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }
}

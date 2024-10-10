import {Component, EventEmitter, Inject, Injector, OnInit, Output} from '@angular/core';
import {CommunityRoomRegistrationService} from "../../../../services/utilities/community-room-registration.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../../component/base/base.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-register-community-training-room-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register-community-training-room-dialog.component.html',
  styleUrl: './register-community-training-room-dialog.component.css'
})
export class RegisterCommunityTrainingRoomDialogComponent extends BaseComponent implements OnInit {
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: CommunityRoomRegistrationService,
    private dialogRef: MatDialogRef<RegisterCommunityTrainingRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      roomId: [],
      storeName: [''],
      name: [''],
      phone: [''],
    });
  }

  registrationSuccess: boolean = false;

  ngOnInit(): void {
    const dataAuthService = this.authService.getUser();
    this.formData.patchValue({
      storeName: dataAuthService?.tenNhaThuoc,
      name: dataAuthService?.fullName,
      phone: dataAuthService?.soDienThoai,
      roomId: this.data.id
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  async onSaveCommunityTrainingRoomRegistration() {
    try {
      const {name, phone, storeName} = this.formData.value;
      var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const validations = [
        {valid: !name || !phone || !storeName, message: 'Hãy nhập đầy đủ thông tin!'},
        {valid: !phone?.match(phoneRegex), message: 'Số điện thoại không hợp lệ!'}
      ];
      const error = validations.find(v => v.valid);
      if (error) {
        this.notification.error(MESSAGE.ERROR, error.message);
        return;
      }
      const body = {
        ...this.formData.value,
      };
      await this.save(body)
      this.registrationSuccess = true
      this.requestSearchPage.emit();
    } catch (err) {
      this.notification.error(MESSAGE.ERROR, 'Đã xảy ra lỗi trong quá trình xử lý!');
      console.error('Error:', err);
    }
  }
}

import {Component, Inject, Injector, OnInit} from '@angular/core';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {FormGroup, Validators} from "@angular/forms";
import {passwordValidator} from "../../../validators/password.validator";
import {phoneNumberValidator} from "../../../validators/phone-number.validator";
import {ComponentsModule} from "../../../component/base/components.module";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {EntityService} from "../../../services/system/entity.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-member-add-edit-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-add-edit-dialog.component.html',
  styleUrl: './member-add-edit-dialog.component.css'
})
export class MemberAddEditDialogComponent extends BaseComponent implements OnInit {
  listEntity: any = [];

  constructor(
    injector: Injector,
    private _service: NhaThuocsService,
    private entityService: EntityService,
    private dialogRef: MatDialogRef<MemberAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public thanhVien: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      userName: ['', this.isCreateView() ? Validators.required : null],
      password: ['', this.isCreateView() ? Validators.required : null, this.isCreateView() ? passwordValidator : null],
      confirmPassword: ['', this.isCreateView() ? Validators.required : null],
      maNhaThuoc: [''],
      tenNhaThuoc: ['', Validators.required],
      entityId: [null, Validators.required],
      dienThoai: ['', this.isCreateView() ? Validators.required : null],
      diaChi: ['', Validators.required],
      email: ['', Validators.email],
      description: [null],
      cityId: [0],
      regionId: [0],
      wardId: [0],
      hoatDong: [true],
      isConnectivity: [false]
    }, {validators: thanhVien ? null : this.passwordMatchValidator});
  }

  passwordMatchValidator(fg: FormGroup) {
    const newPassword = fg.get('password')?.value ?? '';
    const confirmPassword = fg.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : {mismatchPassword: true};
  }

  async ngOnInit() {
    await this.getListEntity();
    if (this.thanhVien) {
      const data = await this.detail(this.thanhVien.id);
      if (data) {
        this.thanhVien = Object.assign({}, this.thanhVien, data);
        this.formData.patchValue(this.thanhVien);
      }
    }
  }

  async getListEntity() {
    this.entityService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listEntity = res.data;
      }
    });
  }

  isCreateView() {
    return !this.thanhVien;
  }

  isUpdateView() {
    return this.thanhVien;
  }

  override async save() {
    let body = this.formData.value;
    let res;
    if (body.id && body.id > 0) {
      res = await this._service.update(body);
    } else {
      res = await this._service.create(body);
    }
    if (res?.status == STATUS_API.SUCCESS) {
      if (body.id && body.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    }
    if (res?.data) {
      this.dialogRef.close(res?.data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}

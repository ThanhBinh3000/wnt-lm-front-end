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
import {ThongTinKhuVucService} from "../../../services/categories/thong-tin-khu-vuc.service";

@Component({
  selector: 'app-member-add-edit-dialog',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-add-edit-dialog.component.html',
  styleUrl: './member-add-edit-dialog.component.css'
})
export class MemberAddEditDialogComponent extends BaseComponent implements OnInit {
  listEntity: any = [];
  listTinhThanh: any = [];
  listQuanHuyen: any = [];
  listPhuongXa: any = [];

  constructor(
    injector: Injector,
    private _service: NhaThuocsService,
    private entityService: EntityService,
    private thongTinKhuVucService: ThongTinKhuVucService,
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
      cityId: [null, Validators.required],
      regionId: [null, Validators.required],
      wardId: [null, Validators.required],
      email: ['', Validators.email],
      description: [null],
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
    if (this.thanhVien) {
      const data = await this.detail(this.thanhVien.id);
      if (data) {
        this.thanhVien = Object.assign({}, this.thanhVien, data);
        this.formData.patchValue(this.thanhVien);
      }
    }
    await this.getListTinhThanh();
    await this.getListQuanHuyen(this.formData.get('regionId')?.value);
    await this.getListPhuongXa(this.formData.get('cityId')?.value);
    await this.getListEntity();
  }

  async getListEntity() {
    this.entityService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listEntity = res.data;
      }
    });
  }

  async getListTinhThanh() {
    this.thongTinKhuVucService.searchListTinhThanh({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
  }

  async getListQuanHuyen(tinhThanhId: any) {
    if (tinhThanhId) {
      let body: any = {
        regionId: tinhThanhId
      }
      this.thongTinKhuVucService.searchListQuanHuyen(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listQuanHuyen = res.data;
        }
      });
    }
  }

  async getListPhuongXa(quanHuyenId: any) {
    if (quanHuyenId) {
      let body: any = {
        cityId: quanHuyenId
      }
      this.thongTinKhuVucService.searchListPhuongXa(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listPhuongXa = res.data;
        }
      });
    }
  }

  async changeTinhThanh($event: any) {
    this.formData.patchValue({cityId: null, wardId: null});
    if($event) await this.getListQuanHuyen($event.id);
  }

  async changeQuanHuyen($event: any) {
    this.formData.patchValue({wardId: null});
    if($event) await this.getListPhuongXa($event.id);
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

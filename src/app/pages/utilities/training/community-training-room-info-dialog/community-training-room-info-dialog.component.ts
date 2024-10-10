import {Component, EventEmitter, Inject, Injector, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommonModule, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {ECommunityRoomStatus} from "../../../../constants/ECommunityRoomStatus";
import {CommunityRoomCommentService} from "../../../../services/utilities/community-room-comment.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ThongTinKhuVucService} from "../../../../services/categories/thong-tin-khu-vuc.service";
import {NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {NgOptionHighlightDirective} from "@ng-select/ng-option-highlight";
import {CommunityRoomRegistrationService} from "../../../../services/utilities/community-room-registration.service";
import {
  RegisterCommunityTrainingRoomDialogComponent
} from "../register-community-training-room-dialog/register-community-training-room-dialog.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";

@Component({
  selector: 'app-community-training-room-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    NgStyle,
    NgForOf,
    NgClass,
    FormsModule,
    NgOptionTemplateDirective,
    NgSelectComponent,
    ReactiveFormsModule,
    NgOptionHighlightDirective,
    CKEditorModule
  ],
  templateUrl: './community-training-room-info-dialog.component.html',
  styleUrl: './community-training-room-info-dialog.component.css'
})
export class CommunityTrainingRoomInfoDialogComponent extends BaseComponent implements OnInit {
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: CommunityRoomCommentService,
    private thongTinKhuVucService: ThongTinKhuVucService,
    private communityRoomRegistrationService: CommunityRoomRegistrationService,
    private dialogRef: MatDialogRef<CommunityTrainingRoomInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      roomId: [],
      comment: [''],
      name: [''],
      phone: [''],
      storeCode: [''],
      storeName: [''],
      provinceId: ['']
    });
  }

  ECommunityRoomStatus = ECommunityRoomStatus;
  listTinhThanh: any[] = [];
  dataCommunityRoomRegistration: any[] = [];
  totalRecordRoomRegistration: number = 0;

  async ngOnInit() {
    this.pageSize = 3
    this.formData.patchValue({
      roomId: this.data.id
    });
    await this.searchPage();
    await this.searchPageCommunityRoomRegistration;
    await this.getDataFake();
    await this.getListTinhThanh();
  }

  isAdmin(){
    return this.authService.getUser().isAdmin;
  }

  async seeMoreComment() {
    this.pageSize += 3;
    await this.searchPage();
  }

  async getDataFake() {
    const dataAuthService = this.authService.getUser();
    this.formData.patchValue({
      name: dataAuthService?.fullName,
      phone: dataAuthService?.soDienThoai,
      storeCode: dataAuthService?.maCoSo,
      storeName: dataAuthService?.tenNhaThuoc,
    })
  }


  async getListTinhThanh() {
    this.thongTinKhuVucService.searchListTinhThanh({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
  }

  async saveComment() {
    try {
      const {comment, name, phone, provinceId, storeName} = this.formData.value;
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const validations = [
        {valid: !comment?.trim(), message: 'Bình luận không được bỏ trống!'},
        {valid: !name || !phone || provinceId <= 0 || !storeName, message: 'Hãy nhập đầy đủ thông tin!'},
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
      this.formData.patchValue({comment: null})
      await this.searchPage();
    } catch (err) {
      this.notification.error(MESSAGE.ERROR, 'Đã xảy ra lỗi trong quá trình xử lý!');
      console.error('Error:', err);
    }
  }

  async searchPageCommunityRoomRegistration() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.communityRoomRegistrationService.searchPage(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataCommunityRoomRegistration = data.content;
        this.totalRecordRoomRegistration = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataCommunityRoomRegistration = [];
        this.totalRecordRoomRegistration = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }


  getStatusColor(status: number): string {
    switch (status) {
      case ECommunityRoomStatus.IsNotDisplay:
        return '#000000';
      case ECommunityRoomStatus.IsNotStarted:
        return '#fe5e57';
      case ECommunityRoomStatus.IsStarted:
        return '#28c840';
      case ECommunityRoomStatus.IsEnded:
        return '#28c840';
      default:
        return '';
    }
  }

  copyLinkZoom(linkZoom: string) {
    navigator.clipboard.writeText(linkZoom).then(() => {
      this.notification.success(MESSAGE.SUCCESS, 'Đã copy vào clipboard.');
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, 'Không thể copy: ' + err);
    });
  }

  closeModal() {
    this.dialogRef.close();
    this.requestSearchPage.emit();
  }

  async registrationTraining(data?: any) {
    const dialogRef = this.dialog.open(RegisterCommunityTrainingRoomDialogComponent, {
      data: data,
      width: '600px',
    });
    dialogRef.componentInstance.requestSearchPage.subscribe(() => {
      this.searchPage();
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}

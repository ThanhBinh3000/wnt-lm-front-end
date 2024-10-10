import {Component, Injector, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {CommunityRoomTrainingService} from "../../../services/utilities/community-room-training.service";
import {
  AddOrUpdateCommunityTrainingRoomDialogComponent
} from "./add-or-update-community-training-room-dialog/add-or-update-community-training-room-dialog.component";
import {
  CommunityTrainingRoomInfoDialogComponent
} from "./community-training-room-info-dialog/community-training-room-info-dialog.component";
import {ECommunityRoomStatus} from "../../../constants/ECommunityRoomStatus";
import {
  RegisterCommunityTrainingRoomDialogComponent
} from "./register-community-training-room-dialog/register-community-training-room-dialog.component";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {
  ParticipationListingDialogComponent
} from "./participation-listing-dialog/participation-listing-dialog.component";
import {UploadImageComponent} from "../../../component/upload-image/upload-image.component";
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: CommunityRoomTrainingService,
    private clipboard: Clipboard,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      title: [''],
    });
  }

  title = "Đào tạo";
  dropdownDisplay: number | null = null;
  ECommunityRoomStatus = ECommunityRoomStatus;

  async ngOnInit() {
    this.pageSize = 3
    this.titleService.setTitle(this.title);
    await this.searchPage()
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

  onMouseEnter(recordId: number): void {
    this.dropdownDisplay = recordId;
  }

  onMouseLeave(): void {
    this.dropdownDisplay = null;
  }

  onUploadImageDialog(data?: any) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '50%',
      height: '300px'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        let body = {
          dataId: data.id,
          dataType: 'communityRoom '
        }
        this._service.uploadImage(result[0], body).then((res) => {
          if (res) {
            this.searchPage();
          }
        })
      }
    });
  }

  async showAddOrUpdateCommunityRoomDialog(data?: any) {
    const dialogRef = this.dialog.open(AddOrUpdateCommunityTrainingRoomDialogComponent, {
      data: data,
      width: '2000px',
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

  async onClickItem(data?: any) {
    const { status, linkZoom, linkRecord } = data;
    // Kiểm tra trạng thái không hiển thị hoặc chưa bắt đầu
    if (status === ECommunityRoomStatus.IsNotDisplay || status === ECommunityRoomStatus.IsNotStarted) {
      await this.onShowDialogInfo(data);
      return;
    }
    // Kiểm tra trạng thái đã bắt đầu
    if (status === ECommunityRoomStatus.IsStarted) {
      if (linkZoom) {
        window.open(linkZoom, '_blank');
      } else {
        await this.onShowDialogInfo(data);
      }
      return;
    }
    // Kiểm tra trạng thái đã kết thúc
    if (status === ECommunityRoomStatus.IsEnded) {
      if (linkRecord) {
        window.open(linkRecord, '_blank');
      } else {
        await this.onShowDialogInfo(data);
      }
      return;
    }
  }


  async onShowDialogInfo(data?: any) {
    const dialogRef = this.dialog.open(CommunityTrainingRoomInfoDialogComponent, {
      data: data,
      width: '2000px',
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

  participationListing(data?: any) {
    const dialogRef = this.dialog.open(ParticipationListingDialogComponent, {
      data: data,
      width: '2000px',
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

  async displayCommunityTrainingRoom(isCheckStatus: boolean, data?: any) {
    const action = isCheckStatus ? 'hiển thị' : 'ẩn';
    const message = `Bạn chắc chắn muốn ${action} buổi đào tạo ${data.title} ?`;
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      cancelText: 'Đóng',
      okText: 'Đồng ý',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          if (isCheckStatus) {
            data.status = ECommunityRoomStatus.IsNotStarted;
          } else {
            data.status = ECommunityRoomStatus.IsNotDisplay;
          }
          const res = await this._service.updateStatus(data);
          const successMessage = `${action} buổi đào tạo ${data.title} thành công.`;
          const errorMessage = `${action} thất bại !`;
          if (res?.status === STATUS_API.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, successMessage);
            await this.searchPage();
          } else {
            this.notification.error(MESSAGE.ERROR, errorMessage);
          }
        } catch {
          this.notification.error(MESSAGE.ERROR, 'Đã xảy ra lỗi !');
        }
      }
    });
  }

  copyLinkRegistration() {
    const url = window.location.origin + '/app-community-training-room-info-dialog';
    this.clipboard.copy(url);
    this.notification.success(MESSAGE.SUCCESS, 'Đã copy vào clipboard.');
  }

  copyLinkConfirmParticipation() {
    const url = window.location.origin + '/app-community-training-room-info-dialog';
    this.clipboard.copy(url);
    this.notification.success(MESSAGE.SUCCESS, 'Đã copy vào clipboard.');
  }

  async seeMoreComment() {
    this.pageSize += 6;
    await this.searchPage();
  }
}

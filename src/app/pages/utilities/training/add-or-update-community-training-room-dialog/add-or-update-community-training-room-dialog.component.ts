import {Component, EventEmitter, Inject, Injector, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {CommunityRoomTrainingService} from "../../../../services/utilities/community-room-training.service";
import {CommonModule} from "@angular/common";
import {MESSAGE} from "../../../../constants/message";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";

@Component({
  selector: 'app-add-or-update-community-training-room-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-or-update-community-training-room-dialog.component.html',
  styleUrl: './add-or-update-community-training-room-dialog.component.css'
})
export class AddOrUpdateCommunityTrainingRoomDialogComponent extends BaseComponent implements OnInit {
  @Output() requestSearchPage = new EventEmitter<void>();
  Editor = ClassicEditor;
  constructor(
    injector: Injector,
    private _service: CommunityRoomTrainingService,
    private dialogRef: MatDialogRef<AddOrUpdateCommunityTrainingRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
    });
  }

  ngOnInit() {
    if (!this.data) {
      this.data = {
        id: '',
        title: '',
        startTime: '',
        durationTime: '',
        description: '',
        linkZoom: '',
        linkRecord: '',
        linkDocument: ''
      };
    }
  }

  async saveCommunity(data?: any) {
    if (!data.title || !data.startTime || !data.durationTime) {
      this.notification.error(MESSAGE.ERROR, 'Hãy nhập các trường có dấu sao(*)!');
      return;
    }
    const regexDurationTime = /^[0-23]{1,2}:[0-59]{1,2}$/;
    if (!regexDurationTime.test(data.durationTime)) {
      this.notification.error(MESSAGE.ERROR, 'Hãy nhập trường thời lượng theo đúng format hh:mm!');
      return;
    }
    await this.save(data);
    this.closeModal();
    this.requestSearchPage.emit();
  }

  closeModal() {
    this.dialogRef.close();
    this.requestSearchPage.emit();
  }
}

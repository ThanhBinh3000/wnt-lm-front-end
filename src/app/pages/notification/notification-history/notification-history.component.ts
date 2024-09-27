import {Component, Injector, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ComponentsModule} from "../../../component/base/components.module";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {NgIf} from "@angular/common";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {CauHinhHeThongService} from "../../../services/system/cau-hinh-he-thong.service";
import {NotificationHistoryService} from "../../../services/categories/notification-history.service";

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [
    ComponentsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgIf
  ],
  templateUrl: './notification-history.component.html',
  styleUrl: './notification-history.component.css'
})
export class NotificationHistoryComponent extends BaseComponent implements OnInit {
  title = "Lịch sử thông báo";
  displayedColumns = ['#', 'title', 'contents', 'createDate'];
  showError: boolean = false;

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: NotificationHistoryService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({

    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage()
  }
}

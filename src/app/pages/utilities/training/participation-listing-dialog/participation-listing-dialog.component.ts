import {AfterViewInit, Component, EventEmitter, Inject, Injector, OnInit, Output, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {CommunityRoomRegistrationService} from "../../../../services/utilities/community-room-registration.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ECommunityRoomStatus} from "../../../../constants/ECommunityRoomStatus";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow, MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {ComponentsModule} from "../../../../component/base/components.module";

@Component({
  selector: 'app-participation-listing-dialog',
  standalone: true,
  imports: [
    MatSort,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    ComponentsModule,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef
  ],
  templateUrl: './participation-listing-dialog.component.html',
  styleUrl: './participation-listing-dialog.component.css'
})
export class ParticipationListingDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() requestSearchPage = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private _service: CommunityRoomRegistrationService,
    private dialogRef: MatDialogRef<ParticipationListingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      roomId: [],
    });
  }

  totalParticipation: number = 0
  ECommunityRoomStatus = ECommunityRoomStatus
  displayedColumns = [
    'storeName',
    'name',
    'phone',
    'provinceText',
    'created',
  ];

  async ngOnInit() {
    this.formData.patchValue({
      roomId: this.item.id
    })
    await this.searchPage();
    if (this.dataTable) {
      this.totalParticipation = this.dataTable.reduce((prev, cur) => prev + cur.isJoined, 0);
    }
    if (this.item.status === ECommunityRoomStatus.IsStarted) {
      this.displayedColumns.push('isJoined');
      this.displayedColumns.push('ranking');
      this.displayedColumns.push('feedback');
    }
  }

  closeModal() {
    this.dialogRef.close();
    this.requestSearchPage.emit();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }
}

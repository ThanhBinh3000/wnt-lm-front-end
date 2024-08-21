import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {ComponentsModule} from "../../../component/base/components.module";
import {EntityService} from "../../../services/system/entity.service";
import {STATUS_API} from "../../../constants/message";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {MemberAddEditDialogComponent} from "../member-add-edit-dialog/member-add-edit-dialog.component";
import {
  MemberPermissionManagerDialogComponent
} from "../member-permission-manager-dialog/member-permission-manager-dialog.component";
import {MemberDeleteDialogComponent} from "../member-delete-dialog/member-delete-dialog.component";
import {MemberHistoryDialogComponent} from "../member-history-dialog/member-history-dialog.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent extends BaseComponent implements OnInit {
  title = "Quản lý thành viên Liên Minh";
  listEntity: any = [];
  displayedColumns = ['#', 'tenNhaThuoc', 'created', 'email', 'level', 'hoatDong', 'action' ];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: NhaThuocsService,
    private entityService: EntityService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      entityId: [null],
      active : [true]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    await this.getListEntity();
  }

  async getListEntity() {
    this.entityService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listEntity = res.data.filter((x:any)=>x.isDefault == 1);
      }
    });
  }

  async openAddEditDialog(thanhVien: any) {
    const dialogRef = this.dialog.open(MemberAddEditDialogComponent, {
      data: thanhVien,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openPermissionManagerDialog(thanhVien: any) {
    const dialogRef = this.dialog.open(MemberPermissionManagerDialogComponent, {
      data: thanhVien,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openHistoryDialog(thanhVien: any) {
    const dialogRef = this.dialog.open(MemberHistoryDialogComponent, {
      data: thanhVien,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openDeleteDialog(thanhVien: any) {
    const dialogRef = this.dialog.open(MemberDeleteDialogComponent, {
      data: thanhVien,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}

import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {CauHinhHeThongService} from "../../../services/system/cau-hinh-he-thong.service";

@Component({
  selector: 'app-system-list',
  standalone: true,
  imports: [
    ComponentsModule,
  ],
  templateUrl: './system-list.component.html',
  styleUrl: './system-list.component.css'
})
export class SystemListComponent extends BaseComponent implements OnInit {
  title = "Thiết lập thông số chung cho liên minh nhà thuốc";
  displayedColumns = ['#', 'display', 'value', 'ghiChu', 'action'];
  showError: boolean = false;

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: CauHinhHeThongService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({

    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchList()
  }

  async updateParameters(data: any) {
    this.showError = true;
    if (!data.value || !data.ghiChu) {
      return;
    }
    await this.save(data);
    this.showError = false;
  }
}

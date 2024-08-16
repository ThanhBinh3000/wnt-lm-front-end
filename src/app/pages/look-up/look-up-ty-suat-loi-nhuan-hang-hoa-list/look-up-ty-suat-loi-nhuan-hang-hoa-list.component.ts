import {Component, Injector, OnInit} from '@angular/core';
import {ComponentsModule} from "../../../component/base/components.module";
import {BaseComponent} from "../../../component/base/base.component";
import {TitleService} from "../../../services/title.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-look-up-ty-suat-loi-nhuan-hang-hoa-list',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.html',
  styleUrl: './look-up-ty-suat-loi-nhuan-hang-hoa-list.component.css'
})
export class LookUpTySuatLoiNhuanHangHoaListComponent  extends BaseComponent implements OnInit {
  title = "Top 100 hàng hoá có tỷ suất lợi nhuận cao nhất";
  listData: any = [];
  displayedColumns = ['#', 'tenThuoc', 'nhomThuoc', 'donVi', 'tySuatLoiNhuan', 'tySuatLoiNhuanCoSo' ];

  constructor(
    injector: Injector,
    private titleService: TitleService,
    private _service: NhaThuocsService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    // await this.searchPage();
  }
}

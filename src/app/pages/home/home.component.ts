import {Component, ElementRef, Injector, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {TitleService} from "../../services/title.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {BaseComponent} from "../../component/base/base.component";
import {topDoanhThuService} from "../../services/transaction/top-doanh-thu.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  title = 'Trang chủ';

  constructor(
    injector: Injector,
    private _service: AuthService,
    private titleService: TitleService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'overflow-hidden');
    // alert(await this.getQueryParams('s'));
    await this.wntAuthenticate();
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'overflow-hidden');
  }

  async wntAuthenticate() {
    let sessionId = await this.getQueryParams('s');
    if (sessionId) {
      let res = await this.authService.wntAuthenticate(sessionId);
      if (res && res.status == 0) {
        this.authService.saveToken(res.data.token);
        let profile = await this.authService.profile();
        if (profile && profile.status == 0) {
          this.authService.saveUser(profile.data);
          if(profile.data.nhaThuoc){
            this.authService.saveNhaThuoc(profile.data.nhaThuoc);
          }
        }
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([this.router.url]);
        });
      }
    }
  }
}

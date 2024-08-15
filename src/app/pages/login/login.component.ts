import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ComponentsModule} from "../../component/base/components.module";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TitleService} from "../../services/title.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  title = 'ĐĂNG NHẬP';
  public formGroup: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private titleService: TitleService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
    this.authService.logout();
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }

  async login() {
    if (this.formGroup.valid) {
      let res = await this.authService.login(this.formGroup.value);
      if (res && res.status == 0) {
        this.authService.saveToken(res.data.token);
        let profile = await this.authService.profile();
        if (profile && profile.status == 0) {
          this.authService.saveUser(profile.data);
          if(profile.data.nhaThuoc){
            this.authService.saveNhaThuoc(profile.data.nhaThuoc);
          }
        }
        this.router.navigate(['']).then(async r => {});
      }
    }
  }
}

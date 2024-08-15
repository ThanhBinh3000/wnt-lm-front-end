import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {AuthService} from "../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {ComponentsModule} from "../component/base/components.module";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ComponentsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    // if (!this.authService.getNhaThuoc()) {
    //   this.router.navigate(['management/account/choose-nha-thuoc']).then(r => {
    //   });
    // }
  }

  logOut() {
  }
}

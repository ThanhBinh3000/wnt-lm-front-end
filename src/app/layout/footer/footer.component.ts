import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ComponentsModule} from "../../component/base/components.module";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }
}

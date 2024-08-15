import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LayoutComponent} from "./layout/layout.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {NotAuthenticatedComponent} from "./pages/not-authenticated/not-authenticated.component";
import {LoginComponent} from "./pages/login/login.component";
import {MemberListComponent} from "./pages/member/member-list/member-list.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {
        path: 'member',
        children: [
          {path: 'list', component: MemberListComponent},
        ]
      },
    ],
  },
  {path: 'login', component: LoginComponent},
  {path: '401', component: NotAuthenticatedComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '404', pathMatch: 'full'},
];

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from './component/layout/navbar/navbar.component';
import { ToastComponent } from './component/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    ToastComponent,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Bug Tracking';
  showNavbar = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (
        this.router.url === '/home' ||
        this.router.url === '/' ||
        this.router.url === '/#features'
      ) {
        this.showNavbar = true;
        this.showFooter = true;
      } else {
        this.showNavbar = false;
        this.showFooter = false;
      }
    });
  }
}

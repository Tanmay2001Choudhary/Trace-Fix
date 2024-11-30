import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { LogoutComponent } from '../logout/logout.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, LogoutComponent, RouterModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  showModal = false;
  user: any = {};
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('accessToken');
    }
    if (!this.isLoggedIn) {
      this.router.navigate(['/signin']);
    }
  }

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .then((userData) => {
        this.user = userData;
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
      });
  }

  closeModalOnOverlay(event: MouseEvent) {
    this.closeModal();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}

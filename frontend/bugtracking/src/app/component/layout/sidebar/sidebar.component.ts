import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgIf, LogoutComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  showModal = false;
  user!: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}
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

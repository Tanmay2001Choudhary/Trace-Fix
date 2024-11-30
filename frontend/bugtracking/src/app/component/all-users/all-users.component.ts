import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FilterPipe } from '../../filter.pipe';
import { UserService } from '../../services/user.service';
import { LogoutComponent } from '../logout/logout.component';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FilterPipe,
    FontAwesomeModule,
    LogoutComponent,
  ],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AllUsersComponent implements OnInit {
  searchText: string = '';
  users: User[] = [];
  currentUserId!: number;
  faEye = faEye;
  faTrash = faTrash;
  showModal = false;
  selectedUserId!: number;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          this.currentUserId = currentUser.id;
        }
        this.userService.getAllUsers().then((users) => {
          this.users = users.filter(
            (user: User) => user.id !== this.currentUserId
          );
        });
      })
      .catch((err) => {
        console.error('Error fetching current user:', err);
      });
  }
  isHighlighted(user: User): boolean {
    return (
      this.searchText !== '' &&
      (user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  view(id: number) {
    console.log(id)
    // this.selectedUserId = id;
    // this.showModal = true;
  }
  delete(id: number) {
    this.selectedUserId = id;
    this.showModal = true;
  }

  deleteUser(id: number) {
    this.userService
      .deleteUser(id)
      .then(() => {
        this.users = this.users.filter((user: User) => user.id !== id);
        this.closeModal();
      })
      .catch((err) => {
        console.log('Error deleting user:', err);
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
}

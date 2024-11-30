import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, LoaderComponent, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faXmark = faXmark;
  isEditMode = false;

  user!: User;
  firstName: string = '';
  lastName: string = '';
  imageFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .then((userData) => {
        this.user = userData;
        if (this.user && this.user.name) {
          this.splitFullName(this.user.name);
        }
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
      });
  }

  splitFullName(fullName: string) {
    const names = fullName.split(' ');
    this.firstName = names[0];
    this.lastName = names.slice(1).join(' ');
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  handleImageUpload(event: any) {
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.previewImage = null;
    }
  }

  deleteImage() {
    this.user.profileImage = null;
    this.imageFile = null;
  }

  updateProfile() {
    if (this.isEditMode) {
      const formData = new FormData();
      formData.append('name', this.firstName + ' ' + this.lastName);
      formData.append('email', this.user.email);
      formData.append('role', this.user.role);
      if (this.imageFile) {
        formData.append('file', this.imageFile);
      }
      this.userService
        .updateUser(this.user.id, formData)
        .then((updatedUser) => {
          this.user = updatedUser;
          this.previewImage = null;
          this.userService.setCurrentUser(updatedUser);
          this.toggleEditMode();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }
}

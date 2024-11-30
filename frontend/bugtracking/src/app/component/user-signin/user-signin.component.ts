import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import Router and RouterModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgClass,
    RouterModule,
  ],
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.css'],
  providers: [AuthService],
})
export class UserSigninComponent {
  faLock = faLock;
  signUpData = {
    name: '',
    email: '',
    password: '',
    role: '',
  };

  signInData = {
    email: '',
    password: '',
  };
  isSignUpMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  switchToSignUp() {
    this.isSignUpMode = true;
  }

  switchToSignIn() {
    this.isSignUpMode = false;
  }

  signUp() {
    this.authService
      .signUp(this.signUpData)
      .then((response) => {
        console.log('Sign-up Successful:', response);
        this.switchToSignIn();
        this.toastService.show('Sign-up successful! Please Login', 'success');
      })
      .catch((err) => {
        console.error('Sign-up error:', err);
      let errorMessage = 'Sign-up failed. Please try again.';
      
      if (err.message === 'Email already exists. Please try a different email.') {
        errorMessage = 'Email already exists. Please use a different email address.';
      }

      this.toastService.show(errorMessage, 'error');
    });
  }

  signIn() {
    this.authService
      .signIn(this.signInData)
      .then((response) => {
        console.log('Sign-in Successful:', response);
        console.log('Sign-in Successful:', response);
        this.toastService.show('Sign-in successful!', 'success');
        this.router.navigate(['/dashboard/profile']);
      })
      .catch((err) => {
        console.error('Sign-in error:', err);
        this.toastService.show('Sign-in failed. Please try again.', 'error');
      });
  }
}

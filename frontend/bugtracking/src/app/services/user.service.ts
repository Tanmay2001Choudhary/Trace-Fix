import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = `${environment.url}/user`;

  private userSource = new BehaviorSubject<any>(null);
  currentUser = this.userSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setCurrentUser(user: any) {
    this.userSource.next(user);
  }

  async getCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`${this.url}/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching current user:', error);
          throw error;
        }
      } else {
        console.warn('User ID not found in localStorage');
        return Promise.reject('User ID not found');
      }
    } else {
      return Promise.resolve(null);
    }
  }

  async getAllUsers() {
    try {
      const response = await axios.get(`${this.url}/all-users`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching all users', err);
      throw err;
    }
  }
  async getAllDevelopers() {
    try {
      const response = await axios.get(`${this.url}/all-developers`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching all users', err);
      throw err;
    }
  }

  async getUserById(id: number) {
    try {
      const response = await axios.get(`${this.url}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error(`Error fetching user with ID ${id}`, err);
      throw err;
    }
  }
  async updateUser(id: number, formData: FormData) {
    try {
      const response = await axios.put(
        `${this.url}/update-user/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error updating user with ID ${id}`, err);
      throw err;
    }
  }

  async deleteUser(id: number) {
    try {
      await axios.delete(`${this.url}/${id}`, {
        withCredentials: true,
      });
      return console.log(`User with ID ${id} deleted`);
    } catch (err) {
      console.error(`Error deleting user with ID ${id}`, err);
      throw err;
    }
  }

  async getUserTickets(userId: string) {
    try {
      const response = await axios.get(`${this.url}/${userId}/tickets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  }
}

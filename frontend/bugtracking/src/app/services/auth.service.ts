import { Injectable } from '@angular/core';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.url}/auth`;
  private secretKey = environment.secretKey;

  private encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  private decryptToken(encryptedToken: string): string {
    return CryptoJS.AES.decrypt(encryptedToken, this.secretKey).toString(
      CryptoJS.enc.Utf8
    );
  }

  async signUp(signUpData: any) {
    try {
      const response = await axios.post(`${this.url}/signup`, signUpData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        console.log('Sign-up successful:', response.data);
        return response.data;
      }
      throw new Error('Sign-up failed. Please try again.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          throw new Error(
            'Email already exists. Please try a different email.'
          );
        }
      }
      throw err;
    }
  }
  async signIn(signInData: any) {
    console.log(signInData);
    try {
      const response = await axios.post(`${this.url}/signin`, signInData, {
        withCredentials: true,
      });
      const { accessToken, refreshToken } = response.data;
      const encryptedAccessToken = this.encryptToken(accessToken);
      const encryptedRefreshToken = this.encryptToken(refreshToken);
      localStorage.setItem('accessToken', encryptedAccessToken);
      localStorage.setItem('refreshToken', encryptedRefreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const decodedToken: any = jwtDecode(response.data.token);
      localStorage.setItem('userId', decodedToken.userId);
      return response.data;
    } catch (err) {
      console.error('Error during signin', err);
      throw err;
    }
  }

  getAccessToken() {
    const encryptedToken = localStorage.getItem('accessToken');
    if (encryptedToken) {
      return this.decryptToken(encryptedToken);
    }
    return null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  }
}

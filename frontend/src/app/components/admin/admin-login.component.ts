import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="login()">
          <div class="space-y-4">
            <input [(ngModel)]="credentials.email" name="email" type="email" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Email">
            <input [(ngModel)]="credentials.password" name="password" type="password" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Password">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>
        
        <div class="text-center">
          <a routerLink="/register" class="text-blue-600 hover:text-blue-800">Don't have an account? Register here</a>
        </div>
        
        <div *ngIf="error" class="text-red-600 text-center">{{error}}</div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(private http: HttpClient) {}

  login() {
    console.log('Login attempt:', this.credentials.email);
    this.http.post<any>(`${environment.apiUrl}/auth/login`, this.credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        console.log('Token to store:', response.token);
        localStorage.setItem('bearerToken', response.token);
        localStorage.setItem('isAdmin', 'true');
        console.log('Token stored in localStorage:', localStorage.getItem('bearerToken'));
        window.location.reload();
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}
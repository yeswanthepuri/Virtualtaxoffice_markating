import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-register',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="register()">
          <div class="space-y-4">
            <input [(ngModel)]="user.firstName" name="firstName" type="text" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="First Name">
            <input [(ngModel)]="user.lastName" name="lastName" type="text" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Last Name">
            <input [(ngModel)]="user.email" name="email" type="email" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Email">
            <input [(ngModel)]="user.password" name="password" type="password" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Password">
          </div>
          
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Register
          </button>
          
          <div class="text-center">
            <a routerLink="/admin" class="text-blue-600 hover:text-blue-800">Already have an account? Sign in</a>
          </div>
          
          <div *ngIf="message" class="text-center p-2 rounded" 
               [class.bg-green-100]="success" [class.bg-red-100]="!success">
            {{message}}
          </div>
        </form>
      </div>
    </div>
  `
})
export class PublicRegisterComponent {
  user = { email: '', password: '', firstName: '', lastName: '' };
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

  register() {
    this.http.post(`${environment.apiUrl}/auth/register`, this.user).subscribe({
      next: () => { 
        this.message = 'Registration successful! You can now login.'; 
        this.success = true; 
        this.user = { email: '', password: '', firstName: '', lastName: '' }; 
      },
      error: (err) => { 
        this.message = err.error?.message || 'Registration failed'; 
        this.success = false; 
      }
    });
  }
}
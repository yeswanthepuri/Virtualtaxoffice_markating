import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-register',
  template: `
    <div class="p-6">
      <h2 class="text-2xl mb-4">User Registration</h2>
      <form (ngSubmit)="register()" class="space-y-4">
        <input [(ngModel)]="user.email" name="email" type="email" placeholder="Email" class="w-full p-2 border rounded" required>
        <input [(ngModel)]="user.password" name="password" type="password" placeholder="Password" class="w-full p-2 border rounded" required>
        <input [(ngModel)]="user.firstName" name="firstName" placeholder="First Name" class="w-full p-2 border rounded" required>
        <input [(ngModel)]="user.lastName" name="lastName" placeholder="Last Name" class="w-full p-2 border rounded" required>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      <div *ngIf="message" class="mt-4 p-2 rounded" [class.bg-green-100]="success" [class.bg-red-100]="!success">{{message}}</div>
    </div>
  `
})
export class UserRegisterComponent {
  user = { email: '', password: '', firstName: '', lastName: '' };
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

  register() {
    this.http.post(`${environment.apiUrl}/auth/register`, this.user).subscribe({
      next: () => { this.message = 'User registered successfully'; this.success = true; this.user = { email: '', password: '', firstName: '', lastName: '' }; },
      error: (err) => { this.message = err.error?.message || 'Registration failed'; this.success = false; }
    });
  }
}
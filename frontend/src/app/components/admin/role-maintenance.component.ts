import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-role-maintenance',
  template: `
    <div class="p-6">
      <h2 class="text-2xl mb-4">Role Maintenance</h2>
      
      <div class="mb-6">
        <h3 class="text-lg mb-2">Create Role</h3>
        <div class="flex gap-2">
          <input [(ngModel)]="newRole" placeholder="Role Name" class="p-2 border rounded">
          <button (click)="createRole()" class="bg-green-500 text-white px-4 py-2 rounded">Create</button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg mb-2">Assign Roles</h3>
        <div class="flex gap-2 mb-2">
          <select [(ngModel)]="selectedUser" class="p-2 border rounded">
            <option value="">Select User</option>
            <option *ngFor="let user of users" [value]="user.userId">{{user.email}}</option>
          </select>
          <select [(ngModel)]="selectedRole" class="p-2 border rounded">
            <option value="">Select Role</option>
            <option *ngFor="let role of roles" [value]="role.name">{{role.name}}</option>
          </select>
          <button (click)="assignRole()" class="bg-blue-500 text-white px-4 py-2 rounded">Assign</button>
        </div>
      </div>

      <div>
        <h3 class="text-lg mb-2">Users & Roles</h3>
        <div *ngFor="let user of users" class="border p-2 mb-2 rounded">
          <strong>{{user.email}}</strong> - Roles: {{user.roles.join(', ')}}
        </div>
      </div>

      <div *ngIf="message" class="mt-4 p-2 rounded bg-blue-100">{{message}}</div>
    </div>
  `
})
export class RoleMaintenanceComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  newRole = '';
  selectedUser = '';
  selectedRole = '';
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    console.log('Loading users, token in localStorage:', localStorage.getItem('bearerToken'));
    this.http.get<any[]>(`${environment.apiUrl}/role/users`).subscribe({
      next: (data) => {
        console.log('Users loaded successfully:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  loadRoles() {
    this.http.get<any[]>(`${environment.apiUrl}/role`).subscribe(data => this.roles = data);
  }

  createRole() {
    this.http.post(`${environment.apiUrl}/role`, { name: this.newRole }).subscribe({
      next: () => { this.message = 'Role created'; this.newRole = ''; this.loadRoles(); },
      error: (err) => this.message = err.error?.message || 'Error creating role'
    });
  }

  assignRole() {
    this.http.post(`${environment.apiUrl}/role/assign`, { userId: this.selectedUser, roleName: this.selectedRole }).subscribe({
      next: () => { this.message = 'Role assigned'; this.loadUsers(); },
      error: (err) => this.message = err.error?.message || 'Error assigning role'
    });
  }
}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <app-admin-login *ngIf="!isLoggedIn"></app-admin-login>
    
    <div *ngIf="isLoggedIn">
      <app-header></app-header>
      <div class="flex h-screen pt-16">
      <div class="w-64 bg-gray-100 p-4">
        <h1 class="text-xl font-bold mb-6">Admin</h1>
        
        <nav class="space-y-2">
          <a (click)="activeTab = 'register'" 
             [class.text-blue-600]="activeTab === 'register'"
             [class.font-semibold]="activeTab === 'register'"
             class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            User Registration
          </a>
          <a (click)="activeTab = 'roles'" 
             [class.text-blue-600]="activeTab === 'roles'"
             [class.font-semibold]="activeTab === 'roles'"
             class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            Role Maintenance
          </a>
          <a (click)="activeTab = 'policies'" 
             [class.text-blue-600]="activeTab === 'policies'"
             [class.font-semibold]="activeTab === 'policies'"
             class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            Policy Maintenance
          </a>
          <a (click)="activeTab = 'partners'" 
             [class.text-blue-600]="activeTab === 'partners'"
             [class.font-semibold]="activeTab === 'partners'"
             class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            Partner Management
          </a>
          <a (click)="logout()" class="block py-2 px-3 text-red-600 hover:text-red-800 cursor-pointer">
            Logout
          </a>
        </nav>
      </div>

      <div class="flex-1 p-6 overflow-auto">
        <app-user-register *ngIf="activeTab === 'register'"></app-user-register>
        <app-role-maintenance *ngIf="activeTab === 'roles'"></app-role-maintenance>
        <app-policy-maintenance *ngIf="activeTab === 'policies'"></app-policy-maintenance>
        <app-partner-management *ngIf="activeTab === 'partners'"></app-partner-management>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'register';
  isLoggedIn = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('bearerToken');
  }

  logout() {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('isAdmin');
    this.isLoggedIn = false;
  }
}
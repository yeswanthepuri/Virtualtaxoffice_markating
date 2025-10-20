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
          <!-- User Management -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">User Management</h3>
            <a (click)="activeTab = 'register'" 
               [class.text-blue-600]="activeTab === 'register'"
               [class.font-semibold]="activeTab === 'register'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              User Registration
            </a>
          </div>

          <!-- Security -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Security</h3>
            <a (click)="activeTab = 'roles'" 
               [class.text-blue-600]="activeTab === 'roles'"
               [class.font-semibold]="activeTab === 'roles'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Role Maintenance
            </a>
            <a (click)="activeTab = 'policies'" 
               [class.text-blue-600]="activeTab === 'policies'"
               [class.font-semibold]="activeTab === 'policies'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Policy Maintenance
            </a>
            <a (click)="activeTab = 'locations'" 
               [class.text-blue-600]="activeTab === 'locations'"
               [class.font-semibold]="activeTab === 'locations'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Location Maintenance
            </a>
          </div>

          <!-- Content Management -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Content</h3>
            <a (click)="activeTab = 'articles'" 
               [class.text-blue-600]="activeTab === 'articles'"
               [class.font-semibold]="activeTab === 'articles'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Article Management
            </a>
            <a (click)="activeTab = 'resources'" 
               [class.text-blue-600]="activeTab === 'resources'"
               [class.font-semibold]="activeTab === 'resources'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Resource Management
            </a>
          </div>

          <!-- Business -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Business</h3>
            <a (click)="activeTab = 'partners'" 
               [class.text-blue-600]="activeTab === 'partners'"
               [class.font-semibold]="activeTab === 'partners'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Partner Management
            </a>
          </div>

          <!-- System -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">System</h3>
            <a (click)="activeTab = 'cache'" 
               [class.text-blue-600]="activeTab === 'cache'"
               [class.font-semibold]="activeTab === 'cache'"
               class="block py-2 px-3 text-gray-700 hover:text-blue-600 cursor-pointer ml-2">
              Cache Management
            </a>
          </div>

          <a (click)="logout()" class="block py-2 px-3 text-red-600 hover:text-red-800 cursor-pointer mt-6">
            Logout
          </a>
        </nav>
      </div>

      <div class="flex-1 p-6 overflow-auto">
        <app-user-register *ngIf="activeTab === 'register'"></app-user-register>
        <app-role-maintenance *ngIf="activeTab === 'roles'"></app-role-maintenance>
        <app-policy-maintenance *ngIf="activeTab === 'policies'"></app-policy-maintenance>
        <app-partner-management *ngIf="activeTab === 'partners'"></app-partner-management>
        <app-article-management *ngIf="activeTab === 'articles'"></app-article-management>
        <app-resource-management *ngIf="activeTab === 'resources'"></app-resource-management>
        <app-location-maintenance *ngIf="activeTab === 'locations'"></app-location-maintenance>
        <app-cache-management *ngIf="activeTab === 'cache'"></app-cache-management>
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
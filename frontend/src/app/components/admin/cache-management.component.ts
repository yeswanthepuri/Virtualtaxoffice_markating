import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cache-management',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Cache Management</h2>
      
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Resource Cache</h3>
        <p class="text-gray-600 mb-4">Clear the cached resources to force refresh from database.</p>
        
        <button (click)="clearResourceCache()" 
                [disabled]="isClearing"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400">
          {{isClearing ? 'Clearing...' : 'Clear Resource Cache'}}
        </button>
        
        <div *ngIf="message" class="mt-4 p-3 rounded" [ngClass]="{
          'bg-green-100 text-green-700': messageType === 'success',
          'bg-red-100 text-red-700': messageType === 'error'
        }">
          {{message}}
        </div>
      </div>
    </div>
  `
})
export class CacheManagementComponent {
  constructor(private http: HttpClient) {}

  isClearing = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  clearResourceCache() {
    this.isClearing = true;
    this.message = '';

    this.http.post<any>(`${environment.apiUrl}/resource/clear-cache`, {})
      .subscribe({
        next: (response) => {
          this.isClearing = false;
          this.messageType = 'success';
          this.message = response.message || 'Cache cleared successfully';
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          this.isClearing = false;
          this.messageType = 'error';
          this.message = 'Error clearing cache: ' + error.message;
          setTimeout(() => this.message = '', 3000);
        }
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resources',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Resources</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let resource of resources" class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold mb-2">{{resource.resourceTitle}}</h3>
          <p class="text-gray-600 text-sm mb-3">{{resource.linkShortDescription}}</p>
          <p class="text-gray-700 mb-4">{{resource.resourceShortDescription}}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{resource.createdAt | date:'short'}}</span>
            <button (click)="viewResource(resource)" class="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="resources.length === 0" class="text-center py-12">
        <p class="text-gray-500">No resources available at the moment.</p>
      </div>
    </div>
  `
})
export class ResourcesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  resources: any[] = [];

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.http.get<any[]>(`${environment.apiUrl}/resource/published`)
      .subscribe({
        next: data => this.resources = data,
        error: error => console.error('Error loading resources:', error)
      });
  }

  viewResource(resource: any) {
    // Implement resource detail view
    console.log('View resource:', resource);
  }
}
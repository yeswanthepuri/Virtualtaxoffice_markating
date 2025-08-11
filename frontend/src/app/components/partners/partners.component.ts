import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-partners',
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">VTO Implementation and Service Partners</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Specially trained consulting partners to help you get the most out of VirtualTaxOffice
        </p>
      </div>
    </section>

    <!-- Partners Content -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            VirtualTaxOffice is pleased to partner with the following consulting service providers to assist with setting up and using VTO. 
            While it isn't necessary to use any consulting help to subscribe to and use VTO, these partners are specially trained to help 
            with more detailed support and usage needs, and they have special access to our developers to assist with more complex loading 
            of your initial data than the standard user interface may provide.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let partner of partners" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-50 flex items-center justify-center p-4">
              <img [src]="getImageUrl(partner.imageId)" [alt]="partner.contactName" 
                   class="max-w-full max-h-full object-contain"
                   (error)="onImageError($event)">
            </div>
            
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">{{partner.contactName}}</h3>
              <p class="text-sm text-gray-600 text-center mb-4">{{partner.email}}</p>
              
              <p class="text-gray-700 mb-4 text-sm leading-relaxed">{{partner.description}}</p>
              
              <div *ngIf="partner.website" class="flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path>
                </svg>
                <a [href]="partner.website" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="partners.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No partners available at the moment.</p>
        </div>
      </div>
    </section>
  `
})
export class PartnersComponent implements OnInit {
  partners: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.http.get<any[]>(`${environment.apiUrl}/partner/public`).subscribe({
      next: (data) => this.partners = data,
      error: (err) => console.error('Error loading partners:', err)
    });
  }

  getImageUrl(imageId: string): string {
    if (!imageId) return '/assets/default-avatar.png';
    return `${environment.apiUrl}/fileupload/image/${imageId}`;
  }

  onImageError(event: any) {
    event.target.src = '/assets/default-avatar.png';
  }
}
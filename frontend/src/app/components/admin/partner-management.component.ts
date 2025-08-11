import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-partner-management',
  template: `
    <div class="p-6">
      <h2 class="text-2xl mb-4">Partner Management</h2>
      
      <div class="mb-6">
        <h3 class="text-lg mb-2">Add Partner</h3>
        <form (ngSubmit)="savePartner()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Upload Image (JPG/PNG)</label>
            <input type="file" (change)="onFileSelected($event)" accept=".jpg,.jpeg,.png" class="w-full p-2 border rounded">
            <div *ngIf="uploadMessage" class="text-sm mt-1" [class.text-green-600]="uploadSuccess" [class.text-red-600]="!uploadSuccess">{{uploadMessage}}</div>
          </div>
          <input [(ngModel)]="partner.imageId" name="imageId" placeholder="Image Path (auto-filled after upload)" class="w-full p-2 border rounded" readonly>
          <textarea [(ngModel)]="partner.description" name="description" placeholder="Description" class="w-full p-2 border rounded" required></textarea>
          <input [(ngModel)]="partner.contactName" name="contactName" placeholder="Contact Name" class="w-full p-2 border rounded" required>
          <input [(ngModel)]="partner.email" name="email" type="email" placeholder="Email" class="w-full p-2 border rounded" required>
          <input [(ngModel)]="partner.website" name="website" placeholder="Website" class="w-full p-2 border rounded">
          <div class="flex gap-2">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">{{editingId ? 'Update' : 'Add'}} Partner</button>
            <button type="button" (click)="cancelEdit()" *ngIf="editingId" class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>

      <div>
        <h3 class="text-lg mb-2">Partners</h3>
        <div *ngFor="let p of partners" class="border p-4 mb-2 rounded">
          <div class="flex justify-between items-start">
            <div>
              <p><strong>{{p.contactName}}</strong></p>
              <p>{{p.description}}</p>
              <p>Email: {{p.email}}</p>
              <p *ngIf="p.website">Website: {{p.website}}</p>
              <p>Image ID: {{p.imageId}}</p>
            </div>
            <div class="flex gap-2">
              <button (click)="editPartner(p)" class="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
              <button (click)="deletePartner(p.id)" class="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="mt-4 p-2 rounded bg-blue-100">{{message}}</div>
    </div>
  `
})
export class PartnerManagementComponent implements OnInit {
  partners: any[] = [];
  partner = { imageId: '', description: '', contactName: '', email: '', website: '' };
  editingId: number | null = null;
  message = '';
  uploadMessage = '';
  uploadSuccess = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.http.get<any[]>(`${environment.apiUrl}/partner`).subscribe({
      next: (data) => this.partners = data,
      error: (err) => this.message = 'Error loading partners'
    });
  }

  savePartner() {
    const request = this.editingId 
      ? this.http.put(`${environment.apiUrl}/partner/${this.editingId}`, this.partner)
      : this.http.post(`${environment.apiUrl}/partner`, this.partner);

    request.subscribe({
      next: () => {
        this.message = `Partner ${this.editingId ? 'updated' : 'added'} successfully`;
        this.resetForm();
        this.loadPartners();
      },
      error: (err) => this.message = 'Error saving partner'
    });
  }

  editPartner(p: any) {
    this.partner = { ...p };
    this.editingId = p.id;
  }

  deletePartner(id: number) {
    this.http.delete(`${environment.apiUrl}/partner/${id}`).subscribe({
      next: () => {
        this.message = 'Partner deleted successfully';
        this.loadPartners();
      },
      error: (err) => this.message = 'Error deleting partner'
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.partner = { imageId: '', description: '', contactName: '', email: '', website: '' };
    this.editingId = null;
    this.uploadMessage = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.uploadMessage = 'Only JPG and PNG images are allowed';
      this.uploadSuccess = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${environment.apiUrl}/fileupload/image`, formData).subscribe({
      next: (response) => {
        this.partner.imageId = response.fileName;
        this.uploadMessage = 'Image uploaded successfully';
        this.uploadSuccess = true;
      },
      error: (err) => {
        this.uploadMessage = 'Upload failed: ' + (err.error?.message || err.message);
        this.uploadSuccess = false;
      }
    });
  }
}
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="p-6">
      <input type="file" (change)="onFileSelect($event)" accept=".xlsx,.xls" class="mb-4">
      
      <div *ngIf="validationResult" class="mt-6">
        <div class="mb-4">
          <p class="text-green-600" *ngIf="validationResult.isValid">✓ File is valid</p>
          <p class="text-red-600" *ngIf="!validationResult.isValid">✗ File has errors</p>
        </div>
        
        <div *ngIf="validationResult.errors?.length" class="mb-4">
          <ul class="list-disc pl-5">
            <li *ngFor="let error of validationResult.errors" class="text-red-600">{{error}}</li>
          </ul>
        </div>
        
        <textarea readonly class="w-full h-64 p-4 border rounded bg-gray-50" [value]="validationResult.jsonData || ''"></textarea>
      </div>
    </div>
  `
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  validationResult: any = null;

  constructor(private http: HttpClient) {}

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadFile();
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/api/FileValidation/validate', formData)
      .subscribe(result => {
        this.validationResult = result;
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resource-management',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Resource Management</h2>
      
      <!-- Resource List View -->
      <div *ngIf="!showForm && !showSectionForm">
        <div *ngFor="let resource of resources" class="mb-6">
          <div class="bg-white border rounded-lg">
            <!-- Resource Header -->
            <div class="p-4 border-b flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-blue-600">{{resource.title}}</h3>
                <p class="text-sm text-gray-600">{{resource.description}}</p>
                <p class="text-xs text-gray-500">Created: {{resource.createdAt | date:'M/d/yy, h:mm a'}}</p>
              </div>
              <div class="flex space-x-2">
                <button (click)="editResource(resource)" class="text-green-500 hover:text-green-700 text-sm">Edit</button>
                <button (click)="deleteResource(resource.resourceId)" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
                <button (click)="toggleSections(resource.resourceId)" class="text-blue-500 hover:text-blue-700 text-sm">
                  {{resource.showSections ? 'Hide Sections' : 'Show Sections'}}
                </button>
              </div>
            </div>
            
            <!-- Add Section Form -->
            <div *ngIf="resource.showSections" class="p-4 bg-gray-50">
              <h4 class="font-medium mb-3">Add Section</h4>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <input [(ngModel)]="newSectionTitle" placeholder="Section title" 
                       class="border rounded px-3 py-2">
                <select [(ngModel)]="selectedParentSection" class="border rounded px-3 py-2">
                  <option value="">Root Section</option>
                  <option *ngFor="let section of getResourceSections(resource.resourceId)" [value]="section.sectionId">
                    {{section.title}}
                  </option>
                </select>
              </div>
              <textarea [(ngModel)]="newSectionDescription" placeholder="Section description (optional)" 
                       class="w-full border rounded px-3 py-2 mb-3" rows="2"></textarea>
              <button (click)="addSection(resource.resourceId)" 
                      class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add Section
              </button>
            </div>
            
            <!-- Resource Structure -->
            <div *ngIf="resource.showSections" class="p-4">
              <h4 class="font-medium mb-3">Resource Structure</h4>
              <div class="space-y-2">
                <div *ngFor="let section of getRootSections(resource.resourceId)">
                  <div class="flex justify-between items-center p-2 hover:bg-gray-50">
                    <div class="flex-1">
                      <div class="font-medium">{{section.title}}</div>
                      <div class="text-sm text-gray-600" *ngIf="section.description">{{section.description}}</div>
                    </div>
                    <button (click)="editSection(section)" class="text-green-500 hover:text-green-700 text-sm">Edit</button>
                  </div>
                  <!-- Subsections -->
                  <div *ngFor="let subSection of section.subSections" class="ml-6">
                    <div class="flex justify-between items-center p-2 hover:bg-gray-50">
                      <div class="flex items-center flex-1">
                        <span class="text-blue-500 mr-2">•</span>
                        <div>
                          <div class="text-sm font-medium">{{subSection.title}}</div>
                          <div class="text-xs text-gray-600" *ngIf="subSection.description">{{subSection.description}}</div>
                        </div>
                      </div>
                      <button (click)="editSection(subSection)" class="text-green-500 hover:text-green-700 text-xs">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resource Form -->
      <div *ngIf="showForm" class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">{{isEditing ? 'Edit' : 'Add'}} Resource</h3>
          <button (click)="cancelForm()" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form (ngSubmit)="saveResource()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link Description (50 chars)</label>
              <input [(ngModel)]="currentResource.linkDescription" name="linkDescription" 
                     maxlength="50" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link Short Description (100 chars)</label>
              <input [(ngModel)]="currentResource.linkShortDescription" name="linkShortDescription" 
                     maxlength="100" class="w-full border rounded px-3 py-2" required>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Resource Title (500 chars)</label>
            <input [(ngModel)]="currentResource.resourceTitle" name="resourceTitle" 
                   maxlength="500" class="w-full border rounded px-3 py-2" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Resource Short Description (5000 chars)</label>
            <textarea [(ngModel)]="currentResource.resourceShortDescription" name="resourceShortDescription" 
                      maxlength="5000" rows="3" class="w-full border rounded px-3 py-2" required></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Resource Details (10000 chars)</label>
            <textarea [(ngModel)]="currentResource.resourceDetails" name="resourceDetails" 
                      maxlength="10000" rows="6" class="w-full border rounded px-3 py-2" required></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select [(ngModel)]="currentResource.status" name="status" class="w-full border rounded px-3 py-2" required>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archive">Archive</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Excel File (Optional)</label>
            <input type="file" (change)="onFileSelect($event)" accept=".xlsx,.xls" 
                   class="w-full border rounded px-3 py-2">
            <div *ngIf="selectedFile" class="mt-2 p-2 rounded text-sm" [ngClass]="{
              'bg-blue-50': validationStatus === 'validating',
              'bg-green-50': validationStatus === 'valid',
              'bg-red-50': validationStatus === 'invalid'
            }">
              <strong>Selected:</strong> {{selectedFile.name}} ({{(selectedFile.size / 1024).toFixed(2)}} KB)
              <div class="mt-1 text-xs" [ngClass]="{
                'text-blue-600': validationStatus === 'validating',
                'text-green-600': validationStatus === 'valid',
                'text-red-600': validationStatus === 'invalid'
              }">
                <span *ngIf="validationStatus === 'validating'">Validating...</span>
                <span *ngIf="validationStatus === 'valid'">✓ File validated successfully</span>
                <div *ngIf="validationStatus === 'invalid'">
                  <div>✗ Validation failed:</div>
                  <ul class="list-disc list-inside mt-1">
                    <li *ngFor="let error of validationErrors">{{error}}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div *ngIf="validatedJsonData" class="mt-2 p-3 bg-gray-50 rounded border">
              <div class="text-sm font-medium text-gray-700 mb-2">JSON Response:</div>
              <pre class="text-xs bg-white p-2 rounded border overflow-auto max-h-40">{{validatedJsonData}}</pre>
            </div>
          </div>

          <div class="flex space-x-4">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              {{isEditing ? 'Update' : 'Create'}} Resource
            </button>
            <button type="button" (click)="cancelForm()" class="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Section Edit Form -->
      <div *ngIf="showSectionForm" class="bg-white shadow rounded-lg p-6 mt-4">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">Edit Section</h3>
          <button (click)="cancelSectionForm()" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form (ngSubmit)="updateSection()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input [(ngModel)]="currentSection.title" name="title" class="w-full border rounded px-3 py-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
            <textarea [(ngModel)]="currentSection.description" name="description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div class="flex space-x-4">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Update Section
            </button>
            <button type="button" (click)="cancelSectionForm()" class="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ResourceManagementComponent implements OnInit {
  constructor(private http: HttpClient) {}
  
  showForm = false;
  isEditing = false;
  selectedFile: File | null = null;
  validatedJsonData: string | null = null;
  validationStatus: 'none' | 'validating' | 'valid' | 'invalid' = 'none';
  validationErrors: string[] = [];
  
  currentResource = {
    id: 0,
    linkDescription: '',
    linkShortDescription: '',
    resourceTitle: '',
    resourceShortDescription: '',
    resourceDetails: '',
    status: 'Draft',
    createdAt: new Date()
  };

  resources: any[] = [];
  sections: any[] = [];
  showSectionForm = false;
  newSectionTitle = '';
  newSectionDescription = '';
  selectedParentSection = '';
  currentSection: any = null;

  ngOnInit() {
    this.loadResources();
    this.loadSections();
  }

  loadResources() {
    this.http.get<any[]>(`${environment.apiUrl}/resource`)
      .subscribe({
        next: data => {
          this.resources = data.map(r => ({...r, showSections: false}));
        },
        error: error => console.error('Error loading resources:', error)
      });
  }

  loadSections() {
    this.http.get<any[]>(`${environment.apiUrl}/resource/sections`)
      .subscribe({
        next: data => this.sections = data,
        error: error => console.error('Error loading sections:', error)
      });
  }

  toggleSections(resourceId: number) {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource) {
      resource.showSections = !resource.showSections;
    }
  }

  getResourceSections(resourceId: number) {
    return this.sections.filter(s => s.resourceId === resourceId && !s.parentSectionId);
  }

  getRootSections(resourceId: number) {
    const rootSections = this.sections.filter(s => s.resourceId === resourceId && !s.parentSectionId);
    return rootSections.map(section => ({
      ...section,
      subSections: this.sections.filter(s => s.parentSectionId === section.id)
    }));
  }

  addSection(resourceId: number) {
    if (!this.newSectionTitle.trim()) return;
    
    const sectionData = {
      resourceId: resourceId,
      parentSectionId: this.selectedParentSection || null,
      title: this.newSectionTitle,
      description: this.newSectionDescription
    };

    this.http.post<any>(`${environment.apiUrl}/resource/${resourceId}/sections`, sectionData)
      .subscribe({
        next: () => {
          this.loadSections();
          this.newSectionTitle = '';
          this.newSectionDescription = '';
          this.selectedParentSection = '';
        },
        error: error => alert('Error adding section: ' + error.message)
      });
  }

  editSection(section: any) {
    this.currentSection = {...section};
    this.showSectionForm = true;
  }

  updateSection() {
    this.http.put<any>(`${environment.apiUrl}/resource/sections/${this.currentSection.id}`, this.currentSection)
      .subscribe({
        next: () => {
          this.loadSections();
          this.cancelSectionForm();
        },
        error: error => alert('Error updating section: ' + error.message)
      });
  }

  cancelSectionForm() {
    this.showSectionForm = false;
    this.currentSection = null;
  }

  addResource() {
    this.showForm = true;
    this.isEditing = false;
    this.resetForm();
  }

  editResource(resource: any) {
    this.showForm = true;
    this.isEditing = true;
    this.currentResource = { ...resource };
  }

  saveResource() {
    this.saveResourceWithData(this.validatedJsonData);
  }

  validateExcelFile(): Promise<any> {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    return this.http.post<any>(`${environment.apiUrl}/filevalidation/validate`, formData).toPromise();
  }

  saveResourceWithData(jsonData: string | null) {
    const formData = new FormData();
    formData.append('LinkDescription', this.currentResource.linkDescription);
    formData.append('LinkShortDescription', this.currentResource.linkShortDescription);
    formData.append('ResourceTitle', this.currentResource.resourceTitle);
    formData.append('ResourceShortDescription', this.currentResource.resourceShortDescription);
    formData.append('ResourceDetails', this.currentResource.resourceDetails);
    formData.append('Status', this.currentResource.status);
    
    if (jsonData) {
      formData.append('JsonData', jsonData);
    }

    const request = this.isEditing 
      ? this.http.put<any>(`${environment.apiUrl}/resource/${this.currentResource.id}`, formData)
      : this.http.post<any>(`${environment.apiUrl}/resource`, formData);

    request.subscribe({
      next: () => {
        alert('Resource saved successfully!');
        this.loadResources();
        this.cancelForm();
      },
      error: error => alert('Error saving resource: ' + error.message)
    });
  }

  deleteResource(id: number) {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.http.delete<any>(`${environment.apiUrl}/resource/${id}`)
        .subscribe({
          next: () => this.loadResources(),
          error: error => alert('Error deleting resource: ' + error.message)
        });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.currentResource = {
      id: 0,
      linkDescription: '',
      linkShortDescription: '',
      resourceTitle: '',
      resourceShortDescription: '',
      resourceDetails: '',
      status: 'Draft',
      createdAt: new Date()
    };
    this.selectedFile = null;
    this.resetValidation();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.selectedFile = file;
      this.validateFileOnSelection();
    } else {
      this.selectedFile = null;
      this.resetValidation();
      if (file) {
        alert('Please select only Excel files (.xlsx or .xls)');
      }
    }
  }

  validateFileOnSelection() {
    if (!this.selectedFile) return;
    
    this.validationStatus = 'validating';
    this.validationErrors = [];
    this.validatedJsonData = null;

    this.validateExcelFile().then(validationResult => {
      if (validationResult.isValid) {
        this.validationStatus = 'valid';
        this.validatedJsonData = validationResult.jsonData;
      } else {
        this.validationStatus = 'invalid';
        this.validationErrors = validationResult.errors || [];
      }
    }).catch(error => {
      this.validationStatus = 'invalid';
      this.validationErrors = ['Validation failed: ' + error.message];
    });
  }

  resetValidation() {
    this.validationStatus = 'none';
    this.validationErrors = [];
    this.validatedJsonData = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Published': return 'text-green-600 bg-green-100 px-2 py-1 rounded';
      case 'Draft': return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded';
      case 'Archive': return 'text-gray-600 bg-gray-100 px-2 py-1 rounded';
      default: return 'text-gray-600';
    }
  }
}
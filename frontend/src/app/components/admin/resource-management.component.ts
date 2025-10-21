import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resource-management',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Resource Management</h2>
      <div class="mb-4">
          <button (click)="addResource()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Resource
          </button>
        </div>
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input [(ngModel)]="currentResource.title" name="title" 
                   class="w-full border rounded px-3 py-2" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="currentResource.description" name="description" 
                      rows="3" class="w-full border rounded px-3 py-2"></textarea>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Parent Section</label>
            <select [(ngModel)]="currentSection.parentSectionId" name="parentSectionId" class="w-full border rounded px-3 py-2">
              <option [value]="null">Root Section</option>
              <option *ngFor="let section of getAvailableParentSections(currentSection.resourceId, currentSection.sectionId)" [value]="section.sectionId">
                {{section.title}}
              </option>
            </select>
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
    resourceId: 0,
    title: '',
    description: '',
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
    const resource = this.resources.find(r => r.resourceId === resourceId);
    if (resource) {
      resource.showSections = !resource.showSections;
    }
  }

  getResourceSections(resourceId: number) {
    return this.sections.filter(s => s.resourceId === resourceId && !s.parentSectionId);
  }

  getAvailableParentSections(resourceId: number, currentSectionId: number) {
    return this.sections.filter(s => 
      s.resourceId === resourceId && 
      s.sectionId !== currentSectionId &&
      s.parentSectionId !== currentSectionId
    );
  }

  getRootSections(resourceId: number) {
    const rootSections = this.sections.filter(s => s.resourceId === resourceId && !s.parentSectionId);
    return rootSections.map(section => ({
      ...section,
      subSections: this.sections.filter(s => s.parentSectionId === section.sectionId)
    }));
  }

  addSection(resourceId: number) {
    if (!this.newSectionTitle.trim()) return;
    
    const sectionData = {
      parentSectionId: this.selectedParentSection ? parseInt(this.selectedParentSection) : null,
      title: this.newSectionTitle,
      description: this.newSectionDescription,
      sortOrder: 0
    };

    this.http.post<any>(`${environment.apiUrl}/resource/${resourceId}/sections`, sectionData)
      .subscribe({
        next: () => {
          this.loadSections();
          this.newSectionTitle = '';
          this.newSectionDescription = '';
          this.selectedParentSection = '';
        },
        error: error => {
          console.error('Error adding section:', error);
          alert('Error adding section: ' + (error.error?.message || error.message));
        }
      });
  }

  editSection(section: any) {
    this.currentSection = {...section};
    this.showSectionForm = true;
  }

  updateSection() {
    const sectionData = {
      parentSectionId: this.currentSection.parentSectionId,
      title: this.currentSection.title,
      description: this.currentSection.description,
      sortOrder: this.currentSection.sortOrder || 0
    };
    
    this.http.put<any>(`${environment.apiUrl}/resource/sections/${this.currentSection.sectionId}`, sectionData)
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
    const resourceData = {
      title: this.currentResource.title,
      description: this.currentResource.description
    };

    const request = this.isEditing 
      ? this.http.put<any>(`${environment.apiUrl}/resource/${this.currentResource.resourceId}`, resourceData)
      : this.http.post<any>(`${environment.apiUrl}/resource`, resourceData);

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
      resourceId: 0,
      title: '',
      description: '',
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
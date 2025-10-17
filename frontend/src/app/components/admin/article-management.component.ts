import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-article-management',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Article Management</h2>
      
      <!-- Article List View -->
      <div *ngIf="!showForm">
        <div class="mb-4">
          <button (click)="addArticle()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Article
          </button>
        </div>

        <div class="bg-white shadow rounded-lg">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let article of articles">
                <td class="px-6 py-4">{{article.articleTitle}}</td>
                <td class="px-6 py-4">{{article.linkDescription}}</td>
                <td class="px-6 py-4">
                  <span [class]="getStatusClass(article.status)">{{article.status}}</span>
                </td>
                <td class="px-6 py-4">{{article.createdAt | date:'short'}}</td>
                <td class="px-6 py-4 space-x-2">
                  <button (click)="editArticle(article)" class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button (click)="deleteArticle(article.id)" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Article Form -->
      <div *ngIf="showForm" class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">{{isEditing ? 'Edit' : 'Add'}} Article</h3>
          <button (click)="cancelForm()" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form (ngSubmit)="saveArticle()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link Description (50 chars)</label>
              <input [(ngModel)]="currentArticle.linkDescription" name="linkDescription" 
                     maxlength="50" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link Short Description (100 chars)</label>
              <input [(ngModel)]="currentArticle.linkShortDescription" name="linkShortDescription" 
                     maxlength="100" class="w-full border rounded px-3 py-2" required>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article Title (500 chars)</label>
            <input [(ngModel)]="currentArticle.articleTitle" name="articleTitle" 
                   maxlength="500" class="w-full border rounded px-3 py-2" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article Short Description (5000 chars)</label>
            <textarea [(ngModel)]="currentArticle.articleShortDescription" name="articleShortDescription" 
                      maxlength="5000" rows="3" class="w-full border rounded px-3 py-2" required></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article Details (10000 chars)</label>
            <textarea [(ngModel)]="currentArticle.articleDetails" name="articleDetails" 
                      maxlength="10000" rows="6" class="w-full border rounded px-3 py-2" required></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select [(ngModel)]="currentArticle.status" name="status" class="w-full border rounded px-3 py-2" required>
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
              {{isEditing ? 'Update' : 'Create'}} Article
            </button>
            <button type="button" (click)="cancelForm()" class="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ArticleManagementComponent {
  constructor(private http: HttpClient) {}
  
  showForm = false;
  isEditing = false;
  selectedFile: File | null = null;
  validatedJsonData: string | null = null;
  validationStatus: 'none' | 'validating' | 'valid' | 'invalid' = 'none';
  validationErrors: string[] = [];
  
  currentArticle = {
    id: 0,
    linkDescription: '',
    linkShortDescription: '',
    articleTitle: '',
    articleShortDescription: '',
    articleDetails: '',
    status: 'Draft',
    createdAt: new Date()
  };

  articles: any[] = [];

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.http.get<any[]>(`${environment.apiUrl}/article`)
      .subscribe({
        next: data => this.articles = data,
        error: error => console.error('Error loading articles:', error)
      });
  }

  addArticle() {
    this.showForm = true;
    this.isEditing = false;
    this.resetForm();
  }

  editArticle(article: any) {
    this.showForm = true;
    this.isEditing = true;
    this.currentArticle = { ...article };
  }

  saveArticle() {
    this.saveArticleWithData(this.validatedJsonData);
  }

  validateExcelFile(): Promise<any> {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    return this.http.post<any>(`${environment.apiUrl}/filevalidation/validate`, formData).toPromise();
  }

  saveArticleWithData(jsonData: string | null) {
    const formData = new FormData();
    formData.append('LinkDescription', this.currentArticle.linkDescription);
    formData.append('LinkShortDescription', this.currentArticle.linkShortDescription);
    formData.append('ArticleTitle', this.currentArticle.articleTitle);
    formData.append('ArticleShortDescription', this.currentArticle.articleShortDescription);
    formData.append('ArticleDetails', this.currentArticle.articleDetails);
    formData.append('Status', this.currentArticle.status);
    
    if (jsonData) {
      formData.append('JsonData', jsonData);
    }

    const request = this.isEditing 
      ? this.http.put<any>(`${environment.apiUrl}/article/${this.currentArticle.id}`, formData)
      : this.http.post<any>(`${environment.apiUrl}/article`, formData);

    request.subscribe({
      next: () => {
        alert('Article saved successfully!');
        this.loadArticles();
        this.cancelForm();
      },
      error: error => alert('Error saving article: ' + error.message)
    });
  }

  deleteArticle(id: number) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.http.delete<any>(`${environment.apiUrl}/article/${id}`)
        .subscribe({
          next: () => this.loadArticles(),
          error: error => alert('Error deleting article: ' + error.message)
        });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.currentArticle = {
      id: 0,
      linkDescription: '',
      linkShortDescription: '',
      articleTitle: '',
      articleShortDescription: '',
      articleDetails: '',
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
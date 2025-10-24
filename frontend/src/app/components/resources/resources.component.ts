import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  resources: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.http.get<any[]>(`${environment.apiUrl}/resource/published`)
      .subscribe({
        next: (data) => {
          this.resources = data || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading resources:', error);
          this.resources = [];
          this.isLoading = false;
        }
      });
  }
}


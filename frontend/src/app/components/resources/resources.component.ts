import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent {
  resources$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.resources$ = this.http.get<any[]>(`${environment.apiUrl}/resource/published`);
  }
}


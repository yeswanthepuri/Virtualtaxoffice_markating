import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-policy-maintenance',
  template: `
    <div class="p-6">
      <h2 class="text-2xl mb-4">Policy Maintenance</h2>
      
      <div class="mb-6">
        <h3 class="text-lg mb-2">Available Policies</h3>
        <div *ngFor="let policy of policies" class="border p-3 mb-2 rounded">
          <strong>{{policy.name}}</strong>
          <p class="text-sm text-gray-600">{{policy.description}}</p>
          <p class="text-xs">Required Roles: {{policy.requiredRoles.join(', ')}}</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg mb-2">Test Policy Access</h3>
        <div class="flex gap-2">
          <select [(ngModel)]="selectedPolicy" class="p-2 border rounded">
            <option value="">Select Policy</option>
            <option *ngFor="let policy of policies" [value]="policy.name">{{policy.name}}</option>
          </select>
          <button (click)="testPolicy()" class="bg-purple-500 text-white px-4 py-2 rounded">Test Access</button>
        </div>
      </div>

      <div *ngIf="testResult">
        <h3 class="text-lg mb-2">Test Result</h3>
        <div class="border p-3 rounded" [class.bg-green-100]="testResult.hasAccess" [class.bg-red-100]="!testResult.hasAccess">
          <p><strong>Policy:</strong> {{testResult.policyName}}</p>
          <p><strong>Access:</strong> {{testResult.hasAccess ? 'Granted' : 'Denied'}}</p>
          <p *ngIf="testResult.reasons?.length"><strong>Reasons:</strong> {{testResult.reasons.join(', ')}}</p>
        </div>
      </div>

      <div *ngIf="message" class="mt-4 p-2 rounded bg-blue-100">{{message}}</div>
    </div>
  `
})
export class PolicyMaintenanceComponent implements OnInit {
  policies: any[] = [];
  selectedPolicy = '';
  testResult: any = null;
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.http.get<any[]>(`${environment.apiUrl}/policyManagement/available`).subscribe(data => this.policies = data);
  }

  testPolicy() {
    this.http.post(`${environment.apiUrl}/policyManagement/validate-access`, this.selectedPolicy).subscribe({
      next: (result) => this.testResult = result,
      error: (err) => this.message = err.error?.message || 'Error testing policy'
    });
  }
}
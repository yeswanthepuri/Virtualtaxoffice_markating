import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-maintenance',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Location Maintenance</h2>
      
      <div class="flex space-x-4 mb-6">
        <button (click)="activeTab = 'countries'" 
                [class]="activeTab === 'countries' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                class="px-4 py-2 rounded">Countries</button>
        <button (click)="activeTab = 'states'" 
                [class]="activeTab === 'states' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                class="px-4 py-2 rounded">States</button>
      </div>

      <!-- Countries Tab -->
      <div *ngIf="activeTab === 'countries'">
        <div class="mb-4">
          <button (click)="addCountry()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Country
          </button>
        </div>

        <div class="bg-white shadow rounded-lg">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">States</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let country of countries">
                <td class="px-6 py-4">{{country.name}}</td>
                <td class="px-6 py-4">{{country.code}}</td>
                <td class="px-6 py-4">
                  <span [class]="country.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" 
                        class="px-2 py-1 rounded text-sm">
                    {{country.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td class="px-6 py-4">{{country.states?.length || 0}}</td>
                <td class="px-6 py-4 space-x-2">
                  <button (click)="editCountry(country)" class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button (click)="deleteCountry(country.id)" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- States Tab -->
      <div *ngIf="activeTab === 'states'">
        <div class="mb-4 flex space-x-4">
          <select [(ngModel)]="selectedCountryId" class="border rounded px-3 py-2">
            <option value="">Select Country</option>
            <option *ngFor="let country of countries" [value]="country.id">{{country.name}}</option>
          </select>
          <button (click)="addState()" [disabled]="!selectedCountryId" 
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300">
            Add State
          </button>
        </div>

        <div class="bg-white shadow rounded-lg">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let state of filteredStates">
                <td class="px-6 py-4">{{state.name}}</td>
                <td class="px-6 py-4">{{state.code}}</td>
                <td class="px-6 py-4">{{getCountryName(state.countryId)}}</td>
                <td class="px-6 py-4">
                  <span [class]="state.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" 
                        class="px-2 py-1 rounded text-sm">
                    {{state.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td class="px-6 py-4 space-x-2">
                  <button (click)="editState(state)" class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button (click)="deleteState(state.id)" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Country Form Modal -->
      <div *ngIf="showCountryForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h3 class="text-lg font-semibold mb-4">{{isEditingCountry ? 'Edit' : 'Add'}} Country</h3>
          <form (ngSubmit)="saveCountry()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input [(ngModel)]="currentCountry.name" name="name" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Code</label>
              <input [(ngModel)]="currentCountry.code" name="code" maxlength="3" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="flex items-center">
                <input type="checkbox" [(ngModel)]="currentCountry.isActive" name="isActive" class="mr-2">
                Active
              </label>
            </div>
            <div class="flex space-x-4">
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              <button type="button" (click)="cancelCountryForm()" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- State Form Modal -->
      <div *ngIf="showStateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h3 class="text-lg font-semibold mb-4">{{isEditingState ? 'Edit' : 'Add'}} State</h3>
          <form (ngSubmit)="saveState()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input [(ngModel)]="currentState.name" name="name" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Code</label>
              <input [(ngModel)]="currentState.code" name="code" maxlength="10" class="w-full border rounded px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Country</label>
              <select [(ngModel)]="currentState.countryId" name="countryId" class="w-full border rounded px-3 py-2" required>
                <option value="">Select Country</option>
                <option *ngFor="let country of countries" [value]="country.id">{{country.name}}</option>
              </select>
            </div>
            <div>
              <label class="flex items-center">
                <input type="checkbox" [(ngModel)]="currentState.isActive" name="isActive" class="mr-2">
                Active
              </label>
            </div>
            <div class="flex space-x-4">
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              <button type="button" (click)="cancelStateForm()" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LocationMaintenanceComponent implements OnInit {
  activeTab = 'countries';
  showCountryForm = false;
  showStateForm = false;
  isEditingCountry = false;
  isEditingState = false;
  selectedCountryId = '';

  currentCountry = { id: 0, name: '', code: '', isActive: true };
  currentState = { id: 0, name: '', code: '', countryId: 0, isActive: true };

  countries = [
    { id: 1, name: 'United States', code: 'USA', isActive: true, states: [] },
    { id: 2, name: 'Canada', code: 'CAN', isActive: true, states: [] }
  ];

  states = [
    { id: 1, name: 'California', code: 'CA', countryId: 1, isActive: true },
    { id: 2, name: 'Texas', code: 'TX', countryId: 1, isActive: true },
    { id: 3, name: 'Ontario', code: 'ON', countryId: 2, isActive: true }
  ];

  ngOnInit() {}

  get filteredStates() {
    return this.selectedCountryId 
      ? this.states.filter(s => s.countryId == +this.selectedCountryId)
      : this.states;
  }

  addCountry() {
    this.showCountryForm = true;
    this.isEditingCountry = false;
    this.currentCountry = { id: 0, name: '', code: '', isActive: true };
  }

  editCountry(country: any) {
    this.showCountryForm = true;
    this.isEditingCountry = true;
    this.currentCountry = { ...country };
  }

  saveCountry() {
    if (this.isEditingCountry) {
      const index = this.countries.findIndex(c => c.id === this.currentCountry.id);
      if (index !== -1) this.countries[index] = { ...this.currentCountry, states: [] };
    } else {
      this.countries.push({ ...this.currentCountry, id: Date.now(), states: [] });
    }
    this.cancelCountryForm();
  }

  deleteCountry(id: number) {
    if (confirm('Delete this country and all its states?')) {
      this.countries = this.countries.filter(c => c.id !== id);
      this.states = this.states.filter(s => s.countryId !== id);
    }
  }

  cancelCountryForm() {
    this.showCountryForm = false;
  }

  addState() {
    this.showStateForm = true;
    this.isEditingState = false;
    this.currentState = { id: 0, name: '', code: '', countryId: +this.selectedCountryId, isActive: true };
  }

  editState(state: any) {
    this.showStateForm = true;
    this.isEditingState = true;
    this.currentState = { ...state };
  }

  saveState() {
    if (this.isEditingState) {
      const index = this.states.findIndex(s => s.id === this.currentState.id);
      if (index !== -1) this.states[index] = { ...this.currentState };
    } else {
      this.states.push({ ...this.currentState, id: Date.now() });
    }
    this.cancelStateForm();
  }

  deleteState(id: number) {
    if (confirm('Delete this state?')) {
      this.states = this.states.filter(s => s.id !== id);
    }
  }

  cancelStateForm() {
    this.showStateForm = false;
  }

  getCountryName(countryId: number): string {
    return this.countries.find(c => c.id === countryId)?.name || '';
  }
}
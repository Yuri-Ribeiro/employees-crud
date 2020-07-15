import { Component } from '@angular/core';
import { DataService, Employee } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  employees: Employee[]
  
  constructor(
    private _dataService: DataService,
    private _router: Router
  ) {
    setTimeout(() => {
      this.employees = this._dataService.readEmployees();
    }, 3000)
  }

  navigateToUpdateEmployee(employeeID: number) {
    this._router.navigate([`/home/update-employee/${employeeID}`])
  }
  
  navigateToDeleteEmployee(employeeID: number) {
    this._router.navigate([`/home/delete-employee/${employeeID}`])
  }
}

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
    private _router: Router,
    dataService: DataService,
  ) {
    setTimeout(() => {
      this.employees = dataService.readEmployees()
    }, 1500)
  }

  get sortedEmployees(){
    return this.sortEmployeeByname(this.employees)
  }

  // ordena funcionários por ordem alfabética
  sortEmployeeByname(employees: Employee[]): Employee[] {
    return employees.sort( (employeeA, employeeB) => {
      return employeeA.name.toLowerCase().localeCompare(employeeB.name.toLowerCase())
    })
  }

  navigateToUpdateEmployee(employeeID: string) {
    this._router.navigate([`/home/update-employee/${employeeID}`])
  }
  
  navigateToDeleteEmployee(employeeID: string) {
    this._router.navigate([`/home/delete-employee/${employeeID}`])
  }
}

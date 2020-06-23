import { Component } from '@angular/core';
import { DataService, Employee } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  employees: Employee[]
  
  constructor(private _dataService: DataService) {
    setTimeout(() => {
      this.employees = this._dataService.readEmployees();
    }, 2500)
  }

  // refresh(ev) {
  //   setTimeout(() => {
  //     ev.detail.complete();
  //   }, 3000);
  // }
}

import { Component } from '@angular/core';
import { DataService, Employee } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  employees: Employee[]
  
  constructor(private data: DataService) {
    setTimeout(() => {
      this.employees = this.data.getEmployees();
    }, 3000)
  }

  // refresh(ev) {
  //   setTimeout(() => {
  //     ev.detail.complete();
  //   }, 3000);
  // }
}

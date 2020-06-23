import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Employee } from '../services/data.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {
  employee: Employee

  constructor(
    private _data: DataService,
    private _activatedRoute: ActivatedRoute
  ) {
    setTimeout(() => {
      const employeeID: number = Number(_activatedRoute.snapshot.params['employeeID'])
      this.employee = this._data.readEmployeeById(employeeID)
    }, 3000)
  }

  ngOnInit() {
  }

}

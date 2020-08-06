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
    activatedRoute: ActivatedRoute,
    dataService: DataService
  ) {
    setTimeout(() => {
      const employeeID: string = activatedRoute.snapshot.params['employeeID']
      this.employee = dataService.readEmployeeById(employeeID)
    }, 1500)
  }

  ngOnInit() {
  }

}

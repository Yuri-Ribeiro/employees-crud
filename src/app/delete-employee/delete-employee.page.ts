import { Component, OnInit } from '@angular/core';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.page.html',
  styleUrls: ['./delete-employee.page.scss'],
})
export class DeleteEmployeePage implements OnInit {
  deleteFormGroup: FormGroup
  employeeID: number

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastController: ToastController,
    formBuilder: FormBuilder
  ) {

    setTimeout(() => {
      this.employeeID = Number(this._activatedRoute.snapshot.params["employeeID"])
      const employee: Employee = _dataService.readEmployeeById(this.employeeID)
  
      this.deleteFormGroup = formBuilder.group({
        id:[{value: employee.id, disabled: true}],
        avatarUrl:[{value: employee.avatarUrl, disabled: true}],
        name: [{value: employee.name, disabled: true}],
        email: [{value: employee.email, disabled: true}],
        job: [{value: employee.job, disabled: true}],
        description: [{value: employee.description, disabled: true}],
      })
    }, 3000)
  }

  removeEmployee() {
    this._dataService.deleteEmployee(this.employeeID)
    
    const toast = this._toastController.create({
      message: `Funcionário(a) foi removido(a) do sistema`,
      duration: 1500,
      position: "top"
    })
    toast.then(toastMessage => toastMessage.present())
    
    setTimeout(() => {
      this._router.navigate(["/home"])
    }, 1500)
  }

  ngOnInit() {
  }

}

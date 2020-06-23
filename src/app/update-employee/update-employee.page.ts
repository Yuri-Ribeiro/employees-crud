import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.page.html',
  styleUrls: ['./update-employee.page.scss'],
})
export class UpdateEmployeePage implements OnInit {
  updateFormGroup: FormGroup
  blankAvatar: string
  employeeID: number

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastController: ToastController,
    formBuilder: FormBuilder
  ) {
    this.blankAvatar = this._dataService.getBlankAvatar()

    setTimeout(() => {
      this.employeeID = this._activatedRoute.snapshot.params["employeeID"]
      const employee: Employee = _dataService.readEmployeeById(this.employeeID)
  
      this.updateFormGroup = formBuilder.group({
        id:[{value: employee.id, disabled: true}, Validators.required],
        avatarUrl:[employee.avatarUrl],
        name: [employee.name, Validators.required],
        email: [employee.email, Validators.required],
        job: [employee.job],
        description: [employee.description],
      })
    }, 2500)
  }

  editEmployee() {
    // O id não fica na propriedade value quando está desativada
    const updatedEmployee = {...this.updateFormGroup.value}
    this._dataService.updateEmployee({...updatedEmployee, id: this.employeeID})
    
    const toast = this._toastController.create({
      message: `Os Dados de ${updatedEmployee.name} Foram Atualizados`,
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

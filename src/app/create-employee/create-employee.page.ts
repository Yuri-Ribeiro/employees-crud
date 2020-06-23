import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
})
export class CreateEmployeePage implements OnInit {
  registrationFormGroup: FormGroup
  blankAvatar: string

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _toastController: ToastController,
    formBuider: FormBuilder
  ) {
    this.blankAvatar = this._dataService.getBlankAvatar()

    this.registrationFormGroup = formBuider.group({
      avatarUrl:[""],
      name: [ , Validators.required],
      email: [ , Validators.required],
      job: [],
      description: [],
    })
  }

  register() {
    const newEmployee: Employee = this.registrationFormGroup.value
    this._dataService.createEmployee(newEmployee)

    const toast = this._toastController.create({
      message: `${newEmployee.name} Foi Registrado(a)`,
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

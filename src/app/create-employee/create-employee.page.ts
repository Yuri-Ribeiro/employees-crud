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
    const wasCreated: boolean = this._dataService.createEmployee(newEmployee)

    const toast = this._toastController.create({
      message: wasCreated?`${newEmployee.name} foi cadastrado com sucesso`:`Usuário já está cadastrado`,
      duration: 2000,
      position: "top",
      color: wasCreated?undefined:"danger"
    })
    toast.then(toastMessage => toastMessage.present())
    
    if(wasCreated)
      setTimeout(() => {
        this._router.navigate(["/home"])
      }, 1500)
  }

  ngOnInit() {
  }
}

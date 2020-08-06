import { Component, OnInit } from '@angular/core';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.page.html',
  styleUrls: ['./delete-employee.page.scss'],
})
export class DeleteEmployeePage implements OnInit {
  avatar: string
  deleteFormGroup: FormGroup
  employeeID: string

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _toastController: ToastController,
    private _alertController: AlertController,
    activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    this.employeeID = activatedRoute.snapshot.params["employeeID"]

    this.deleteFormGroup = formBuilder.group({
      id:[],
      avatarUrl:[],
      name: [],
      email: [],
      job: [],
      description: [],
    })
  }

  ngOnInit() {
    this.deleteFormGroup.disable()

    setTimeout(() => {
      const employee: Employee = this._dataService.readEmployeeById(this.employeeID)

      this.avatar = employee.avatarUrl

      this.deleteFormGroup.setValue({
        id: employee.id,
        avatarUrl: employee.avatarUrl.includes("data:image/jpeg;base64,") ? "" : employee.avatarUrl,
        name: employee.name,
        email: employee.email,
        job: employee.job,
        description: employee.description,
      })
    }, 1500)
  }

  removeEmployee() {
    this._dataService.deleteEmployee(this.employeeID)
    
    const toast = this._toastController.create({
      message: `Funcionário(a) foi removido(a) do sistema`,
      duration: 3500,
      position: "top"
    })
    toast.then(toastMessage => toastMessage.present())
    
    this._router.navigate(["/home"])
  }

  async removeAlert() {
    const alert = await this._alertController.create({
      header: "Apagar funcionário",
      message: "Tem certeza de que deseja apagar esse funcionário?",
      buttons: [
        {
          text: "Não",
          handler: () => this._router.navigate(["/home"])
        },
        {
          text: "Sim",
          handler: () => this.removeEmployee()
        }
      ]
    })

    await alert.present()
  }
}

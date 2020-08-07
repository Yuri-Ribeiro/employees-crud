import { Component, OnInit } from '@angular/core';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.page.html',
  styleUrls: ['./delete-employee.page.scss'],
})
export class DeleteEmployeePage implements OnInit {
  deleteFormGroup: FormGroup
  employeeID: string
  avatar: string
  deleteEmployeeSubscription: Subscription

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
      // embora já tenha disponível acima, não inicializaremos o id pelo mesmo motivo indicado no update-employee
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

    this.deleteEmployeeSubscription = this._dataService.readEmployeeById(this.employeeID)
      .pipe(delay(1500))
      .subscribe( (employee: Employee) => {
        if(employee) {
          this.avatar = employee.avatarUrl

          this.deleteFormGroup.setValue({
            id: employee.id,
            avatarUrl: employee.avatarUrl.includes("data:image/jpeg;base64,") ? "" : employee.avatarUrl,
            name: employee.name,
            email: employee.email,
            job: employee.job,
            description: employee.description,
          })
        } else {
          // quando funcionário for apagado, sairemos da página
          this._router.navigate(["/home"])
        }
      })
  }

  ionViewWillLeave() {
    this.deleteEmployeeSubscription.unsubscribe()
  }

  removeEmployee() {
    this._dataService.deleteEmployee(this.employeeID).subscribe( (firestoreResponse: Promise<any>) => {
      firestoreResponse
        .then( () => {
          const toast = this._toastController.create({
            message: `Funcionário(a) foi removido(a) do sistema`,
            duration: 3500,
            position: "top"
          })
          toast.then(toastMessage => toastMessage.present())
        })
        .catch(error => {
          const toast = this._toastController.create({
            message: `Erro ao apagar: ${error}`,
            duration: 3500,
            position: "top",
            color: "danger"
          })
          toast.then(toastMessage => toastMessage.present())
        })
    })
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

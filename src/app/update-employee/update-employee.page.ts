import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.page.html',
  styleUrls: ['./update-employee.page.scss'],
})
export class UpdateEmployeePage implements OnInit {
  updateFormGroup: FormGroup
  blankAvatar: string
  employeeID: number
  avatar: string

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _camera: Camera,
    formBuilder: FormBuilder
  ) {
    this.blankAvatar = this._dataService.getBlankAvatar()

    setTimeout(() => {
      // Pode haver erro se tentar acessar um usuário recém-criado após atualizar a página; no delete também
      this.employeeID = Number(this._activatedRoute.snapshot.params["employeeID"])
      const employee: Employee = _dataService.readEmployeeById(this.employeeID)

      // é preciso inicializar o avatar agora, para que seja mostrado num primeiro momento
      this.avatar = employee.avatarUrl

      this.updateFormGroup = formBuilder.group({
        id:[{value: employee.id, disabled: true}, Validators.required],
        avatarUrl:[
          // só irá mostrar url se não for uma string com encode Base64
          employee.avatarUrl.includes("data:image/jpeg;base64,") ? "" : employee.avatarUrl
        ],
        name: [employee.name, Validators.required],
        email: [employee.email, Validators.required],
        job: [employee.job],
        description: [employee.description],
      })
    }, 3000)
  }

  ngOnInit() {
    // Também é necessário um setTimeOut aqui, já que updateFormGroup será undefined até o primeiro setTimeOut acabar
    setTimeout(() => {
      this.updateFormGroup.controls['avatarUrl'].valueChanges.subscribe(newAvatarUrl => {
        this.avatar = newAvatarUrl
      })
    }, 3000)
  }

  editEmployee() {
    // O id não fica na propriedade value quando está desativada
    const updatedEmployee: Employee = {
      ...this.updateFormGroup.value,
      avatarUrl: this.avatar
    }
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

  async selectImageSource() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 350,
      correctOrientation: true
    }

    const alert = await this._alertController.create({
      header: "Selecionar fonte",
      message: "Selecione uma imagem a partir da câmera ou da sua galeria",
      buttons: [
        {
          text: "Câmera",
          handler: () => {
            const sourceType = this._camera.PictureSourceType.CAMERA

            this._camera.getPicture({...cameraOptions, sourceType})
              .then(imageData => {
                this.updateFormGroup.patchValue({ avatarUrl: "" })

                this.avatar = `data:image/jpeg;base64,${imageData}`
            })
          }
        },
        {
          text: "Galeria",
          handler: () => {
            const sourceType = this._camera.PictureSourceType.SAVEDPHOTOALBUM

            this._camera.getPicture({...cameraOptions, sourceType})
              .then(imageData => {
                this.updateFormGroup.patchValue({ avatarUrl: "" })
                
                this.avatar = `data:image/jpeg;base64,${imageData}`
            })
          }
        }
      ]
    })

    await alert.present()
  }

}

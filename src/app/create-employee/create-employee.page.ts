import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
})
export class CreateEmployeePage implements OnInit {
  registrationFormGroup: FormGroup
  blankAvatar: string
  avatar: string

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _camera: Camera,
    formBuilder: FormBuilder
  ) {
    this.blankAvatar = this._dataService.getBlankAvatar()

    this.registrationFormGroup = formBuilder.group({
      avatarUrl:[""],
      name: [ , Validators.required],
      email: [ , Validators.required],
      job: [],
      description: [],
    })
  }

  ngOnInit() {
    this.registrationFormGroup.controls['avatarUrl'].valueChanges.subscribe(newAvatarUrl => {
      this.avatar = newAvatarUrl
    })
  }

  register() {
    const newEmployee: Employee = {
      ...this.registrationFormGroup.value,
      avatarUrl: this.avatar
    }
    const wasCreated: boolean = this._dataService.createEmployee(newEmployee)

    const toast = this._toastController.create({
      message: wasCreated?`${newEmployee.name} foi cadastrado com sucesso`:`Usuário já está cadastrado`,
      duration: 3500,
      position: "top",
      color: wasCreated?undefined:"danger"
    })
    toast.then(toastMessage => toastMessage.present())
    
    if(wasCreated)
      this._router.navigate(["/home"])
  }

  async selectImageSource() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      // DATA_URL: a imagem será salva como uma string, com o método de codificação Base64
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetHeight: 350,
      // a orientação da imagem ficará correta, independentimente a foto foi batida em modo paisagem ou não
      correctOrientation: true
    }

    const alert = await this._alertController.create({
      header: "Selecionar fonte",
      message: "Selecione uma imagem a partir da câmera ou da sua galeria",
      buttons: [
        {
          text: "Câmera",
          handler: () => {
            // indica que a fonte é a câmera
            const sourceType = this._camera.PictureSourceType.CAMERA

            this._camera.getPicture({...cameraOptions, sourceType})
              .then(imageData => {
                // caso a imagem seja selecionada, o imput de URL do Avatar será limpo
                // É importante que limpe o imput avatarUrl primeiro, pois essa mudança disparará o evento de mudança, que irá atualizar a variável avatar para ""
                this.registrationFormGroup.patchValue({ avatarUrl: "" })

                this.avatar = `data:image/jpeg;base64,${imageData}`
            })
          }
        },
        {
          text: "Galeria",
          handler: () => {
            // indica que a fonte é a galeria
            const sourceType = this._camera.PictureSourceType.SAVEDPHOTOALBUM

            this._camera.getPicture({...cameraOptions, sourceType})
              .then(imageData => {
                this.registrationFormGroup.patchValue({ avatarUrl: "" })
                
                this.avatar = `data:image/jpeg;base64,${imageData}`
            })
          }
        }
      ]
    })

    await alert.present()
  }
}

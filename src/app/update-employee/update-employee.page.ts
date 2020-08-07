import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.page.html',
  styleUrls: ['./update-employee.page.scss'],
})
export class UpdateEmployeePage implements OnInit {
  updateFormGroup: FormGroup
  employeeID: string
  avatar: string
  originalAvatarUrl: string
  updateTemplateAvatarSubscription: Subscription

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _camera: Camera,
    activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    // como os dados ainda não são persistidos, haverá erro se atualizar a aplicação e tentar acessar um usuário recém-criado
    this.employeeID = activatedRoute.snapshot.params["employeeID"]

    this.updateFormGroup = formBuilder.group({
      // por conveniência, não iremos inicializar o id abaixo com o valor id já recebido, pois ele é ideal para que, no template, testemos se
      // o formulário já preenchido
      id:[{value: null, disabled: true}, Validators.required],
      avatarUrl:[],
      name: [, Validators.required],
      email: [, Validators.required],
      job: [],
      description: []
    })
  }

  ngOnInit() {
    // quando a Url no campo do formulário mudar, o avatar do template será atualizado em tempo real. Se for uma string vazia, voltará a ser a original.
    this.updateTemplateAvatarSubscription = this.updateFormGroup.controls['avatarUrl'].valueChanges.subscribe(newAvatarUrl => {
      this.avatar = newAvatarUrl == "" ? this.originalAvatarUrl: newAvatarUrl
    })

    setTimeout(() => {
      const employee: Employee = this._dataService.readEmployeeById(this.employeeID)

      this.originalAvatarUrl = employee.avatarUrl

      this.updateFormGroup.setValue({
        id: employee.id,
        // só irá mostrar url se não for uma string com encode Base64
        avatarUrl: employee.avatarUrl.includes("data:image/jpeg;base64,") ? "" : employee.avatarUrl,
        name: employee.name,
        email: employee.email,
        job: employee.job,
        description: employee.description,
      })
    }, 1500)
  }

  // a abordagem de desinscrever-se é desejada, pois, quando uma página é retirada da pilha de navegação, ela deve ser destruída, mas isso pode não acontecer
  // instantaneamente. Portanto, forçar seus Observables a cancelar a inscrição quando uma página deixa de ser exibida é uma maneira de evitar várias
  // inscrições desnecessárias.
  ionViewWillLeave() {
    this.updateTemplateAvatarSubscription.unsubscribe()
  }

  editEmployee() {
    // O id não fica na propriedade value quando está desativada
    const updatedEmployee: Employee = {
      ...this.updateFormGroup.value,
      avatarUrl: this.avatar
    }
    const wasUpdated: boolean = this._dataService.updateEmployee({...updatedEmployee, id: this.employeeID})
    
    const toast = this._toastController.create({
      message: wasUpdated?`Os dados de ${updatedEmployee.name} foram atualizados`:`Email fornecido já está cadastrado para outro funcionário`,
      duration: 3500,
      position: "top",
      color: wasUpdated?undefined:"danger"
    })
    toast.then(toastMessage => toastMessage.present())
    
    if(wasUpdated)
      this._router.navigate(["/home"])
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

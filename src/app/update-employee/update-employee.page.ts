import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService, Employee } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';

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
    this.employeeID = activatedRoute.snapshot.params["employeeID"]

    this.updateFormGroup = formBuilder.group({
      // por conveniência, não iremos inicializar o id abaixo com o valor id já recebido, pois ele é ideal para que, no template, testemos se já
      // foi emitido algum valor no observable retornado de readEmployeeById que iremos se inscrever. Ideal porque estará desativado, portanto o
      // usuário não poderá modificá-lo. Assim evitamos mais incrições e complexidade
      id:[{value: null, disabled: true}, Validators.required],
      avatarUrl:[],
      name: [, Validators.required],
      email: [, [Validators.required, Validators.email]],
      job: [],
      description: [],
    })
  }

  ngOnInit() {
    // quando a Url no campo do formulário mudar, o avatar do template será atualizado em tempo real. Se for uma string vazia, voltará a ser a original.
    this.updateTemplateAvatarSubscription = this.updateFormGroup.controls['avatarUrl'].valueChanges.subscribe(newAvatarUrl => {
      this.avatar = newAvatarUrl == "" ? this.originalAvatarUrl: newAvatarUrl
    })

    // preencheremos o formulário uma única vez, já que a intenção é atualizar, não mostrar o dado mais recente
    this._dataService.readEmployeeById(this.employeeID).pipe(
      take(1),
      delay(1500)
      )
      .subscribe( (employee: Employee) => {
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
      })
  }

  // a abordagem de desinscrever-se é desejada, pois, quando uma página é retirada da pilha de navegação, ela deve ser destruída, mas isso pode não acontecer
  // instantaneamente. Portanto, forçar seus Observables a cancelar a inscrição quando uma página deixa de ser exibida é uma maneira de evitar várias
  // inscrições desnecessárias.
  
  // Esse problema, agora pode ser simulado facilmente na página delete, removendo o unsubscribe, dando um console.log na callback
  // de subscribe ou dentro do pipe presente  em readEmployeeById e, em seguida, atualizando o funcionário em questão diretamente pelo firestore.
  // Ao abrir a página de delete e voltar pra home várias vezes, percebe-se que vai se acumulando a quantidade de inscrições.
  ionViewWillLeave() {
    this.updateTemplateAvatarSubscription.unsubscribe()
  }

  editEmployee() {
    // O id não fica na propriedade value quando está desativada
    const updatedEmployee: Employee = {
      ...this.updateFormGroup.value,
      avatarUrl: this.avatar
    }

    this._dataService.updateEmployee({...updatedEmployee, id: this.employeeID})
      .subscribe( (firestoreResponse: Promise<any>) => {
        firestoreResponse
          .then( () => {
            const toast = this._toastController.create({
              message: `Os dados de ${updatedEmployee.name} foram atualizados`,
              duration: 3500,
              position: "top"
            })
            toast.then(toastMessage => toastMessage.present())

            this._router.navigate(["/home"])
          })
          .catch( error => {
              // Documento provavelmente não existe
              const toast = this._toastController.create({
                message: `Erro ao atualizar: ${error}`,
                duration: 3500,
                position: "top",
                color: "danger"
              })
              toast.then(toastMessage => toastMessage.present())
          })
      })
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

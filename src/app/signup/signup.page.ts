import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService, LoginCredentials } from '../services/login.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupFormGroup: FormGroup

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _toastController: ToastController,
    formBuider: FormBuilder
  ){
    this.signupFormGroup = formBuider.group({
      email: ["", [Validators.required, Validators.email]],
      // Firebase requer uma senha de no mínimo 6 caracteres
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
  }

  signup() {
    const newUserCredentials: LoginCredentials = this.signupFormGroup.value;

    this._loginService.signup(newUserCredentials)
      .then( authData => {
        // quando a nova conta for criada, o usuário será logado automaticamente. Esse é um comportamento padrão da função createUserWithEmailAndPassword
        this._router.navigate(["/home"])
        // dados que podem ser úteis após login
        console.log(authData)
      })
      .catch( authError => {
        const toast = this._toastController.create({
          message: `${authError}`,
          duration: 3500,
          position: "top",
          color: "danger"
        })

        toast.then( toastMessage => toastMessage.present() )
      })
  }
}
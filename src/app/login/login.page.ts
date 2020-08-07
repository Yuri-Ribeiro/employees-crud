import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCredentials, LoginService } from '../services/login.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginFormGroup: FormGroup

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _toastController: ToastController,
    formBuilder: FormBuilder
  ){
    this.loginFormGroup = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  ngOnInit() {
  }

  login() {
    const loginCredentials: LoginCredentials = this.loginFormGroup.value;

    this._loginService.login(loginCredentials)
      .then( authData => {
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

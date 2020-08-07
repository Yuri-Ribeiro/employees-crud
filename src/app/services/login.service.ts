import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _angularFireAuth: AngularFireAuth) { }

  login(credentials: LoginCredentials): Promise<any>{
    return this._angularFireAuth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    )
  }
}

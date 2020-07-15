import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CanEnterLoginPageGuard implements CanActivate {
  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // authState permite verificar o estado atual de autenticação do usuário
    const isLogged: Observable<boolean> = this._angularFireAuth.authState.pipe(
      // deve ser importado de "rxjs/operators". O autoimport do VS Code pode não funcionar
      map( auth => {
        // se o objeto auth existir, então não poderá entrar na página Login. Será redirecionado para a página Home
        if(auth) {
          this._router.navigate(["/home"])
          return false
        } else
          return true
      })
    );

    return isLogged;
  }
  
}

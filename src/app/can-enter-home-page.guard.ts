import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CanEnterHomePageGuard implements CanActivate {
  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLogged: Observable<boolean> = this._angularFireAuth.authState.pipe(
      map( auth => {
        if(!auth) {
          this._router.navigate(["/login"])
          return false
        }
        else {
          return true
        }
      })
    )
    
    return isLogged
  }
  
}

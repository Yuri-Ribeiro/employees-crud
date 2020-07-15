import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanEnterLoginPageGuard } from './can-enter-login-page.guard';
import { CanEnterHomePageGuard } from './can-enter-home-page.guard';

const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'employee-detail/:employeeID',
        loadChildren: () => import('./employee-detail/employee-detail.module').then( m => m.EmployeeDetailPageModule)
      },
      {
        path: 'create-employee',
        loadChildren: () => import('./create-employee/create-employee.module').then( m => m.CreateEmployeePageModule)
      },
      {
        path: 'update-employee/:employeeID',
        loadChildren: () => import('./update-employee/update-employee.module').then( m => m.UpdateEmployeePageModule)
      },
      {
        path: 'delete-employee/:employeeID',
        loadChildren: () => import('./delete-employee/delete-employee.module').then( m => m.DeleteEmployeePageModule)
      },
    ],
    canActivate: [CanEnterHomePageGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [CanEnterLoginPageGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

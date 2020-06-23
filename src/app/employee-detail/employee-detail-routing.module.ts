import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDetailPage } from './employee-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeDetailPageRoutingModule {}

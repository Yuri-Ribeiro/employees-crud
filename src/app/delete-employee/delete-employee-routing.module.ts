import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteEmployeePage } from './delete-employee.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteEmployeePageRoutingModule {}

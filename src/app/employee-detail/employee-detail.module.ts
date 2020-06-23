import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeDetailPageRoutingModule } from './employee-detail-routing.module';

import { EmployeeDetailPage } from './employee-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeDetailPageRoutingModule
  ],
  declarations: [EmployeeDetailPage]
})
export class EmployeeDetailPageModule {}

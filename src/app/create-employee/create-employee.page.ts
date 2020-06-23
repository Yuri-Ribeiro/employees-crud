import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
})
export class CreateEmployeePage implements OnInit {
  registrationFormGroup: FormGroup
  blankAvatar: string

  constructor(
    formBuider: FormBuilder,
    dataService: DataService
  ) {
    this.registrationFormGroup = formBuider.group({
      avatarURL:[""],
      name: ["", Validators.required],
      email: ["", Validators.required],
      job: [""],
      description: [""],
    })

    this.blankAvatar = dataService.getBlankAvatar()
  }

  ngOnInit() {
  }

}

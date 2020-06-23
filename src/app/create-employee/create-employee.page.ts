import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
})
export class CreateEmployeePage implements OnInit {
  registrationFormGroup: FormGroup
  blankAvatar: string = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

  constructor(
    formBuider: FormBuilder,
  ) {
    this.registrationFormGroup = formBuider.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      admissionDate: [""],
      job: [""],
      avatarURL:[""],
    })
  }

  ngOnInit() {
  }

}

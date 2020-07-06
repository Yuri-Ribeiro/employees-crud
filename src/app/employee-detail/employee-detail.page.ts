import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Employee } from '../services/data.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {
  employee: Employee

  constructor(
    private _data: DataService,
    private _activatedRoute: ActivatedRoute,
    private _socialSharing: SocialSharing
  ) {
    setTimeout(() => {
      const employeeID: number = Number(_activatedRoute.snapshot.params['employeeID'])
      this.employee = this._data.readEmployeeById(employeeID)
    }, 3000)
  }

  ngOnInit() {
  }

  share() {
    this._socialSharing.share(
`Olha esse(a) funcionário(a) que quero compartilhar com você:
Nome: ${this.employee.name}
Email: ${this.employee.email}
Cargo: ${this.employee.job?this.employee.job:"Não especificado"}`,
      // Esse parâmetro de "assunto" aparecerá somente para compartilhamento em aplicativos de email
      `Funcionário(a) ${this.employee.name}`,
      // Arquivo a ser compartilhado. Pode ser uma url de imagem, ou uma Base64. No final, a própria imagem será compartilhada.
      this.employee.avatarUrl
    )
  }
}

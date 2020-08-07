import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Employee } from '../services/data.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {
  employeeObservable: Observable<Employee>

  constructor(
    private _socialSharing: SocialSharing,
    activatedRoute: ActivatedRoute,
    dataService: DataService
  ) {
    const employeeID = activatedRoute.snapshot.params['employeeID']

    this.employeeObservable = dataService.readEmployeeById(employeeID).pipe(delay(1500))
  }

  ngOnInit() {
  }

  // para evitar outra assinatura, iremos receber do template os dados atuais que o usuário quer compartilhar
  share(employee: Employee) {
    this._socialSharing.share(
`Olha esse(a) funcionário(a) que quero compartilhar com você:
Nome: ${employee.name}
Email: ${employee.email}
Cargo: ${employee.job?employee.job:"Não especificado"}`,
      // Esse parâmetro de "assunto" aparecerá somente para compartilhamento em aplicativos de email
      `Funcionário(a) ${employee.name}`,
      // Arquivo a ser compartilhado. Pode ser uma url de imagem, ou uma Base64. No final, a própria imagem será compartilhada.
      employee.avatarUrl
    )
  }
}

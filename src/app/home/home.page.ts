import { Component } from '@angular/core';
import { DataService, Employee } from '../services/data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // como a página home é uma única em que o usuário vai, a partir dela, indo para outras e sempre acaba voltando pra home de novo, não há necessidade
  // de cancelarmos a inscrição quando o usuário ir pra outra página.
  employeesObservable: Observable<Employee[]>
  
  constructor(
    private _router: Router,
    dataService: DataService
  ) {
    // poderemos trabalhar com Observable diretamente do template.
    // delay atrasa a emissão. Iremos atrasar em 1500ms para que o skeleton, por questões de estética da aplicação, não suma rapidamente
    this.employeesObservable = dataService.readEmployees().pipe(
      delay(1500),
      // ordenaremos os funcionários diretamente no observable
      map(this.sortEmployeeByname)
    )

    // // o código abaixo mostra uma versão que, de fato, estipula um tempo mínimo de exibição. Dois Observables são combinados, timer, que emite um
    // // número depois de um tempo estipulado (com ele definimos a duração mínima), e o segundo Observable que faz a chamada de API real, retornando
    // // os dados que desejamos. Cada um desses dois Observables ​​emite apenas um valor antes de ser concluído. A ordem desses dois observáveis ​​de
    // // entrada não importa; eles são tratados igualmente. Combinando os dois observáveis ​​de entrada, combineLatest cria um novo Observable que
    // // retorna um valor combinado somente quando os dois observáveis ​​de entrada emitem valores.
    // // necessário importar de 'rxjs' timer e combineLatest
    // this.employeesObservable = combineLatest(timer(1500), this._dataService.readEmployees()).pipe(
    //   map(combinedObservables => combinedObservables[1]),
    //   map(this.sortEmployeeByname)
    // )
  }

  // ordena funcionários por ordem alfabética
  sortEmployeeByname(employees: Employee[]): Employee[] {
    return employees.sort( (employeeA, employeeB) => {
      return employeeA.name.toLowerCase().localeCompare(employeeB.name.toLowerCase())
    })
  }

  navigateToUpdateEmployee(employeeID: string) {
    this._router.navigate([`/home/update-employee/${employeeID}`])
  }
  
  navigateToDeleteEmployee(employeeID: string) {
    this._router.navigate([`/home/delete-employee/${employeeID}`])
  }
}

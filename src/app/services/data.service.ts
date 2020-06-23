import { Injectable } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  job: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public employees: Employee[] = [
    {
      id: 0,
      name: 'Aline Regina',
      email: 'alineregina@taubate.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027367_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Programadora"
    },
    {
      id: 1,
      name: 'Henrique Lucca',
      email: 'henriquelucca@abcmail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2016/04/01/11/25/avatar-1300331_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Engenheiro"
    },
    {
      id: 2,
      name: 'Larissa Aline',
      email: 'larissaaline@alunos.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/03/01/22/18/avatar-2109804_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Secretária"
    },
    {
      id: 3,
      name: 'Jorge Melo',
      email: 'jorgemelo@amaral.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Promotor de vendas"
    },
    {
      id: 4,
      name: 'Victor Benedito',
      email: 'victorbenedito@zymail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2016/11/01/21/11/avatar-1789663_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Contador"
    },
    {
      id: 5,
      name: 'Mateus Geraldo',
      email: 'mateusgeraldo@cdmail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Programador"
    },
    {
      id: 6,
      name: 'Alícia Alana',
      email: 'aliciaalana@cdmail.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/01/31/19/07/avatar-2026510_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Executiva"
    },
    {
      id: 7,
      name: 'Emily Cláudia',
      email: 'emilyclaudia@alunos.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Enfermeira"
    }
  ];

  constructor() { }

  public getEmployees(): Employee[] {
    return this.employees;
  }

  public getBlankAvatar(): string {
    const blankAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    return blankAvatar
  }
  
  public getEmployeeById(id: number): Employee {
    return this.employees[id];
  }

}

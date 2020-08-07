import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, concatAll, take } from 'rxjs/operators';

export interface Employee {
  // opcional, já que id não estará presente necessariamente em Employee (o documento do Firestore não terá essa propriedade, já que é o
  // próprio ID do documento). Só colocaremos quando conveniente, por meio de pipe() e map().
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  job?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // algumas vezes, foi usada a terminologia Observable para deixar o código mais claro.
  // tipos exatos foram usados algumas vezes para uma melhor ajuda da IDE.
  employeesCollectionRefObservable: Observable<AngularFirestoreCollection<firebase.firestore.DocumentData>>

  // Para adicionar funcionários mockados ao Firestore: após criar função createEmployee, descomentar, juntamente com o código presente no construtor.
  public employees: Employee[] = [
    {
      // serão usados agora os IDs gerados automaticamente pelo Firestore, por isso esses estão comentados. No processo de transição, no entanto, pode ser
      // conveniente mantê-los provisoriamente.
      // id: 0,
      name: 'Aline Regina',
      email: 'alineregina@taubate.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027367_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Programadora"
    },
    {
      // id: 1,
      name: 'Henrique Lucca',
      email: 'henriquelucca@abcmail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2016/04/01/11/25/avatar-1300331_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Engenheiro"
    },
    {
      // id: 2,
      name: 'Larissa Aline',
      email: 'larissaaline@alunos.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/03/01/22/18/avatar-2109804_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Secretária"
    },
    {
      // id: 3,
      name: 'Jorge Melo',
      email: 'jorgemelo@amaral.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Promotor de vendas"
    },
    {
      // id: 4,
      name: 'Victor Benedito',
      email: 'victorbenedito@zymail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2016/11/01/21/11/avatar-1789663_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Contador"
    },
    {
      // id: 5,
      name: 'Mateus Geraldo',
      email: 'mateusgeraldo@cdmail.com',
      avatarUrl: "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Programador"
    },
    {
      // id: 6,
      name: 'Alícia Alana',
      email: 'aliciaalana@cdmail.com.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2017/01/31/19/07/avatar-2026510_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Executiva"
    },
    {
      // id: 7,
      name: 'Emily Cláudia',
      email: 'emilyclaudia@alunos.br',
      avatarUrl: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_960_720.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      job: "Enfermeira"
    }
  ];

  constructor(
    angularFireAuth: AngularFireAuth,
    angularFirestore: AngularFirestore
  ) {
    // iremos repassar os Observables para os componentes que injetam esse serviço, pois é uma boa prática que serviços não tenha inscrições explícitas.
    // Pegaremos a referência para a coleção de funcionários do usuário logado. Para isso, precisaremos fazer de forma assíncrona (algo exigido pelo Firebase
    // em suas últimas versões. Assim, garante-se compatibilidade com o modelo de banco de dados em tempo real).
    this.employeesCollectionRefObservable = angularFireAuth.authState.pipe(
      map( currentUser => {
          return angularFirestore
            .collection("users")
            .doc(currentUser.uid)
            .collection("employees")
      })
    )

    // // para adicionar funcionário mockados
    // this.employees.forEach( employee => {
    //   this.createEmployee(employee)
    //     .subscribe( (firestoreResponse: Promise<any>) => {
    //       firestoreResponse
    //         .then( () => console.log(`Funcionário mockado ${employee.name} adicionado!`))
    //         .catch( error => console.log(`Erro ao adicionar funcionário mockado ${employee.name}: ${error}`))
    //     })
    // })
  }

  public getBlankAvatar(): string {
    const blankAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    return blankAvatar
  }

  // Como trabalharemos com banco de dados em tempo real, os componentes irão esperar mudanças externas, portanto irão se inscrever nos Observables,
  // aguardando mudanças externas.
  // usar valueChanges é ideal para trabalhar com o banco de dados em tempo real. Uma alteração no banco de dados refletirá automaticamente na aplicação.
  public readEmployees(): Observable<Employee[]> {
    const observableDeOrdemSuperior = this.employeesCollectionRefObservable.pipe(
      map( (employeesCollectionRef: any)  => {
        // iremos colocar em cada funcionário a propriedade 'id', que será o id do próprio documento. Podemos usar o recurso do idField.
          return employeesCollectionRef.valueChanges(
            { idField: 'id' }
          )
      })
    )

    // concatAll: converte um Observable de ordem superior em um Observable de primeira ordem, concatenando os Observables ​​internos em ordem.
    // Se não o usássemos, teriamos um Observable retornando um outro; ou teriamos de se inscrever em um observable dentro de outro. Ambas podem ser
    // consideradas más práticas. Mais informações: https://rxjs-dev.firebaseapp.com/api/operators/concatAll
    const observableDePrimeiraOrdem: Observable<Employee[]> = observableDeOrdemSuperior.pipe(concatAll())
    return observableDePrimeiraOrdem
  }

  public readEmployeeById(employeeID: string): Observable<Employee> {
    const observableDeOrdemSuperior = this.employeesCollectionRefObservable.pipe(
      map( (employeesCollectionRef: any) => {
        return employeesCollectionRef
          .doc(employeeID)
          .valueChanges() // retorna um Observable
          .pipe(
            map( (employee: Employee) => {
              // alguns comportamentos dependem se existe ou não determinado funcionário. undefined será retornado quando não existir.
              if(employee) {
                // infelizmente, até o momento, o recurso do idField só funciona com coleções, por isso iremos colocar o campo id manualmente no documento.
                return {...employee, id: employeesCollectionRef.doc(employeeID).ref.id}
              }
            })
          )
      })
    )

    const observableDePrimeiraOrdem: Observable<Employee> = observableDeOrdemSuperior.pipe(concatAll())
    return observableDePrimeiraOrdem
  }

  public createEmployee(newEmployee: Employee): Observable<Promise<any>> {
    if(!newEmployee.avatarUrl) newEmployee.avatarUrl = this.getBlankAvatar()

    //emails serão guardados em minúsculo para facilitar checagem se já existe
    newEmployee.email = newEmployee.email.toLowerCase()
      
    return this.employeesCollectionRefObservable.pipe(
      // como não há necessidade de uma inscrição prolongada para mais de uma emissão, as inscrições irão receber apenas um valor (usamos take(1) para isso), tirando a necessidade
      // de unsubscribe nos inscritores
      // mais sobre take: https://rxjs-dev.firebaseapp.com/api/operators/take
      take(1),
      map( (employeesCollectionRef: any) => {
        return employeesCollectionRef
          .ref
          // checar se já existe um documento com o email desejado
          .where("email", "==", newEmployee.email) 
          .get()
          .then(whereResult => {
            // como add retorna uma Promise, iremos manter o padrão
            return new Promise( (resolve, reject) => {
              // senão houver ou não um documento com o email
              if(whereResult.empty){
                resolve( employeesCollectionRef.add(newEmployee) )
              } else
                reject("funcionário já cadastrado")
            })
          })
      })
    )
  }

  public updateEmployee(updatedEmployee: Employee): Observable<Promise<any>> {
    if(!updatedEmployee.avatarUrl) updatedEmployee.avatarUrl = this.getBlankAvatar()

    updatedEmployee.email = updatedEmployee.email.toLowerCase()

    return this.employeesCollectionRefObservable.pipe(
      take(1),
      map( (employeesCollectionRef: any) => {
        return employeesCollectionRef
          .ref
          // checar se já existe um documento com o email desejado
          .where("email", "==", updatedEmployee.email) 
          .get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              // checa se email novo não existe ou, se existir, permanece o mesmo do usuário
              if(whereResult.empty || whereResult.docs[0].ref.id == updatedEmployee.id){
                // como não vamos precisar do id como atributo no dado em si
                const employeeID = updatedEmployee.id
                delete updatedEmployee.id

                resolve(
                  employeesCollectionRef
                    .doc(employeeID)
                    .update(updatedEmployee)
                )
              } else
                reject("email fornecido já está cadastrado para outro funcionário")
            })
          })
      })
    )
  }

  public deleteEmployee(employeeID: string): Observable<Promise<any>> {
    // Cloud Firestore não remove automaticamente os documentos nas subcoleções dele. Esses precisam ser removidos manualmente. Não é nosso caso, de
    // qualquer forma. Mais informações:https://firebase.google.com/docs/firestore/manage-data/delete-data
    return this.employeesCollectionRefObservable.pipe(
      take(1),
      map( (employeesCollectionRef: any) => {
        return employeesCollectionRef
          .doc(employeeID)
          .delete()
      })
    )
  }
}

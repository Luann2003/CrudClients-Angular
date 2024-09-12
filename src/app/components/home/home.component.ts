import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

import { Iclient } from '../../Iclients';
import { Observable, tap } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators, FormControl, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  clientId: number | null = null;
  client: Iclient | null = null;
  clients: Iclient[] = [];;
  clientIdError: string | null = null;

  public getClientDelete = this.homeService.deleteClientId;



  apiUrl = signal(environment.apiUrl);  

  constructor(private homeService: HomeService) { }

  clientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    cpf: new FormControl('', [Validators.required, this.cpfValidator]),
    income: new FormControl('', [Validators.required, this.incomeValidator]),
    birthDate: new FormControl('', Validators.required),
    children: new FormControl('', [Validators.required, Validators.min(0)])
  });

  ngOnInit(): void {
    this.loadClients();  
  }

  loadClients(): void {
    this.homeService.getClients().subscribe({
      next: (response) => {
        this.clients = response.content;
      },
      error: (err) => {
        console.error('Error fetching client list', err);
      }
    });
  }

  getClientById(): void {
  if (this.clientId !== null) {
    this.homeService.getClientsById(this.clientId).subscribe({
      next: (response) => {
        this.client = response;
        this.clientIdError = null;  // Limpa o erro se a requisição for bem-sucedida
      },
      error: (err) => {
        if (err.status === 404) {
          this.clientIdError = 'Cliente não encontrado';  // Mensagem personalizada para erro 404
        } 
        else {
          this.clientIdError = 'Ocorreu um erro ao buscar o cliente';  // Mensagem genérica para outros erros
        }
        this.client = null;  
      }
    });
  }
}

onSubmit(): void {
  if (this.clientForm.valid) {
    const formData = this.clientForm.value;
    this.homeService.postClient(formData).subscribe({
      next: () => {
        this.loadClients(); // Atualiza a lista após a inserção
      },
      error: (error) => console.log(error)
    });
  } else {
    console.log('Formulário inválido');
  }
}
  
  
  public deleteClientId(id: number): void {
    this.homeService.deleteClientId(id).subscribe({
      next: () => {
        this.loadClients(); 
      },
      error: (error) => console.log(error)
    });
  }  

  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    const cpfRegex = /^\d{11}$/;
    return cpfRegex.test(cpf) ? null : { invalidCpf: 'CPF deve ter 11 dígitos numéricos' };
  }

  incomeValidator(control: AbstractControl): ValidationErrors | null {
    const income = control.value;
    const incomeRegex = /^[0-9]+$/;
    return incomeRegex.test(income) ? null : { invalidIncome: 'Income deve conter apenas números' };
  }

  get name() { return this.clientForm.get('name'); }
  get cpf() { return this.clientForm.get('cpf'); }
  get income() { return this.clientForm.get('income'); }
  get birthDate() { return this.clientForm.get('birthDate'); }
  get children() { return this.clientForm.get('children'); }

}

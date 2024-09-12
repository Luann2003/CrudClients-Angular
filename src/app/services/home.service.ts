import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Iclient } from '../Iclients';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  url = signal(environment.apiUrl);
  constructor(private http: HttpClient) { }

  getClients(): Observable<{ content: Iclient[] }> {
    return this.http.get<{ content: Iclient[] }>(this.url());
  }

  getClientsById(id: number): Observable<Iclient> {
    return this.http.get<Iclient>(`${this.url()}/${id}`).pipe(
      catchError((e : HttpErrorResponse) => {
        return throwError(() => e)
      }
    ));
  }

  postClient(form: any): Observable<Iclient> {
    return this.http.post<Iclient>(this.url(), form).pipe(
    );
  }

  #setClientDelete = signal<Iclient | null>(null)
  get getClientDelete(){
    return this.#setClientDelete.asReadonly();
  }
  deleteClientId(id: number): Observable<Iclient>{
    return this.http.delete<Iclient>(`${this.url()}/${id}`).pipe(
      tap((res) => this.#setClientDelete.set(res))
    )}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Idol } from '../models/idol';

@Injectable({
  providedIn: 'root'
})
export class IdolService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/idol/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getIdol(param: {
    name?: string,
    member_amount?: number,
    gender?: number,
    order_by?: string,
    seq?: string
  }
  ): Observable<Idol[]> {
    var queryParam:string = '';
    if (param.name != undefined) {
      queryParam = '?name=' + param.name;
    }
    if (param.member_amount != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'member_amount=' + param.member_amount;
    }
    if (param.gender != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'gender=' + param.gender;
    }
    if (param.order_by != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'order_by=' + param.order_by;
      if (param.seq != undefined) {
        queryParam += '&seq=' + param.seq;
      }
    }

    return this.http.get<Idol[]>(this.baseUrl + 'getIdol.php' + queryParam, this.httpOptions).pipe(
      tap(_ => this.log('fetched idols')),
      catchError(this.handleError<Idol[]>('getIdol', []))
    );
  }

  getSpecificIdol(idol_id: number): Observable<Idol> {
    return this.http.get<Idol>(this.baseUrl + 'getSpecificIdol.php', { ...this.httpOptions, params: new HttpParams().append('idol_id', idol_id) }).pipe(
      tap(_ => this.log('fetched idol')),
      catchError(this.handleError<Idol>('getSpecificIdol'))
    );
  }

  addIdol(name: string, gender: number, member_amount: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'addIdol.php', { name, gender, member_amount, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`addIdol w/ id=${token}`)),
      catchError(this.handleError<boolean>('addIdol'))
    );
  }

  updateIdol(name: string, gender: number, member_amount: number, idol_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updateIdol.php', { name, gender, member_amount, idol_id, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`updateIdol w/ id=${token}`)),
      catchError(this.handleError<boolean>('updateIdol'))
    );
  }

  deleteIdol(idol_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'deleteIdol.php', { idol_id, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`deleteIdol w/ id=${token}`)),
      catchError(this.handleError<boolean>('deleteIdol'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      console.log(error.message);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/user/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getAdmin(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'getAdmin.php', this.httpOptions).pipe(
      tap(_ => this.log('fetched User')),
      catchError(this.handleError<User[]>('getAdmin'))
    );
  }

  getUserDetail(user_id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'getUserDetail.php', { ...this.httpOptions, params: new HttpParams().append('user_id', user_id) }).pipe(
      tap(_ => this.log('fetched User')),
      catchError(this.handleError<User>('getUserDetail'))
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

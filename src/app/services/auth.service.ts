import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/auth/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<string> {
    return this.http.post(this.baseUrl + 'login.php', { email, password }, { ...this.httpOptions, responseType: "text" }).pipe(
      tap((token: string) => this.log(`log in w/ id=${token}`)),
      catchError(this.handleError<string>('login'))
    );
  }

  logout(): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'logout.php', { "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`log out w/ id=${token}`)),
      catchError(this.handleError<boolean>('logout'))
    );
  }

  changePassword(password:string): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updatePassword.php', { "Authorization": token, password }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`update password w/ id=${token}`)),
      catchError(this.handleError<boolean>('updatePassword'))
    );
  }

  getUserDetail(): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'getUserDetail.php', { "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`log out w/ id=${token}`)),
      catchError(this.handleError<boolean>('logout'))
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

      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Fanbase } from '../models/fanbase';

@Injectable({
  providedIn: 'root'
})
export class FanbaseService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/fanbase/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getFanbase(name?: string, email?: string, twitter_username?: string, instagram_username?: number, facebook_link?: number): Observable<Fanbase[]> {
    var httpParams: HttpParams = new HttpParams();
    if (name != undefined) {
      httpParams.append('name', name);
    }
    if (email != undefined) {
      httpParams.append('email', email);
    }
    if (twitter_username != undefined) {
      httpParams.append('twitter_username', twitter_username);
    }
    if (instagram_username != undefined) {
      httpParams.append('instagram_username', instagram_username);
    }
    if (facebook_link != undefined) {
      httpParams.append('facebook_link', facebook_link);
    }

    return this.http.get<Fanbase[]>(this.baseUrl + 'getFanbase.php', { ...this.httpOptions, params: httpParams }).pipe(
      tap(_ => this.log('fetched fanbases')),
      catchError(this.handleError<Fanbase[]>('getFanbase', []))
    );
  }

  getSpecificFanbase(fanbase_id: number): Observable<Fanbase> {
    return this.http.get<Fanbase>(this.baseUrl + 'getSpecificFanbase.php', { ...this.httpOptions, params: new HttpParams().append('fanbase_id', fanbase_id) }).pipe(
      tap(_ => this.log('fetched fanbase')),
      catchError(this.handleError<Fanbase>('getSpecificFanbase'))
    );
  }

  addFanbase(name: string, email: string, twitter_username: string, instagram_username: string, facebook_link: string): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'addFanbase.php', { name, email, twitter_username, instagram_username, facebook_link, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`addFanbase w/ id=${token}`)),
      catchError(this.handleError<boolean>('addFanbase'))
    );
  }

  updateFanbase(name: string, email: string, twitter_username: string, instagram_username: string, facebook_link: string, fanbase_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updateFanbase.php', { name, fanbase_id, email, twitter_username, instagram_username, facebook_link, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`updateFanbase w/ id=${token}`)),
      catchError(this.handleError<boolean>('updateFanbase'))
    );
  }

  deleteFanbase(fanbase_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'deleteFanbase.php', { fanbase_id, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`deleteFanbase w/ id=${token}`)),
      catchError(this.handleError<boolean>('deleteFanbase'))
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

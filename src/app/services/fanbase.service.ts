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

  getFanbase(
    param: {
      name?: string,
      email?: string,
      twitter_username?: string,
      instagram_username?: string,
      facebook_link?: string,
      order_by?: string,
      seq?: string
    }
  ): Observable<Fanbase[]> {
    var queryParam:string = '';
    if (param.name != undefined) {
      queryParam = '?name=' + param.name;
    }
    if (param.email != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'email=' + param.email;
    }
    if (param.twitter_username != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'twitter_username=' + param.twitter_username;
    }
    if (param.instagram_username != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'instagram_username=' + param.instagram_username;
    }
    if (param.facebook_link != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'facebook_link=' + param.facebook_link;
    }
    if (param.order_by != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'order_by=' + param.order_by;
      if (param.seq != undefined) {
        queryParam += '&seq=' + param.seq;
      }
    }

    return this.http.get<Fanbase[]>(this.baseUrl + 'getFanbase.php' + queryParam, this.httpOptions).pipe(
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

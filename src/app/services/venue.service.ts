import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Venue } from '../models/venue';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/venue/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getVenue(name?: string, address?: string): Observable<Venue[]> {
    var httpParams: HttpParams = new HttpParams();
    if (name != undefined) {
      httpParams.append('name', name);
    }
    if (address != undefined) {
      httpParams.append('address', address);
    }

    return this.http.get<Venue[]>(this.baseUrl + 'getVenue.php', { ...this.httpOptions, params: httpParams }).pipe(
      tap(_ => this.log('fetched Venues')),
      catchError(this.handleError<Venue[]>('getVenue', []))
    );
  }

  getSpecificVenue(venue_id: number): Observable<Venue> {
    return this.http.get<Venue>(this.baseUrl + 'getSpecificVenue.php', { ...this.httpOptions, params: new HttpParams().append('venue_id', venue_id) }).pipe(
      tap(_ => this.log('fetched Venue')),
      catchError(this.handleError<Venue>('getSpecificVenue'))
    );
  }

  addVenue(name: string, address: string, longitude: string, latitude: string): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'addVenue.php', { name, address, longitude, latitude, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`addVenue w/ id=${token}`)),
      catchError(this.handleError<boolean>('addVenue'))
    );
  }

  updateVenue(name: string, address: string, longitude: string, latitude: string, venue_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updateVenue.php', { name, address, longitude, latitude, venue_id, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`updateVenue w/ id=${token}`)),
      catchError(this.handleError<boolean>('updateVenue'))
    );
  }

  deleteVenue(venue_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'deleteVenue.php', { venue_id, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`deleteVenue w/ id=${token}`)),
      catchError(this.handleError<boolean>('deleteVenue'))
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

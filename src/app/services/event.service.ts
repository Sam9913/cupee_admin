import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Event, EventDetail } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/event/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getEvent(event_name?: string, is_booking_need?: boolean, datetime?: string, fanbase_id?: number, venue_id?: number): Observable<Event[]> {
    var httpParams: HttpParams = new HttpParams();
    if (event_name != undefined) {
      httpParams.append('event_name', event_name);
    }
    if (is_booking_need != undefined) {
      httpParams.append('is_booking_need', is_booking_need);
    }
    if (datetime != undefined) {
      httpParams.append('datetime', datetime);
    }
    if (fanbase_id != undefined) {
      httpParams.append('fanbase_id', fanbase_id);
    }
    if (venue_id != undefined) {
      httpParams.append('venue_id', venue_id);
    }

    return this.http.get<Event[]>(this.baseUrl + 'getEvent.php', { ...this.httpOptions, params: httpParams }).pipe(
      tap(_ => this.log('fetched events')),
      catchError(this.handleError<Event[]>('getEvent', []))
    );
  }

  getSpecificEvent(eventId: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(this.baseUrl + 'getSpecificEvent.php', { ...this.httpOptions, params: new HttpParams().append('event_id', eventId) }).pipe(
      tap(_ => this.log('fetched event')),
      catchError(this.handleError<EventDetail>('getSpecificEvent'))
    );
  }

  addEvent(name: string, fanbase_id: number, idol_id: number, image_url: string, faq: string, is_booking_need: boolean, datetime: string, venue_id: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'addEvent.php', { name, fanbase_id, idol_id, image_url, faq, is_booking_need, datetime, venue_id }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`addEvent w/ id=${token}`)),
      catchError(this.handleError<boolean>('addEvent'))
    );
  }

  updateEvent(name: string, fanbase_id: number, idol_id: number, image_url: string, faq: string, is_booking_need: boolean, datetime: string, venue_id: number, event_id: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'updateEvent.php', { name, fanbase_id, idol_id, image_url, faq, is_booking_need, datetime, venue_id, event_id }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`updateEvent w/ id=${token}`)),
      catchError(this.handleError<boolean>('updateEvent'))
    );
  }

  deleteEvent(event_id: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'deleteEvent.php', { event_id }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`deleteEvent w/ id=${token}`)),
      catchError(this.handleError<boolean>('deleteEvent'))
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

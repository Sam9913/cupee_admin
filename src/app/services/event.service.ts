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

  getEvent(
    param: {event_name?: string,
    is_booking_need?: number,
    datetime?: string,
    fanbase_id?: number,
    venue_id?: number,
    idol_id?:number,
    order_by?: string,
    seq?: string}
  ): Observable<Event[]> {
    var queryParam:string = '';
    if (param.event_name != undefined) {
      queryParam = '?event_name=' + param.event_name;
    }
    if (param.is_booking_need != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'is_booking_need=' + param.is_booking_need;
    }
    if (param.datetime != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'datetime=' + param.datetime;
    }
    if (param.fanbase_id != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'fanbase_id=' + param.fanbase_id;
    }
    if (param.venue_id != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'venue_id=' + param.venue_id;
    }
    if (param.idol_id != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'idol_id=' + param.idol_id;
    }
    if (param.order_by != undefined) {
      queryParam += (queryParam.length == 0 ? '?' : '&') + 'order_by=' + param.order_by;
      if (param.seq != undefined) {
        queryParam += '&seq=' + param.seq;
      }
    }

    return this.http.get<Event[]>(this.baseUrl + 'getEvent.php' + queryParam, this.httpOptions).pipe(
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

  addEvent(
    name: string,
    fanbase_id: number,
    idol_id: number,
    image_url: string,
    faq: string,
    is_booking_need: boolean,
    datetime: string,
    venue_id: number
  ): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'addEvent.php', { name, fanbase_id, idol_id, image_url, faq, is_booking_need, datetime, venue_id }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`addEvent w/ id=${token}`)),
      catchError(this.handleError<boolean>('addEvent'))
    );
  }

  updateEvent(
    name: string,
    fanbase_id: number,
    idol_id: number,
    image_url: string,
    faq: string,
    is_booking_need: boolean,
    datetime: string,
    venue_id: number,
    event_id: number
  ): Observable<boolean> {
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://cupeetest.000webhostapp.com/booking/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  getByEvent(eventId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl + 'getBookingByEvent.php', { ...this.httpOptions, params: new HttpParams().append('event_id', eventId) }).pipe(
      tap(_ => this.log('fetched bookings')),
      catchError(this.handleError<Booking[]>('getBookingByEvent', []))
    );
  }

  updateSlot(booking_id: number, slot_number: string): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updateBookingSlot.php', { booking_id, slot_number, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`updateSlot w/ id=${token}`)),
      catchError(this.handleError<boolean>('updateSlot'))
    );
  }

  updateArrived(booking_id: number, receipt: string): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'updateBookingArrived.php', { booking_id, receipt, "Authorization": token }, this.httpOptions).pipe(
      tap((token: boolean) => this.log(`log out w/ id=${token}`)),
      catchError(this.handleError<boolean>('logout'))
    );
  }

  cancelBooking(booking_id: number): Observable<boolean> {
    const token = localStorage.getItem('token');

    return this.http.post<boolean>(this.baseUrl + 'cancelBooking.php', { booking_id, "Authorization": token }, this.httpOptions).pipe(
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

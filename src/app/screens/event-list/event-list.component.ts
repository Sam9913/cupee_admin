import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { SharedServices } from 'src/app/services/shared-services';
import { FanbaseService } from 'src/app/services/fanbase.service';
import { Fanbase } from 'src/app/models/fanbase';
import { animate, style, transition, trigger } from '@angular/animations';
import { IdolService } from 'src/app/services/idol.service';
import { VenueService } from 'src/app/services/venue.service';
import { Venue } from 'src/app/models/venue';
import { Idol } from 'src/app/models/idol';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { pairwise, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  animations: [
    trigger("grow", [
      // Note the trigger name
      transition(":enter", [
        // :enter is alias to 'void => *'
        style({ height: "0", overflow: "hidden" }),
        animate(300, style({ height: "*" }))
      ]),
      transition(":leave", [
        // :leave is alias to '* => void'
        animate(300, style({ height: 0, overflow: "hidden" }))
      ])
    ])
  ]
})
export class EventListComponent {
  idolList: Idol[] = [];
  eventList: Event[] = [];
  venueList: Venue[] = [];
  fanbaseList: Fanbase[] = [];
  seq?: string;
  prevSelectedOrder: string = '';
  selectedOrder: string = '';
  showIndex: number = -1;
  name?: string;
  dateRange?: string;
  fanbaseId?: number;
  idolId?: number;
  venueId?: number;
  bookingNeed?: number;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private idolService: IdolService,
    private fanbaseService: FanbaseService,
    private venueService: VenueService,
    private eventService: EventService,
    private router: Router,
    private sharedServices: SharedServices,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getFanbaseList();
    this.getIdolList();
    this.getVenueList();
    this.getEventList();
  }

  getIdolList() {
    this.idolService.getIdol({})
      .subscribe(idolList => {
        this.idolList = idolList;
      });
  }

  getVenueList() {
    this.venueService.getVenue({})
      .subscribe(venueList => {
        this.venueList = venueList;
      });
  }

  getFanbaseList() {
    this.fanbaseService.getFanbase({})
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
      });
  }

  getEventList(order_by?: string) {
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }

    var startDate = '';
    if(this.range.value.start != null){
      startDate =this.datepipe.transform(this.range.value.start, 'yyyy-MM-dd') ?? '';
    }
    var endDate = '';
    if(this.range.value.end != null){
      endDate =this.datepipe.transform(this.range.value.end, 'yyyy-MM-dd') ?? '';
    }

    this.eventService.getEvent({ order_by, seq: this.seq, is_booking_need: this.bookingNeed, idol_id: this.idolId, fanbase_id: this.fanbaseId, event_name: this.name, venue_id: this.venueId, start_date: startDate == '' ? undefined : startDate, end_date: endDate == '' ? undefined:endDate,})
      .subscribe(eventList => {
        this.sharedServices.changeLoading(false);
        this.eventList = eventList;
      });
  }

  deleteEvent(event_id: number, name: string) {
    this.sharedServices.changeLoading(true);
    this.eventService.deleteEvent(event_id)
      .subscribe(isSuccess => {
        if (isSuccess) {
          this.sharedServices.changeMessage('Sucessfully delete ' + name);
          this.sharedServices.changeLoading(false);
        }
      });
  }

  changeShowIndex(index: number) {
    if (this.showIndex == index) {
      this.showIndex = -1;
    } else {
      this.showIndex = index;
    }
  }

  changeName(event: any) {
    this.name = event.target.value;
    this.showIndex = -1;
    this.getEventList();
  }

  changeFanbase(event: any) {
    this.fanbaseId = event.target.value;
    this.showIndex = -1;
    this.getEventList();
  }

  changeVenue(event: any) {
    this.venueId = event.target.value;
    this.showIndex = -1;
    this.getEventList();
  }

  changeIdol(event: any) {
    this.idolId = event.target.value;
    this.showIndex = -1;
    this.getEventList();
  }

  changeBookingNeed(need: number) {
    this.bookingNeed = need;
    this.showIndex = -1;
    this.getEventList();
  }

  changeDate(){
    this.showIndex = -1;
    this.getEventList();
  }

  getFanbaseName() {
    if (this.fanbaseId != null) {
      var index = this.fanbaseList.findIndex((element) => element.id == this.fanbaseId);
      if (index >= 0) {
        return this.fanbaseList[index].name;
      }
    }
    return 'Fanbase';
  }

  getIdolName() {
    if (this.idolId != null) {
      var index = this.idolList.findIndex((element) => element.id == this.idolId);
      if (index >= 0) {
        return this.idolList[index].name;
      }
    }
    return 'Idol';
  }

  getVenueName() {
    if (this.venueId != null) {
      var index = this.venueList.findIndex((element) => element.id == this.venueId);
      if (index >= 0) {
        return this.venueList[index].name;
      }
    }
    return 'Venue';
  }

  getBookingNeed(){
    if(this.bookingNeed != null){
      return this.bookingNeed == 0 ? 'No':'Yes';
    }
    return 'Booking?'
  }

  submitName(){
    const nameDiv = document.getElementById('name')as HTMLInputElement | null;
    if(nameDiv != null){
      this.name = nameDiv.value;
      this.getEventList();
    }
  }
}

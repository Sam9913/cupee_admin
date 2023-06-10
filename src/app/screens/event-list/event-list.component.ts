import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  eventList: Event[] = [];

  constructor(
    private eventService: EventService, 
    private router: Router,
    private sharedServices: SharedServices
    ) { }

  ngOnInit() {
    this.getEventList();
  }

  getEventList(){
    this.sharedServices.changeLoading(true);
    this.eventService.getEvent()
      .subscribe(eventList => {
        this.sharedServices.changeLoading(false);
        this.eventList = eventList;
      });
  }

  deleteEvent(event_id:number,name:string){
    this.sharedServices.changeLoading(true);
    this.eventService.deleteEvent(event_id)
      .subscribe(isSuccess => {
        if (isSuccess) {
          this.sharedServices.changeMessage('Sucessfully delete ' + name);
          this.sharedServices.changeLoading(false);
        }
      });
  }
}

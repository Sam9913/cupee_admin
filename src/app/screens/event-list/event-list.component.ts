import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  eventList: Event[] = [];

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.getEventList();
  }

  getEventList(){
    this.eventService.getEvent()
      .subscribe(eventList => {
        this.eventList = eventList;
      });
  }
}

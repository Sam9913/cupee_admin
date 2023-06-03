import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Venue } from 'src/app/models/venue';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css']
})
export class VenueListComponent {
  venueList: Venue[] = [];

  constructor(private venueService: VenueService, private router: Router) { }

  ngOnInit() {
    this.getVenueList();
  }

  getVenueList() {
    this.venueService.getVenue()
      .subscribe(venueList => {
        this.venueList = venueList;
      });
  }

  deleteVenue(venue_id: number, name: string) {
    this.venueService.deleteVenue(venue_id).subscribe(isSuccess => {
      if (isSuccess) {
        console.log(isSuccess);
        window.location.reload(); 
        sessionStorage.setItem('message', 'Sucessfully delete ' + name);
      }
    });
  }
}

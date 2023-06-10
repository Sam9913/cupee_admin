import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Venue } from 'src/app/models/venue';
import { SharedServices } from 'src/app/services/shared-services';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css']
})
export class VenueListComponent {
  venueList: Venue[] = [];

  constructor(
    private venueService: VenueService,
    private router: Router,
    private sharedServices: SharedServices,
  ) { }

  ngOnInit() {
    this.getVenueList();
  }

  getVenueList() {
    this.sharedServices.changeLoading(true);
    this.venueService.getVenue()
      .subscribe(venueList => {
        this.venueList = venueList;
        this.sharedServices.changeLoading(false);
      });
  }

  deleteVenue(venue_id: number, name: string) {
    this.sharedServices.changeLoading(true);
    this.venueService.deleteVenue(venue_id).subscribe(isSuccess => {
      if (isSuccess) {
        this.sharedServices.changeMessage('Sucessfully delete ' + name);
        this.sharedServices.changeLoading(false);
      }
    });
  }
}

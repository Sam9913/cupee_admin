import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent {
  bookingList: Booking[] = [];

  constructor(
    private bookingService: BookingService, 
    private sharedServices: SharedServices,
    private route: ActivatedRoute
    ) { }

    ngOnInit(){
      this.getBookingList();
    }

    getBookingList(){
      this.sharedServices.changeLoading(true);
      const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
      this.bookingService.getByEvent(id).subscribe(bookingList =>{
        this.bookingList = bookingList;
        this.sharedServices.changeLoading(false);
      });
    }
}

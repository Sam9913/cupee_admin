import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Venue } from 'src/app/models/venue';
import { SharedServices } from 'src/app/services/shared-services';
import { VenueService } from 'src/app/services/venue.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css'],
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
export class VenueListComponent {
  venueList: Venue[] = [];
  seq?: string;
  prevSelectedOrder: string = '';
  selectedOrder: string = '';
  show: boolean = false;
  showIndex: number = -1;
  name?: string;
  address?: string;

  constructor(
    private venueService: VenueService,
    private router: Router,
    private sharedServices: SharedServices,
  ) { }

  ngOnInit() {
    this.getVenueList();
  }

  getVenueList(order_by?: string) {
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }
    this.venueService.getVenue({ order_by, seq: this.seq, name: this.name, address: this.address, })
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
    this.getVenueList();
  }

  changeAddress(event: any) {
    this.address = event.target.value;
    this.showIndex = -1;
    this.getVenueList();
  }

  submitName(){
    const nameDiv = document.getElementById('name')as HTMLInputElement | null;
    if(nameDiv != null){
      this.name = nameDiv.value;
      this.getVenueList();
    }
  }

  submitAddress(){
    const addressDiv = document.getElementById('address')as HTMLInputElement | null;
    if(addressDiv != null){
      this.address = addressDiv.value;
      this.getVenueList();
    }
  }
}

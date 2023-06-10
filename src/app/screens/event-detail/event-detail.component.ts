import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetail } from 'src/app/models/event';
import { Fanbase } from 'src/app/models/fanbase';
import { Idol } from 'src/app/models/idol';
import { Venue } from 'src/app/models/venue';
import { EventService } from 'src/app/services/event.service';
import { FanbaseService } from 'src/app/services/fanbase.service';
import { IdolService } from 'src/app/services/idol.service';
import { VenueService } from 'src/app/services/venue.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FanbaseComponent } from 'src/app/dialogs/fanbase/fanbase.component';
import { IdolComponent } from 'src/app/dialogs/idol/idol.component';
import { VenueComponent } from 'src/app/dialogs/venue/venue.component';
import { pairwise, startWith } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  eventDetailForm!: FormGroup;
  idolList: Idol[] = [];
  fanbaseList: Fanbase[] = [];
  venueList: Venue[] = [];
  eventDetail: EventDetail | undefined;
  isUpdate: boolean = false;
  isFail: boolean = false;
  eventTime: string = '';
  src:string='';
  safeSrc:SafeResourceUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private idolService: IdolService,
    private fanbaseService: FanbaseService,
    private venueService: VenueService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.eventDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      fanbase_id: [1, Validators.required],
      venue_id: [1, Validators.required],
      idol_id: [1, Validators.required],
      image_url: [''],
      faq: ['', Validators.required],
      datetime: ['', Validators.required],
      is_booking_need: [false],
      booking_amount: [0],
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getEvent(param);
    }
    this.getIdolList();
    this.getFanbaseList();
    this.getVenueList();

    this.eventDetailForm.valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        this.setSelectedVenue(next.venue_id);
      });
  }

  get nameControl() {
    return this.eventDetailForm.controls['name'];
  }

  get fanbaseIdControl() {
    return this.eventDetailForm.controls['fanbase_id'];
  }

  get venueIdControl() {
    return this.eventDetailForm.controls['venue_id'];
  }

  get idolIdControl() {
    return this.eventDetailForm.controls['idol_id'];
  }

  get imageUrlControl() {
    return this.eventDetailForm.controls['image_url'];
  }

  get faqControl() {
    return this.eventDetailForm.controls['faq'];
  }

  get datetimeControl() {
    return this.eventDetailForm.controls['datetime'];
  }

  get isBookingNeedControl() {
    return this.eventDetailForm.controls['is_booking_need'];
  }

  get bookingAmountControl() {
    return this.eventDetailForm.controls['booking_amount'];
  }

  getEvent(param: string) {
    const id = parseInt(param, 10);
    this.eventService.getSpecificEvent(id)
      .subscribe(eventDetail => {
        // this.eventDetail = eventDetail;
        // this.eventTime = eventDetail.datetime[0];

        this.nameControl.setValue(eventDetail.name);
        this.fanbaseIdControl.setValue(eventDetail.fanbase_id);
        this.venueIdControl.setValue(eventDetail.venue_id);
        this.idolIdControl.setValue(eventDetail.idol_id);
        this.imageUrlControl.setValue(eventDetail.image_url);
        this.faqControl.setValue(eventDetail.faq);
        this.isBookingNeedControl.setValue(eventDetail.is_booking_need);
        this.bookingAmountControl.setValue(eventDetail.booking_amount);
        this.datetimeControl.setValue(eventDetail.datetime);
      });
  }

  getIdolList() {
    this.idolService.getIdol()
      .subscribe(idolList => {
        this.idolList = idolList;
      });
  }

  getVenueList() {
    this.venueService.getVenue()
      .subscribe(venueList => {
        this.venueList = venueList;
        this.setSelectedVenue(1);
      });
  }

  getFanbaseList() {
    this.fanbaseService.getFanbase()
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
      });
  }

  setSelectedVenue(venue_id: number) {
    var selectedVenue = this.venueList.find((value) => value.id == venue_id);
    this.src = 'https://maps.google.com/maps?q=' + (selectedVenue?.latitude ?? 0) + ',' + (selectedVenue?.longitude ?? 0) + '&hl=en&z=14&output=embed';
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  openDialog(type: string): void {
    if (type == 'idol') {
      const dialogRef = this.dialog.open(IdolComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getIdolList();
        }
      });
    } else if (type == 'fanbase') {
      const dialogRef = this.dialog.open(FanbaseComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFanbaseList();
        }
      });
    } else {
      const dialogRef = this.dialog.open(VenueComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getVenueList();
        }
      });
    }
  }

  onSubmit() {
    if (this.eventDetailForm.valid) {
      if (this.isUpdate) {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.eventService.updateEvent(
          this.eventDetailForm.value.name,
          this.eventDetailForm.value.fanbase_id,
          this.eventDetailForm.value.idol_id,
          this.eventDetailForm.value.image_url,
          this.eventDetailForm.value.faq,
          this.eventDetailForm.value.is_booking_need,
          this.eventDetailForm.value.datetime[0],
          this.eventDetailForm.value.venue_id,
          id)
          .subscribe(isSuccess => {
            if (isSuccess) {
              sessionStorage.setItem('message', 'Successfully update ' + this.eventDetailForm.value.name);
              this.router.navigate(['/event']);
            } else {
              this.isFail = true;
            }
          });
      } else {
        this.eventService.addEvent(
          this.eventDetailForm.value.name,
          this.eventDetailForm.value.fanbase_id,
          this.eventDetailForm.value.idol_id,
          this.eventDetailForm.value.image_url,
          this.eventDetailForm.value.faq,
          this.eventDetailForm.value.is_booking_need,
          this.eventDetailForm.value.datetime[0],
          this.eventDetailForm.value.venue_id,)
          .subscribe(isSuccess => {
            if (isSuccess) {
              sessionStorage.setItem('message', 'Successfully add ' + this.eventDetailForm.value.name);
              this.router.navigate(['/event']);
            } else {
              this.isFail = true;
            }
          });
      }
    }
  }
}
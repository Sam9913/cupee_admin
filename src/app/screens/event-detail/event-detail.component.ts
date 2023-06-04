import { Component, Inject } from '@angular/core';
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private idolService: IdolService,
    private fanbaseService: FanbaseService,
    private venueService: VenueService,
    private router: Router,
    public dialog: MatDialog
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
      });
  }

  getFanbaseList() {
    this.fanbaseService.getFanbase()
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
      });
  }

  openDialog(type: string): void {
    const dialogRef = this.dialog.open(FormDialog, {
      width: '250px',
      data: type,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      var param = this.route.snapshot.paramMap.get('id');
      if (param != null) {
        this.isUpdate = true;
        this.getEvent(param);
      }
    });
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

@Component({
  selector: 'form-dialog',
  templateUrl: 'form-dialog.html',
  standalone: true,
  imports: [MatDialogModule],
})
export class FormDialog {
  constructor(
    public dialogRef: MatDialogRef<FormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
  }
}
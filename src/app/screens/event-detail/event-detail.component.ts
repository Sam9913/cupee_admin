import { Component, ViewContainerRef, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { FanbaseComponent } from 'src/app/dialogs/fanbase/fanbase.component';
import { IdolComponent } from 'src/app/dialogs/idol/idol.component';
import { VenueComponent } from 'src/app/dialogs/venue/venue.component';
import { pairwise, startWith } from 'rxjs';
import { SharedServices } from 'src/app/services/shared-services';
import { Storage, ref, uploadBytesResumable, listAll } from '@angular/fire/storage';
import { deleteObject, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  private readonly storage: Storage = inject(Storage);

  eventDetailForm!: FormGroup;
  idolList: Idol[] = [];
  fanbaseList: Fanbase[] = [];
  venueList: Venue[] = [];
  eventDetail: EventDetail | undefined;
  safeSrc: SafeResourceUrl = '';
  eventTime: string = '';
  src: string = '';
  imageList: Image[] = [];
  isUpdate: boolean = false;
  isFail: boolean = false;
  submitted: boolean = false;

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
    private sharedServices: SharedServices,
    public viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.eventDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      fanbase_id: [1, Validators.required],
      venue_id: [1, Validators.required],
      idol_id: [1, Validators.required],
      image_url: '',
      faq: ['', Validators.required],
      datetime: ['', Validators.required],
      is_booking_need: false,
      booking_amount: [0, Validators.pattern("^[0-9]*$")],
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
        this.getImageList(next.image_url);
      });
  }

  submittedControl(formControlName: string) {
    return (this.eventDetailForm.controls[formControlName].touched || this.submitted);
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

  checkNameRequired() {
    var required: boolean = false;
    if (this.nameControl.errors != null) {
      required = this.nameControl.errors['required'];
    }
    return this.submittedControl('name') && required;
  }

  checkFaqRequired() {
    var required: boolean = false;
    if (this.faqControl.errors != null) {
      required = this.faqControl.errors['required'];
    }
    return this.submittedControl('faq') && required;
  }

  checkDateTimeRequired() {
    var required: boolean = false;
    if (this.datetimeControl.errors != null) {
      required = this.datetimeControl.errors['required'];
    }
    return this.submittedControl('datetime') && required;
  }

  checkDateTimeFormat() {
    // var format: boolean = false;
    // if (this.eventDetailForm.value.datetime[0] != null) {
    //   console.log(this.eventDetailForm.value.datetime[0].substring(0, 10));
    // }
    // return this.submittedControl('email') && format;
    return false;
  }

  getImageList(name: string) {
    const storageRef = ref(this.storage);
    listAll(storageRef).then(obj => {
      obj.items.forEach((item) => {
        if (item.name == name) {
          const newRef = ref(this.storage, item.name);
          getDownloadURL(newRef).then(url => {
            this.imageList.push({ url, name: item.name });
          })
        }
      });
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const formData = new FormData();

      const fileRef = ref(this.storage, fileName);
      uploadBytesResumable(fileRef, file);
    }
  }

  deleteFile(name: string) {
    const storageRef = ref(this.storage, name);
    deleteObject(storageRef).then(() => {
      var indexOfDelete = this.imageList.findIndex((element) => {
        return element.name == name;
      });
      this.imageList.splice(indexOfDelete, 1);
    });
  }

  addLimitAmount() {
    var value = this.eventDetailForm.value.booking_amount;
    if (value == '') {
      this.bookingAmountControl.setValue(1);
    } else {
      this.bookingAmountControl.setValue(parseInt(value, 10) + 1);
    }
  }

  deductLimitAmount() {
    var value = this.eventDetailForm.value.booking_amount;
    if (value == '' || value == '1') {
      this.bookingAmountControl.setValue(0);
    } else {
      this.bookingAmountControl.setValue(parseInt(value, 10) - 1);
    }
  }


  getEvent(param: string) {
    this.sharedServices.changeLoading(true);
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
        this.sharedServices.changeLoading(false);
      });
  }

  getIdolList() {
    this.sharedServices.changeLoading(true);
    this.idolService.getIdol({})
      .subscribe(idolList => {
        this.idolList = idolList;
        this.sharedServices.changeLoading(false);
      });
  }

  getVenueList() {
    this.sharedServices.changeLoading(true);
    this.venueService.getVenue({})
      .subscribe(venueList => {
        this.venueList = venueList;
        this.setSelectedVenue(1);
        this.sharedServices.changeLoading(false);
      });
  }

  getFanbaseList() {
    this.sharedServices.changeLoading(true);
    this.fanbaseService.getFanbase({})
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
        this.sharedServices.changeLoading(false);
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
    this.sharedServices.changeLoading(true);
    this.submitted = true;
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
            this.sharedServices.changeLoading(false);
            if (isSuccess) {
              this.sharedServices.changeMessage('Successfully update ' + this.eventDetailForm.value.name);
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
            this.sharedServices.changeLoading(false);
            if (isSuccess) {
              this.sharedServices.changeMessage('Successfully add ' + this.eventDetailForm.value.name);
              this.router.navigate(['/event']);
            } else {
              this.isFail = true;
            }
          });
      }
    }
  }
}

export interface Image {
  url: string;
  name: string;
}
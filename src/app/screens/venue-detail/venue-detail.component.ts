import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared-services';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.css']
})
export class VenueDetailComponent {
  venueDetailForm!: FormGroup;
  isUpdate: boolean = false;
  isFail: boolean = false;
  submitted: boolean = false;
  format: boolean = true;
  src: string = '';
  safeSrc: SafeResourceUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private venueService: VenueService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.venueDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      longitude: 0,
      latitude: 0,
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getVenue(param);
    } else {
      this.setMapCoordinate(0, 0);
    }
  }

  submittedControl(formControlName: string) {
    return (this.venueDetailForm.controls[formControlName].touched || this.submitted);
  }

  get nameControl() {
    return this.venueDetailForm.controls['name'];
  }

  get addressControl() {
    return this.venueDetailForm.controls['address'];
  }

  get longitudeControl() {
    return this.venueDetailForm.controls['longitude'];
  }

  get latitudeControl() {
    return this.venueDetailForm.controls['latitude'];
  }

  checkNameRequired() {
    var required: boolean = false;
    if (this.nameControl.errors != null) {
      required = this.nameControl.errors['required'];
    }
    return this.submittedControl('name') && required;
  }

  checkAddressRequired() {
    var required: boolean = false;
    if (this.addressControl.errors != null) {
      required = this.addressControl.errors['required'];
    }
    return this.submittedControl('address') && required;
  }

  checkAddressFormat() {
    if (this.venueDetailForm.value.address != '') {
      return this.submittedControl('address') && this.format;
    }
    return false;
  }

  getVenue(param: string) {
    this.sharedServices.changeLoading(true);

    const id = parseInt(param, 10);
    this.venueService.getSpecificVenue(id)
      .subscribe(venueDetail => {
        this.nameControl.setValue(venueDetail.name);
        this.addressControl.setValue(venueDetail.address);
        this.longitudeControl.setValue(venueDetail.longitude);
        this.latitudeControl.setValue(venueDetail.latitude);
        this.setMapCoordinate(venueDetail.latitude, venueDetail.longitude);
        this.sharedServices.changeLoading(false);
      });
  }

  setAddress(event: any) {
    this.venueService.getLongitudeLatitude(event.target.value)
      .subscribe(result => {
        if (result) {
          if (result[0] == undefined) {
            this.format = true;
          } else {
            this.format = false;
          }

          this.setMapCoordinate(
            parseFloat(result[0].lat),
            parseFloat(result[0].lon),
          );
        }
      })
  }

  setMapCoordinate(latitude: number, longitude: number) {
    this.src = 'https://maps.google.com/maps?q=' + latitude + ',' + longitude + '&hl=en&z=14&output=embed';
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  onSubmit() {
    this.sharedServices.changeLoading(true);
    this.submitted = true;
    if (this.venueDetailForm.valid) {
      this.venueService.getLongitudeLatitude(this.venueDetailForm.value.address)
        .subscribe(result => {
          if (result) {
            this.venueDetailForm.value.longitude = parseFloat(result[0].lon);
            this.venueDetailForm.value.latitude = parseFloat(result[0].lat);
          }
        });

      if (this.isUpdate) {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.venueService.updateVenue(
          this.venueDetailForm.value.name,
          this.venueDetailForm.value.address,
          this.venueDetailForm.value.longitude,
          this.venueDetailForm.value.latitude,
          id
        ).subscribe(isSuccess => {
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully update ' + this.venueDetailForm.value.name);
            this.router.navigate(['/venue']);
          } else {
            this.isFail = true;
            setTimeout(() => {
              this.isFail = false;
            }, 1000);
          }
        });
      } else {
        this.venueService.addVenue(
          this.venueDetailForm.value.name,
          this.venueDetailForm.value.address,
          this.venueDetailForm.value.longitude,
          this.venueDetailForm.value.latitude
        ).subscribe(isSuccess => {
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully add ' + this.venueDetailForm.value.name);
            this.router.navigate(['/venue']);
          } else {
            this.isFail = true;
            setTimeout(() => {
              this.isFail = false;
            }, 1000);
          }
        });
      }
    }
  }

}

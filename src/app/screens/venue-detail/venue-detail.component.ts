import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.css']
})
export class VenueDetailComponent {
  venueDetailForm!: FormGroup;
  isUpdate: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private venueService: VenueService
  ) { }

  ngOnInit() {
    this.venueDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getVenue(param);
    }
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

  getVenue(param: string) {
    const id = parseInt(param, 10);
    this.venueService.getSpecificVenue(id)
      .subscribe(venueDetail => {
        this.nameControl.setValue(venueDetail.name);
        this.addressControl.setValue(venueDetail.address);
        this.longitudeControl.setValue(venueDetail.longitude);
        this.latitudeControl.setValue(venueDetail.latitude);
      });
  }

  onSubmit() {
    if (this.venueDetailForm.valid) {
      if(this.isUpdate){
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.venueService.updateVenue(
          this.venueDetailForm.value.name,
          this.venueDetailForm.value.address,
          this.venueDetailForm.value.longitude,
          this.venueDetailForm.value.latitude,
          id
        ).subscribe(isSuccess => {
          console.log(isSuccess)
        });
      }else{
        this.venueService.addVenue(
          this.venueDetailForm.value.name,
          this.venueDetailForm.value.address,
          this.venueDetailForm.value.longitude,
          this.venueDetailForm.value.latitude
        ).subscribe(isSuccess => {
          console.log(isSuccess)
        });
      }
    }
  }

}

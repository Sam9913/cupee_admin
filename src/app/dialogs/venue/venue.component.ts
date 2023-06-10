import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class VenueComponent {
  name: string | undefined;
  address: string | undefined;
  longitude: number | undefined;
  latitude: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<VenueComponent>,
    private venueService: VenueService
  ) { }

  setName(event: any) {
    this.name = event.target.value;
  }

  setAddress(event: any) {
    this.address = event.target.value;
    this.venueService.getLongitudeLatitude(event.target.value)
      .subscribe(result => {
        if (result) {
          this.setLongitudeAndLatitude(
            parseFloat(result[0].lon),
            parseFloat(result[0].lat),
          );
        }
      })
  }

  setLongitudeAndLatitude(longitude: number, latitude: number) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  onSubmit() {
    if (
      this.name != undefined &&
      this.address != undefined &&
      this.longitude != undefined &&
      this.latitude != undefined
    ) {
      this.venueService.addVenue(
        this.name,
        this.address,
        this.longitude,
        this.latitude,
      ).subscribe(isSuccess => {
        if (isSuccess) {
          this.dialogRef.close();
        } else {

        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

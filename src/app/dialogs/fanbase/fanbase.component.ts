import { Component, } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FanbaseService } from 'src/app/services/fanbase.service';

@Component({
  selector: 'app-fanbase',
  templateUrl: './fanbase.component.html',
  styleUrls: ['./fanbase.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class FanbaseComponent {
  name: string | undefined;
  email: string | undefined;
  facebookLink: string | undefined;
  instagramUsername: string | undefined;
  twitterUsername: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<FanbaseComponent>,
    private fanbaseService: FanbaseService
  ) { }

  setName(event: any) {
    this.name = event.target.value;
  }

  setEmail(event: any) {
    this.email = event.target.value;
  }

  setFacebookLink(event: any) {
    this.facebookLink = event.target.value;
  }

  setInstagramUsername(event: any) {
    this.instagramUsername = event.target.value;
  }

  setTwitterUsername(event: any) {
    this.twitterUsername = event.target.value;
  }

  onSubmit() {
    if (
      this.name != undefined &&
      this.email != undefined &&
      this.facebookLink != undefined &&
      this.twitterUsername != undefined
    ) {
      this.fanbaseService.addFanbase(
        this.name,
        this.email,
        this.twitterUsername,
        this.instagramUsername == undefined ? '' : this.instagramUsername,
        this.facebookLink,
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

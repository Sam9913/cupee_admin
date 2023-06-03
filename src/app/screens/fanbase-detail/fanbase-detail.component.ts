import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FanbaseService } from 'src/app/services/fanbase.service';

@Component({
  selector: 'app-fanbase-detail',
  templateUrl: './fanbase-detail.component.html',
  styleUrls: ['./fanbase-detail.component.css']
})
export class FanbaseDetailComponent {
  fanbaseDetailForm!: FormGroup;
  isUpdate: boolean = false;
  isFail: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fanbaseService: FanbaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fanbaseDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      twitter_username: ['', Validators.required],
      instagram_username: [''],
      facebook_link: [''],
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getFanbase(param);
    }
  }

  get nameControl() {
    return this.fanbaseDetailForm.controls['name'];
  }

  get emailControl() {
    return this.fanbaseDetailForm.controls['email'];
  }

  get twitterUsernameControl() {
    return this.fanbaseDetailForm.controls['twitter_username'];
  }

  get instagramUsernameControl() {
    return this.fanbaseDetailForm.controls['instagram_username'];
  }

  get facebookLinkControl() {
    return this.fanbaseDetailForm.controls['facebook_link'];
  }

  getFanbase(param: string) {
    const id = parseInt(param, 10);
    this.fanbaseService.getSpecificFanbase(id)
      .subscribe(fanbaseDetail => {
        this.nameControl.setValue(fanbaseDetail.name);
        this.emailControl.setValue(fanbaseDetail.email);
        this.twitterUsernameControl.setValue(fanbaseDetail.twitter_username);
        this.facebookLinkControl.setValue(fanbaseDetail.facebook_link ?? '');
        this.instagramUsernameControl.setValue(fanbaseDetail.instagram_username ?? '');
      });
  }

  onSubmit() {
    if (this.fanbaseDetailForm.valid) {
      if(this.isUpdate){
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.fanbaseService.updateFanbase(
          this.fanbaseDetailForm.value.name,
          this.fanbaseDetailForm.value.email,
          this.fanbaseDetailForm.value.twitter_username,
          this.fanbaseDetailForm.value.instagram_username,
          this.fanbaseDetailForm.value.facebook_link,
          id
        ).subscribe(isSuccess => {
          if (isSuccess) {
            sessionStorage.setItem('message', 'Successfully update existing fanbase');
            this.router.navigate(['/fanbase']);
          } else {
            this.isFail = true;
          }
        });
      }else{
        this.fanbaseService.addFanbase(
          this.fanbaseDetailForm.value.name,
          this.fanbaseDetailForm.value.email,
          this.fanbaseDetailForm.value.twitter_username,
          this.fanbaseDetailForm.value.instagram_username,
          this.fanbaseDetailForm.value.facebook_link
        ).subscribe(isSuccess => {
          if (isSuccess) {
            sessionStorage.setItem('message', 'Successfully update existing fanbase');
            this.router.navigate(['/fanbase']);
          } else {
            this.isFail = true;
          }
        });
      }
    }
  }
}

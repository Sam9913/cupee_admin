import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FanbaseService } from 'src/app/services/fanbase.service';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-fanbase-detail',
  templateUrl: './fanbase-detail.component.html',
  styleUrls: ['./fanbase-detail.component.css']
})
export class FanbaseDetailComponent {
  fanbaseDetailForm!: FormGroup;
  isUpdate: boolean = false;
  isFail: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fanbaseService: FanbaseService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.fanbaseDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      twitter_username: '',
      instagram_username: '',
      facebook_link: '',
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getFanbase(param);
    }
  }

  submittedControl(formControlName: string) {
    return (this.fanbaseDetailForm.controls[formControlName].touched || this.submitted);
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

  checkNameRequired() {
    var required: boolean = false;
    if (this.nameControl.errors != null) {
      required = this.nameControl.errors['required'];
    }
    return this.submittedControl('name') && required;
  }

  checkEmailRequired() {
    var required: boolean = false;
    if (this.emailControl.errors != null) {
      required = this.emailControl.errors['required'];
    }
    return this.submittedControl('email') && required;
  }

  checkEmailFormat() {
    var format: boolean = false;
    if (this.emailControl.errors != null) {
      format = this.emailControl.errors['email'];
    }
    return this.submittedControl('email') && format;
  }

  checkSocialMediaRequired() {
    var required: boolean = false;
    const facebookLink = this.fanbaseDetailForm.value.facebook_link;
    const twitterUsername = this.fanbaseDetailForm.value.twitter_username;
    const instagramUsername = this.fanbaseDetailForm.value.instagram_username;
    if (facebookLink == '' && twitterUsername == '' && instagramUsername == '') {
      required = true;
    }

    var submitted: boolean = false;
    if(this.submittedControl('facebook_link') && this.submittedControl('twitter_username') || this.submittedControl('instagram_username')){
      submitted = true;
    }

    return submitted && required;
  }

  checkFacebookLinkFormat(){
    var format: boolean = false;
    const faceboookRegex = "((http|https)://)?(www[.])?facebook.com/.+";
    if(!faceboookRegex.match(this.fanbaseDetailForm.value.facebook_link)){
      format = true;
    }

    return this.submittedControl('facebook_link') && format;
  }

  getFanbase(param: string) {
    this.sharedServices.changeLoading(true);
    const id = parseInt(param, 10);
    this.fanbaseService.getSpecificFanbase(id)
      .subscribe(fanbaseDetail => {
        this.nameControl.setValue(fanbaseDetail.name);
        this.emailControl.setValue(fanbaseDetail.email);
        this.twitterUsernameControl.setValue(fanbaseDetail.twitter_username);
        this.facebookLinkControl.setValue(fanbaseDetail.facebook_link ?? '');
        this.instagramUsernameControl.setValue(fanbaseDetail.instagram_username ?? '');
        this.sharedServices.changeLoading(false);
      });
  }

  onSubmit() {
    this.sharedServices.changeLoading(true);
    this.submitted = true;
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
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully update existing fanbase');
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
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully update existing fanbase');
            this.router.navigate(['/fanbase']);
          } else {
            this.isFail = true;
          }
        });
      }
    }
  }
}

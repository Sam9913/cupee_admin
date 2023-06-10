import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  settingForm!: FormGroup;
  selectedIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.settingForm = this.fb.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changeSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  onSubmit() {
    this.sharedServices.changeLoading(true);
    if (this.settingForm.valid) {
      const password = this.settingForm.value.confirm_password;
      this.authService.changePassword(password)
        .subscribe(isSuccess => {
          this.sharedServices.changeLoading(false);
          if(isSuccess){
            this.sharedServices.changeMessage('Password updated');
          }
        });
    }
  }
}

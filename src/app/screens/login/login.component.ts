import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submittedControl(formControlName: string) {
    return (this.loginForm.controls[formControlName].touched || this.submitted);
  }

  get emailControl() {
    return this.loginForm.controls['email'];
  }

  get passwordControl() {
    return this.loginForm.controls['password'];
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

  checkPasswordRequired() {
    var required: boolean = false;
    if (this.passwordControl.errors != null) {
      required = this.passwordControl.errors['required'];
    }
    return this.submittedControl('password') && required;
  }

  changeHide() {
    this.hide = !this.hide;
  }

  onSubmit() {
    this.sharedServices.changeLoading(true);
    this.submitted = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email.trim();
      const password = this.loginForm.value.password;
      this.authService.login(email, password)
        .subscribe(token => {
          this.sharedServices.changeLoading(false);
          if (token != undefined) {
            localStorage.setItem('token', token);
            this.router.navigate(['/home']);
          }
        });
    }
  }

}

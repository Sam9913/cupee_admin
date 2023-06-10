import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdolService } from 'src/app/services/idol.service';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-idol-detail',
  templateUrl: './idol-detail.component.html',
  styleUrls: ['./idol-detail.component.css']
})
export class IdolDetailComponent {
  idolDetailForm!: FormGroup;
  isUpdate: boolean = false;
  isFail: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private idolService: IdolService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.idolDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      member_amount: ['', Validators.required],
      gender: ['', Validators.required],
    });

    var param = this.route.snapshot.paramMap.get('id');
    if (param != null) {
      this.isUpdate = true;
      this.getIdol(param);
    }
  }

  get nameControl() {
    return this.idolDetailForm.controls['name'];
  }

  get memberAmountControl() {
    return this.idolDetailForm.controls['member_amount'];
  }

  get genderControl() {
    return this.idolDetailForm.controls['gender'];
  }

  getIdol(param: string) {
    this.sharedServices.changeLoading(true);
    const id = parseInt(param, 10);
    this.idolService.getSpecificIdol(id)
      .subscribe(idolDetail => {
        this.nameControl.setValue(idolDetail.name);
        this.memberAmountControl.setValue(idolDetail.member_amount);
        this.genderControl.setValue(idolDetail.gender);
        this.sharedServices.changeLoading(false);
      });
  }

  addMemberAmount() {
    var value = this.idolDetailForm.value.member_amount;
    if (value == '') {
      this.memberAmountControl.setValue(1);
    } else {
      this.memberAmountControl.setValue(parseInt(value, 10) + 1);
    }
  }

  deductMemberAmount() {
    var value = this.idolDetailForm.value.member_amount;
    if (value == '' || value == '1') {
      this.memberAmountControl.setValue(0);
    } else {
      this.memberAmountControl.setValue(parseInt(value, 10) - 1);
    }
  }

  onSubmit() {
    this.sharedServices.changeLoading(true);
    if (this.idolDetailForm.valid) {
      if (this.isUpdate) {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.idolService.updateIdol(
          this.idolDetailForm.value.name,
          this.idolDetailForm.value.gender,
          this.idolDetailForm.value.member_amount,
          id
        ).subscribe(isSuccess => {
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully update ' + this.idolDetailForm.value.name);
            this.router.navigate(['/idol']);
          } else {
            this.isFail = true;
          }
        });
      } else {
        this.idolService.addIdol(
          this.idolDetailForm.value.name,
          this.idolDetailForm.value.gender,
          this.idolDetailForm.value.member_amount,
        ).subscribe(isSuccess => {
          this.sharedServices.changeLoading(false);
          if (isSuccess) {
            this.sharedServices.changeMessage('Successfully add ' + this.idolDetailForm.value.name);
            this.router.navigate(['/idol']);
          } else {
            this.isFail = true;
          }
        });
      }
    }
  }

}

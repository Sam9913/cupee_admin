import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdolService } from 'src/app/services/idol.service';

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
    private router: Router
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
    const id = parseInt(param, 10);
    this.idolService.getSpecificIdol(id)
      .subscribe(idolDetail => {
        this.nameControl.setValue(idolDetail.name);
        this.memberAmountControl.setValue(idolDetail.member_amount);
        this.genderControl.setValue(idolDetail.gender);
      });
  }

  onSubmit() {
    if (this.idolDetailForm.valid) {
      if (this.isUpdate) {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

        this.idolService.updateIdol(
          this.idolDetailForm.value.name,
          this.idolDetailForm.value.gender,
          this.idolDetailForm.value.member_amount,
          id
        ).subscribe(isFail => {
          if (isFail) {
            sessionStorage.setItem('message', 'Successfully update existing idol');
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
        ).subscribe(isFail => {
          if (isFail) {
            sessionStorage.setItem('message', 'Successfully add new idol');
            this.router.navigate(['/idol']);
          } else {
            this.isFail = true;
          }
        });
      }
    }
  }

}

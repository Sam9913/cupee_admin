import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idol } from 'src/app/models/idol';
import { IdolService } from 'src/app/services/idol.service';
import { SharedServices } from 'src/app/services/shared-services';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-idol-list',
  templateUrl: './idol-list.component.html',
  styleUrls: ['./idol-list.component.css'],
  animations: [
    trigger("grow", [
      // Note the trigger name
      transition(":enter", [
        // :enter is alias to 'void => *'
        style({ height: "0", overflow: "hidden" }),
        animate(300, style({ height: "*" }))
      ]),
      transition(":leave", [
        // :leave is alias to '* => void'
        animate(300, style({ height: 0, overflow: "hidden" }))
      ])
    ])
  ]
})
export class IdolListComponent {
  idolList: Idol[] = [];
  seq?: string;
  prevSelectedOrder: string = '';
  selectedOrder: string = '';
  showIndex: number = -1;
  name?: string;
  gender?: number;
  amount: number = 0;

  constructor(
    private idolService: IdolService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.getIdolList();
  }

  getIdolList(order_by?: string) {
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }
    this.idolService.getIdol({ order_by, seq: this.seq, name: this.name, member_amount: this.amount == 0 ? undefined : this.amount, })
      .subscribe(idolList => {
        this.sharedServices.changeLoading(false);
        this.idolList = idolList;
      });
  }

  deleteIdol(idol_id: number, name: string) {
    this.sharedServices.changeLoading(true);
    this.idolService.deleteIdol(idol_id)
      .subscribe(isSuccess => {
        this.sharedServices.changeLoading(false);
        if (isSuccess) {
          this.sharedServices.changeMessage('Sucessfully delete ' + name);
        }
      });
  }

  changeShowIndex(index: number) {
    if (this.showIndex == index) {
      this.showIndex = -1;
    } else {
      this.showIndex = index;
    }
  }

  changeName(event: any) {
    this.name = event.target.value;
    this.showIndex = -1;
    this.getIdolList();
  }

  changeGender(value: number) {
    this.gender = value;
    this.showIndex = -1;
    this.getIdolList();
  }

  getGender() {
    if (this.gender != null) {
      return this.gender == 0 ? 'Male' : 'Female';
    }
    return 'Gender';
  }

  submitName(){
    const nameDiv = document.getElementById('name')as HTMLInputElement | null;
    if(nameDiv != null){
      this.name = nameDiv.value;
      this.showIndex = -1;
      this.getIdolList();
    }
  }

  submitAmount(){
    const amountDiv = document.getElementById('member_amount')as HTMLInputElement | null;
    if(amountDiv != null){
      this.amount = parseInt(amountDiv.value, 10);
      this.showIndex = -1;
      this.getIdolList();
    }
  }

  addMemberAmount() {
    const amountDiv = document.getElementById('member_amount')as HTMLInputElement | null;
    if(amountDiv != null){
      if (amountDiv.value == '') {
        amountDiv.value = '1';
      } else {
       amountDiv.value = (parseInt(amountDiv.value, 10) + 1).toString();
      }
    }
  }

  deductMemberAmount() {
    const amountDiv = document.getElementById('member_amount')as HTMLInputElement | null;
    if(amountDiv != null){
    if (amountDiv.value == '' || amountDiv.value == '1') {
      amountDiv.value = '1';
    } else {
      amountDiv.value = (parseInt(amountDiv.value, 10) - 1).toString();
    }
  }
  }
}

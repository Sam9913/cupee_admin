import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fanbase } from 'src/app/models/fanbase';
import { FanbaseService } from 'src/app/services/fanbase.service';
import { SharedServices } from 'src/app/services/shared-services';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-fanbase-list',
  templateUrl: './fanbase-list.component.html',
  styleUrls: ['./fanbase-list.component.css'],
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
export class FanbaseListComponent {
  fanbaseList: Fanbase[] = [];
  seq?: string;
  prevSelectedOrder: string = '';
  selectedOrder: string = '';
  show: boolean = false;
  showIndex: number = -1;
  name?: string;
  email?: string;
  twitterUsername?: string;
  instagramUsername?: string;
  facebookLink?: string;

  constructor(
    private fanbaseService: FanbaseService,
    private router: Router,
    private sharedServices: SharedServices
  ) { }

  ngOnInit() {
    this.getFanbaseList();
  }

  getFanbaseList(order_by?: string) {
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }
    this.fanbaseService.getFanbase({ order_by, seq: this.seq, name: this.name, email: this.email, twitter_username: this.twitterUsername, instagram_username: this.instagramUsername, facebook_link: this.facebookLink, })
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
        this.sharedServices.changeLoading(false);
      });
  }

  deleteFanbase(fanabase_id: number, name: string) {
    this.sharedServices.changeLoading(true);
    this.fanbaseService.deleteFanbase(fanabase_id)
      .subscribe(isSuccess => {
        if (isSuccess) {
          this.sharedServices.changeMessage('Sucessfully delete ' + name);
          this.sharedServices.changeLoading(false);
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
    this.getFanbaseList();
  }

  changeEmail(event: any) {
    this.email = event.target.value;
    this.showIndex = -1;
    this.getFanbaseList();
  }

  changeTwiiterUsername(event: any) {
    this.twitterUsername = event.target.value;
    this.showIndex = -1;
    this.getFanbaseList();
  }

  changeInstagramUsername(event: any) {
    this.instagramUsername = event.target.value;
    this.showIndex = -1;
    this.getFanbaseList();
  }

  changeFacebookLink(event: any) {
    this.facebookLink = event.target.value;
    this.showIndex = -1;
    this.getFanbaseList();
  }

  submitName(){
    const nameDiv = document.getElementById('name')as HTMLInputElement | null;
    if(nameDiv != null){
      this.name = nameDiv.value;
      this.getFanbaseList();
    }
  }

  submitEmail(){
    const emailDiv = document.getElementById('email')as HTMLInputElement | null;
    if(emailDiv != null){
      this.email = emailDiv.value;
      this.getFanbaseList();
    }
  }

  submitFacebook(){
    const facebookDiv = document.getElementById('facebook')as HTMLInputElement | null;
    if(facebookDiv != null){
      this.facebookLink = facebookDiv.value;
      this.getFanbaseList();
    }
  }

  submitTwitter(){
    const twitterDiv = document.getElementById('twitter')as HTMLInputElement | null;
    if(twitterDiv != null){
      this.twitterUsername = twitterDiv.value;
      this.getFanbaseList();
    }
  }

  submitInstagram(){
    const instagramDiv = document.getElementById('instagram')as HTMLInputElement | null;
    if(instagramDiv != null){
      this.instagramUsername = instagramDiv.value;
      this.getFanbaseList();
    }
  }

}

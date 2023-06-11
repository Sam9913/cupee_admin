import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fanbase } from 'src/app/models/fanbase';
import { FanbaseService } from 'src/app/services/fanbase.service';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-fanbase-list',
  templateUrl: './fanbase-list.component.html',
  styleUrls: ['./fanbase-list.component.css']
})
export class FanbaseListComponent {
  fanbaseList: Fanbase[] = [];
  seq?: string;
  prevSelectedOrder:string = '';
  selectedOrder:string = '';

  constructor(
    private fanbaseService: FanbaseService, 
    private router: Router,
    private sharedServices: SharedServices
    ) { }

  ngOnInit() {
    this.getFanbaseList();
  }

  getFanbaseList(order_by?:string){
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }
    this.fanbaseService.getFanbase({order_by, seq: this.seq})
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

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idol } from 'src/app/models/idol';
import { IdolService } from 'src/app/services/idol.service';
import { SharedServices } from 'src/app/services/shared-services';

@Component({
  selector: 'app-idol-list',
  templateUrl: './idol-list.component.html',
  styleUrls: ['./idol-list.component.css']
})
export class IdolListComponent {
  idolList: Idol[] = [];
  seq?: string;
  prevSelectedOrder:string = '';
  selectedOrder:string = '';

  constructor(
    private idolService: IdolService, 
    private router: Router,
    private sharedServices: SharedServices
    ) { }

  ngOnInit() {
    this.getIdolList();
  }

  getIdolList(order_by?:string) {
    this.sharedServices.changeLoading(true);
    if (order_by != undefined) {
      this.selectedOrder = order_by;
      this.seq = this.seq == 'ASC' && this.prevSelectedOrder == this.selectedOrder ? 'DESC' : 'ASC';
      this.prevSelectedOrder = this.selectedOrder;
    }
    this.idolService.getIdol({order_by, seq: this.seq})
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
}

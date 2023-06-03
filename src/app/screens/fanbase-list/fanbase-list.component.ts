import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fanbase } from 'src/app/models/fanbase';
import { FanbaseService } from 'src/app/services/fanbase.service';

@Component({
  selector: 'app-fanbase-list',
  templateUrl: './fanbase-list.component.html',
  styleUrls: ['./fanbase-list.component.css']
})
export class FanbaseListComponent {
  fanbaseList: Fanbase[] = [];

  constructor(private fanbaseService: FanbaseService, private router: Router) { }

  ngOnInit() {
    this.getFanbaseList();
  }

  getFanbaseList(){
    this.fanbaseService.getFanbase()
      .subscribe(fanbaseList => {
        this.fanbaseList = fanbaseList;
      });
  }

}

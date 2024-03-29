import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idol } from 'src/app/models/idol';
import { IdolService } from 'src/app/services/idol.service';

@Component({
  selector: 'app-idol-list',
  templateUrl: './idol-list.component.html',
  styleUrls: ['./idol-list.component.css']
})
export class IdolListComponent {
  idolList: Idol[] = [];

  constructor(private idolService: IdolService, private router: Router) { }

  ngOnInit() {
    this.getIdolList();
  }

  getIdolList(){
    this.idolService.getIdol()
      .subscribe(idolList => {
        this.idolList = idolList;
      });
  }
}

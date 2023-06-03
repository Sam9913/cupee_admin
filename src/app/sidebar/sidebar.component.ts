import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  index: number;
  selectedEvent: string = 'home';
  subscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.index = 0;
  }

  ngOnInit() {
    this.clickItem('home');
    this.subscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          var url = this.router.url;
          
          if(url.includes('account')){
            this.selectedEvent = 'account';
          }else if(url.includes('event')){
            this.selectedEvent = 'event';
          }else if(url.includes('fanbase')){
            this.selectedEvent = 'fanbase';
          }else if(url.includes('idol')){
            this.selectedEvent = 'idol';
          }else if(url.includes('venue')){
            this.selectedEvent = 'venue';
          }else{
            this.selectedEvent = 'home';
          }
          this.clickItem(this.selectedEvent);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clickItem(id: string) {
    const sidebarItemList = document.getElementsByClassName('material-symbols-outlined');
    const sidebarItem = document.getElementById(id);

    //remove all selected color
    for (let i = 0; i < sidebarItemList.length; i++) {
      const currentId = sidebarItemList[i].id;
      if (currentId != id) {
        sidebarItemList[i].classList.remove('selected-sidebar-item');

        const sidebarSelectItem = document.getElementById(currentId + '_sidebar');
        if (sidebarSelectItem != null) {
          sidebarSelectItem.classList.remove('bg-pink');
        }
      }
    }

    //add selected color
    if (sidebarItem != null) {
      sidebarItem.classList.add('selected-sidebar-item');

      const sidebarSelectItem = document.getElementById(id + '_sidebar');
      if (sidebarSelectItem != null) {
        sidebarSelectItem.classList.add('bg-pink');
      }
    }
  }

  logout(){
    this.authService.logout()
        .subscribe(result => {
          if(result != undefined){
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          }
        });
  }
}

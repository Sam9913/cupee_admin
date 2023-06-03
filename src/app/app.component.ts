import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cupee_admin';
  subscription!: Subscription;
  isLoginPage:boolean = false;
  message:string = '';

  constructor(private router: Router ) {
    
  }

  ngOnInit(){
    this.message = sessionStorage.getItem('message') ?? '';
    setTimeout(() => {
      sessionStorage.removeItem('message');
    }, 200);

    this.subscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if(this.router.url == '/'){
            this.isLoginPage = true;
          }else{
            this.isLoginPage = false;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

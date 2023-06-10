import { Component,AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServices } from './services/shared-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  title = 'cupee_admin';
  subscription!: Subscription;
  isLoginPage: boolean = false;
  message: string = '';
  show: boolean = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sharedServices: SharedServices,
  ) {
  }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.message = sessionStorage.getItem('message') ?? '';
          setTimeout(() => {
            this.message = '';
            sessionStorage.removeItem('message');
          }, 1000);

          if (this.router.url == '/') {
            this.isLoginPage = true;
          } else {
            this.isLoginPage = false;
          }
        }
      }
    );
    this.subscribeChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  subscribeChanges() {
    this.sharedServices.isLoading$.subscribe(isLoading => {
      this.changeLoading(isLoading);
    });

    this.sharedServices.message$.subscribe(message => {
      this.changeMessage(message);
    });
  }

  changeLoading(show: boolean) {
    this.show = show;
  }

  changeMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 1000);
  }
}

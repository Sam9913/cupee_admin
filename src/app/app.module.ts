import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from "@angular/material/dialog";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EventListComponent } from './screens/event-list/event-list.component';
import { EventDetailComponent } from './screens/event-detail/event-detail.component';
import { FanbaseListComponent } from './screens/fanbase-list/fanbase-list.component';
import { FanbaseDetailComponent } from './screens/fanbase-detail/fanbase-detail.component';
import { BookingListComponent } from './screens/booking-list/booking-list.component';
import { IdolListComponent } from './screens/idol-list/idol-list.component';
import { IdolDetailComponent } from './screens/idol-detail/idol-detail.component';
import { VenueListComponent } from './screens/venue-list/venue-list.component';
import { VenueDetailComponent } from './screens/venue-detail/venue-detail.component';
import { LoginComponent } from './screens/login/login.component';
import { SettingComponent } from './screens/setting/setting.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    EventListComponent,
    EventDetailComponent,
    FanbaseListComponent,
    FanbaseDetailComponent,
    BookingListComponent,
    IdolListComponent,
    IdolDetailComponent,
    VenueListComponent,
    VenueDetailComponent,
    LoginComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    RouterModule.forRoot([
      { path: '', component: DashboardComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/:eventId', component: EventDetailComponent },
      { path: 'booking/:eventId', component: BookingListComponent },
      { path: 'fanbases', component: FanbaseListComponent },
      { path: 'fanbases/:fanbaseId', component: FanbaseDetailComponent },
      { path: 'idols', component: IdolListComponent },
      { path: 'idols/:idolId', component: IdolDetailComponent },
      { path: 'venues', component: VenueListComponent },
      { path: 'venues/:venueId', component: VenueDetailComponent },
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

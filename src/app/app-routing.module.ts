import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { EventListComponent } from './screens/event-list/event-list.component';
import { EventDetailComponent } from './screens/event-detail/event-detail.component';
import { FanbaseListComponent } from './screens/fanbase-list/fanbase-list.component';
import { FanbaseDetailComponent } from './screens/fanbase-detail/fanbase-detail.component';
import { IdolListComponent } from './screens/idol-list/idol-list.component';
import { IdolDetailComponent } from './screens/idol-detail/idol-detail.component';
import { VenueListComponent } from './screens/venue-list/venue-list.component';
import { VenueDetailComponent } from './screens/venue-detail/venue-detail.component';
import { LoginComponent } from './screens/login/login.component';
import { SettingComponent } from './screens/setting/setting.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'event', component: EventListComponent },
  { path: 'event/detail', component: EventDetailComponent },
  { path: 'event/detail/:id', component: EventDetailComponent },
  { path: 'fanbase', component: FanbaseListComponent },
  { path: 'fanbase/detail', component: FanbaseDetailComponent },
  { path: 'fanbase/detail/:id', component: FanbaseDetailComponent },
  { path: 'idol', component: IdolListComponent },
  { path: 'idol/detail', component: IdolDetailComponent },
  { path: 'idol/detail/:id', component: IdolDetailComponent },
  { path: 'venue', component: VenueListComponent },
  { path: 'venue/detail', component: VenueDetailComponent },
  { path: 'venue/detail/:id', component: VenueDetailComponent },
  { path: 'setting', component: SettingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

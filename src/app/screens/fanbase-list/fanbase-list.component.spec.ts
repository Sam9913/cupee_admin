import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanbaseListComponent } from './fanbase-list.component';

describe('FanbaseListComponent', () => {
  let component: FanbaseListComponent;
  let fixture: ComponentFixture<FanbaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FanbaseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FanbaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

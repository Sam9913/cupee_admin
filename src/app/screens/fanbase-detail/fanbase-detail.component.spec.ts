import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanbaseDetailComponent } from './fanbase-detail.component';

describe('FanbaseDetailComponent', () => {
  let component: FanbaseDetailComponent;
  let fixture: ComponentFixture<FanbaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FanbaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FanbaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanbaseComponent } from './fanbase.component';

describe('FanbaseComponent', () => {
  let component: FanbaseComponent;
  let fixture: ComponentFixture<FanbaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanbaseComponent]
    });
    fixture = TestBed.createComponent(FanbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

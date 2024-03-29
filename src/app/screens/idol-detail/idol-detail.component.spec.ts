import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdolDetailComponent } from './idol-detail.component';

describe('IdolDetailComponent', () => {
  let component: IdolDetailComponent;
  let fixture: ComponentFixture<IdolDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdolDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

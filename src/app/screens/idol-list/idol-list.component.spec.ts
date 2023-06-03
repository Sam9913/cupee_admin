import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdolListComponent } from './idol-list.component';

describe('IdolListComponent', () => {
  let component: IdolListComponent;
  let fixture: ComponentFixture<IdolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdolListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FanbaseService } from './fanbase.service';

describe('FanbaseService', () => {
  let service: FanbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FanbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProximityService } from './proximity.service';

describe('ProximityService', () => {
  let service: ProximityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProximityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

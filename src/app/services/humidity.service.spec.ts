import { TestBed } from '@angular/core/testing';

import { HumidityService } from './humidity.service';

describe('HumidityService', () => {
  let service: HumidityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumidityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

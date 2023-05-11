import { TestBed } from '@angular/core/testing';

import { AccelerometerService } from './accelerometer.service';

describe('AccelerometerService', () => {
  let service: AccelerometerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccelerometerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

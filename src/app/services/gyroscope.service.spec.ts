import { TestBed } from '@angular/core/testing';

import { GyroscopeService } from './gyroscope.service';

describe('GyroscopeService', () => {
  let service: GyroscopeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GyroscopeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

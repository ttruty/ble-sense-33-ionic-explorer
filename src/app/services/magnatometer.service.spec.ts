import { TestBed } from '@angular/core/testing';

import { MagnatometerService } from './magnatometer.service';

describe('MagnatometerService', () => {
  let service: MagnatometerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagnatometerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

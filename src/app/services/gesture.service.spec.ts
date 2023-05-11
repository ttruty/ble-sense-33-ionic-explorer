import { TestBed } from '@angular/core/testing';

import { GestureService } from './gesture.service';

describe('GestureService', () => {
  let service: GestureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BluetoothService } from './bluetooth.service';

describe('BleService', () => {
  let service: BluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProximityService {
  proximity: number | undefined;

  isConnected: boolean = false;
  deviceId: string | undefined;

  constructor(
    private bluetoothService: BluetoothService
  ) {
    this.bluetoothService.deviceId.subscribe((id) => {
      this.deviceId = id;
    });

    this.bluetoothService.connectionData.pipe(
      take(1),
      map(
      (connected) => {
      this.isConnected = connected;
      //set up the notification
      if (connected) {
        this.bluetoothService.proxNotifyData(this.deviceId!, "19B10008-E8F2-537E-4F6C-D104768A1214", "19B10015-E8F2-537E-4F6C-D104768A1214");
      }
    })).subscribe();


    this.bluetoothService.proxData.subscribe((data) => {
      this.proximity = data;
    });
   }
}

import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestureService {
  gesture: string | undefined;

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
        this.bluetoothService.onGestureNotifyData(this.deviceId!, "19B10008-E8F2-537E-4F6C-D104768A1214", "19B10014-E8F2-537E-4F6C-D104768A1214");
      }
    })).subscribe();


    this.bluetoothService.gestData.subscribe((data) => {
      console.log('notify data', data);
      const directionInt = data[0];
      if (directionInt === 0) {
        this.gesture = 'up';
      }
      if (directionInt === 1) {
        this.gesture = 'down';
      }
      if (directionInt === 2) {
        this.gesture = 'left';
      }
      if (directionInt === 3) {
        this.gesture = 'right';
      }
    }
    );
   }
}

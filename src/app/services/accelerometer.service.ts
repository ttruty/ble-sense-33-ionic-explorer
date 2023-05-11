import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccelerometerService {
  datasets: any[] = [{
    data: [],
    fill: false,
    label: 'X',
    pointRadius: 0,
  }, {
    data: [],
    fill: false,
    label: 'Y',
    pointRadius: 0,
  },{
    data: [],
    fill: false,
    label: 'Z',
    pointRadius: 0,
  }];

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
        console.log("connected starting notification", connected);
        this.bluetoothService.accelNotifyData(this.deviceId!, "19B10010-E8F2-537E-4F6C-D104768A1214", "19B10011-E8F2-537E-4F6C-D104768A1214");
      }
    })).subscribe();


    this.bluetoothService.accelData.subscribe((data) => {
      this.datasets[0].data.push({
        x: Date.now(),
        y: data[0]
      });
      this.datasets[1].data.push({
        x: Date.now(),
        y: data[1]
      });
      this.datasets[2].data.push({
        x: Date.now(),
        y: data[2]
      });
    });
   }
}

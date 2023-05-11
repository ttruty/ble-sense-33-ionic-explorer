import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { Subscription, map, take } from 'rxjs';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { AccelerometerService } from '../services/accelerometer.service';
import { GyroscopeService } from '../services/gyroscope.service';
import { MagnatometerService } from '../services/magnatometer.service';
import { TemperatureService } from '../services/temperature.service';
import { HumidityService } from '../services/humidity.service';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit, OnDestroy {

  @Input() name?: string;
  isConnected: boolean = false;
  deviceId: string | null = '';
  direction: string = '';
  gestureSub: Subscription | undefined;

  constructor(private bluetoothService: BluetoothService,
    public accelService: AccelerometerService,
    public gyroService: GyroscopeService,
    public magService: MagnatometerService,
    public tempService: TemperatureService,
    public humService: HumidityService,) {
    //this.bluetoothService.initializeBluetooth();
  }

  ngOnInit() {
    this.bluetoothService.deviceId.subscribe((id) => {
      this.deviceId = id;
    });

    this.bluetoothService.connectionData.pipe(
      take(1),
      map((connected) => {
      this.isConnected = connected;
      //set up the notification
      if (connected) {
        this.bluetoothService.onGestureNotifyData(this.deviceId!, "19B10010-E8F2-537E-4F6C-D104768A1214", "19B10014-E8F2-537E-4F6C-D104768A1214");
      }
    })).subscribe();

    //subscribe to notifty data
    this.gestureSub = this.bluetoothService.notifyData.subscribe((data) => {
      console.log('notify data', data);
      const directionInt = data[0];
      if (directionInt === 0) {
        this.direction = 'up';
      }
      if (directionInt === 1) {
        this.direction = 'down';
      }
      if (directionInt === 2) {
        this.direction = 'left';
      }
      if (directionInt === 3) {
        this.direction = 'right';
      }
    }
    );
  }

  convertCtoF(c: number) {
    return c * 9 / 5 + 32;
  }

  ngOnDestroy() {
    if (this.gestureSub) {
      this.gestureSub.unsubscribe();
    }
  }

  webScan() {
    this.bluetoothService.onNewBluetooth();
    this.bluetoothService.initializeBluetooth()
  }

  disconnect() {
    this.bluetoothService.onNewBluetooth();
  }
}

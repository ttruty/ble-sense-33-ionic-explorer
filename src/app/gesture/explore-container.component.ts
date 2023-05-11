import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { Subscription, map, take } from 'rxjs';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { AccelerometerService } from '../services/accelerometer.service';
import { GyroscopeService } from '../services/gyroscope.service';
import { MagnatometerService } from '../services/magnatometer.service';
import { TemperatureService } from '../services/temperature.service';
import { HumidityService } from '../services/humidity.service';
import { ProximityService } from '../services/proximity.service';
import { GestureService } from '../services/gesture.service';

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
    public humService: HumidityService,
    public gestService: GestureService,
    public proxService: ProximityService,) {
    //this.bluetoothService.initializeBluetooth();
  }

  ngOnInit() {
    this.bluetoothService.connectionData.pipe(
      take(1),
      map(
      (connected) => {
      this.isConnected = connected;
      //set up the notification
    })).subscribe();
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

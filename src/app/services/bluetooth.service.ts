import { Capacitor } from '@capacitor/core';
import { Injectable, NgZone } from '@angular/core';
import {BleClient,textToDataView} from '@capacitor-community/bluetooth-le';
import { from, Subject } from 'rxjs';
import { map, take} from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { ScanResult } from './../../../node_modules/@capacitor-community/bluetooth-le/dist/esm/definitions.d';


interface BluetoothDevice {
  deviceId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  selectedDevice: any;
  statusMessage: string = "";
  isReconnecting = false;
  reconnectCount = 0;
  reconnectThreshold = 5;
  public _deviceId = new Subject<string>();
  public _connection = new Subject<boolean>();
  public _bleEnabled = new Subject<boolean>();
  public _recordingState = new Subject<boolean>();
  private _device = new Subject<any>();
  private _mapData = new Subject<any>();
  private _gestData = new Subject<any>();
  private _accelData = new Subject<any>();
  private _gyroData = new Subject<any>();
  private _magData = new Subject<any>();
  private _tempData = new Subject<any>();
  private _humData = new Subject<any>();
  private _proxData = new Subject<any>();
  isConnected: boolean = false;
  isConnecting: boolean = false;

  constructor(
    private ngZone: NgZone,
  ) {
     this.initialize();
  }

  get bleEnabledObs() {
    return this._bleEnabled.asObservable();
  }

  get connectionData() {
    return this._connection.asObservable();
  }

  get deviceId() {
    return this._deviceId.asObservable();
  }

  get device() {
    return this._device.asObservable();
  }

  get mapData() {
    return this._mapData.asObservable();
  }

  get gestData() {
    return this._gestData.asObservable();
  }

  get accelData() {
    return this._accelData.asObservable();
  }
  get magData() {
    return this._magData.asObservable();
  }
  get gyroData() {
    return this._gyroData.asObservable();
  }
  get tempData() {
    return this._tempData.asObservable();
  }
  get humData() {
    return this._humData.asObservable();
  }
  get proxData() {
    return this._proxData.asObservable();
  }

  get recordingState() {
    return this._recordingState.asObservable();
  }

  /**
   * @description: initialize the bluetooth connection
   */
  initialize() {
    try {
      BleClient.initialize().then(
        (success) => {
          this._bleEnabled.next(true);
        },
        (failure) => {
          this._bleEnabled.next(false);
        }
      );
    } catch (error) {
      console.log('BLE INITIALIZE ERROR:', error);
    }
  }

  stopScan() {
    try {
      BleClient.stopLEScan();
    } catch (error) {
      console.log('BLE DEINITIALIZE ERROR:', error);
    }
  }

  checkBluetooth() {
    return BleClient.isEnabled();
  }

  disconnectDevice(id: string) {
    return BleClient.disconnect(id);
  }

  requestDevice() {
    return BleClient.requestDevice({
      services: ['19B10010-E8F2-537E-4F6C-D104768A1214', '19B10009-E8F2-537E-4F6C-D104768A1214', '19B10008-E8F2-537E-4F6C-D104768A1214'],
    }).then((deviceId) => {
      console.log('DEVICE ID:', deviceId);
      this.onConnectDevice(deviceId.deviceId);
    }).catch((error) => {
      console.log('ERROR requestDevice():', error);
    }).catch((error) => {
      console.log('ERROR requestDevice():', error);
    });
  }

  removeDevice() {
    Preferences.remove({ key: 'bluetooth_device' });
  }

  autoConnect() {
    return from(Preferences.get({ key: 'bluetooth_device' })).pipe(
      map((storedData) => {
        console.log('Stored Data:', storedData);
        if (!storedData || !storedData.value) {
          return null;
        }
        return storedData.value;
      })
    );
  }

  listDevices() {
    this.setStatus('Scanning for bluetooth LE devices');
    BleClient.requestLEScan({}, (result) => {
      this.onDeviceDiscovered(result);
    });
    setTimeout(() => {
      BleClient.stopLEScan();
    }, 10000);
    /*Msg:
        Found Device
        {"device":
        {"deviceId":"B8:27:EB:E9:FA:63","name":"AwShift"},
        "localName":"AwShift",
        "rssi":-58,
        "txPower":127,
        "manufacturerData":{},
        "serviceData":{},
        "uuids":["472c4d58-ae52-11e9-a2a3-2a2ae2dbcce4"],
        "rawAdvertisement":{}}
    */
  }

  onConnectDevice(deviceId: string) {
    Preferences.set({ key: 'bluetooth_device', value: deviceId });
    this._deviceId.next(deviceId);

    if (Capacitor.getPlatform() === 'ios') {
      // need to scan device first on ios before connection
      BleClient.requestLEScan({}, (result: ScanResult) => {
        this.onDeviceDiscovered(result);
      });
      setTimeout(async () => {
        BleClient.stopLEScan();
        try {
          if (!this.isConnecting) {
            await this.tryConnect(deviceId);
          }
        }
        catch (connError) {
          console.log('ERROR onConnectDevice():', connError);
        }
      }, 10000); //longer scan will allow great chance of finding bt device.
    }

    // call disconnect before connect to take care of any hanging connections on android
    // https://github.com/capacitor-community/bluetooth-le#connection-fails-on-android
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'web') {
      try {
        BleClient.disconnect(deviceId).then(
          async (disconnectSuccess) => {
            console.log('DEVICE DISCONNECTED:', deviceId);
            if (!this.isConnecting) {
              await this.tryConnect(deviceId);
            }
          },
          (disconnectFailure) => {
            this._connection.next(false);
            this.isConnected = false;
          }
        );
      } catch (connError) {
        console.log('BLE CONNECTING ERROR:', connError);
        this._connection.next(false);
        this.isConnected = false;
      }
    }
  }

  tryConnect(deviceId: string) {
    //platform independent connection
    this.isConnecting = true;
    console.log('DEVICE CONNECTING:', deviceId);
    try{
      BleClient.connect(deviceId, (onDisconnect) => {
        this._connection.next(false);
        this.isConnected = false;
        console.log(
          'DEVICE DISCONNECTED:',
          deviceId,
          '---',
          new Date().toISOString()
        );
      }).then(
        (success) => {
          console.log('SUCCESS DEVICE CONNECTED:', deviceId);
          this.isReconnecting = false;
          this._connection.next(true);
          this.isConnected = true;
          this.reconnectCount = 0;
          this.isConnecting = false;
          return deviceId;
        },
        (failure) => {
          console.log(
            'DEVICE CONNECTION FAILURE IN SCAN:',
            failure,
            deviceId,
            '---',
            new Date().toISOString()
          );
          this.reconnectCount += 1;
          this.onConnectDevice(deviceId); // attempt to reconnect if failure in connection
        }
      );
    }
    catch (connError) {
      console.log('BLE CONNECTING ERROR:', connError);
    }
  }


  async onGestureNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: number[];
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parsDataReading(value);
        this._gestData.next(data);
      }
    );
  }

  async accelNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: Float32Array;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parseSensorDataReading(value);
        this._accelData.next(data);
      }
    );
  }
  async magNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: Float32Array;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parseSensorDataReading(value);
        this._magData.next(data);
      }
    );
  }
  async gyroNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: Float32Array;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parseSensorDataReading(value);
        this._gyroData.next(data);
      }
    );
  }

  async tempNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: Float32Array;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parseSensorDataReading(value);
        this._tempData.next(data);
      }
    );
  }
  async humNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: Float32Array;
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parseSensorDataReading(value);
        this._humData.next(data);
      }
    );
  }

  async proxNotifyData(deviceId:string, service:string, characteristic:string) {
    let data: number[];
    await BleClient.startNotifications(
      deviceId,
      service,
      characteristic,
      (value) => {
        data = this.parsDataReading(value);
        this._proxData.next(data[0]);
      }
    );
  }

  parseIntReading(data: DataView) {
    //parse the data from the dataview into a int
    const int = data.getUint16(0);
    return int;
  }


  parsDataReading(data: DataView) {
    const dataArray = [];
    const length = data.byteLength;
    for (let index = 0; index < length; index++) {
      const element = data.getUint8(index); //data from the subscription to the map object
      dataArray.push(element);
    }
    // console.log('Read BT data:', dataArray);
    return dataArray;
  }
  parseSensorDataReading(data: DataView) {
    //parse the data from the dataview into a float32
    const f32 = new Float32Array(data.buffer);
    return f32;
  }

  async onReadData(deviceId: string, service: string, characteristic: string) {
    await BleClient.read(
      deviceId,
      service,
      characteristic
    ).then(
      (readData) => {
        if (readData.byteLength > 0) {
          this._mapData.next(readData);
        }
      },
      (error) => {
        console.log('Read BT data error:' + error);
        if (error.message.includes('Not connected')) {
          if (!this.isReconnecting) {
            console.log('RECONNECTING TO', deviceId);
            this.isReconnecting = true;
            this._connection.next(false);
            this.isConnected = false;
            this.onConnectDevice(deviceId);
          }
        }
      }
    ).finally(() => {});
  }

  onDeviceDiscovered(device: ScanResult) {
    this.ngZone.run(() => {
      this._device.next(device);
    });
  }

  setStatus(message: string) {
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  initializeBluetooth() {
    if (!BleClient) {
      this.initialize();
    }
    this.checkBluetooth().then(
      (success) => {
        if (!success) {
          alert('Bluetooth Error, Bluetooth is not enabled, turn bluetooth on to continue');
        }
      },
      (error) => {
        alert(error);
      }
    );

    //---------- Bluetooth connection ----------//
    if (!this.isConnected && !this.isConnecting) {
      this
        .autoConnect()
        .pipe(
          map((id) => {
            if (id) {
              console.log("auto connect");
              this.onConnectDevice(id);
              this._deviceId.next(id!); //if id is null, it will throw an error, so we need to check
            } else {
              this.requestDevice();//if cannot auto connect request device
            }
          })
        )
        .subscribe();
    }
  }

  onNewBluetooth() {
    this.removeDevice();
    this.deviceId.pipe(take(1))
    .subscribe(
      (deviceId) => {
      if (deviceId) {
        // this.disconnectDevice(deviceId);
        this.initializeBluetooth();
      }
    })
  }
}

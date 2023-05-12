#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>
#include <Arduino_APDS9960.h>
#include <Arduino_HTS221.h>

int gesture = -1;
int oldGestureValue = -1;  

float old_temp = 0;
float old_hum = 0;


typedef struct accel_t {
  float x;
  float y;
  float z;
};

const int accel_union_size = sizeof(accel_t);

typedef struct gyro_t {
  float x;
  float y;
  float z;
};

const int gyro_union_size = sizeof(gyro_t);

typedef struct mag_t {
  float x;
  float y;
  float z;
};
const int mag_union_size = sizeof(mag_t);

typedef struct gest_t {
  int gesture;
};
const int gest_size = sizeof(gest_t);

typedef struct prox_t {
  int proximity;
};
const int prox_union_size = sizeof(prox_t);

typedef struct hum_t {
  float humidity;
};
const int hum_union_size = sizeof(hum_t);

typedef struct temp_t {
  float temperature;
};
const int temp_union_size = sizeof(temp_t);


typedef union accelPacket_t {
  accel_t structure;
  byte byteArray[accel_union_size];
};

typedef union gyroPacket_t {
  gyro_t structure;
  byte byteArray[gyro_union_size];
};

typedef union magPacket_t {
  mag_t structure;
  byte byteArray[mag_union_size];
};

typedef union gestPacket_t {
  gest_t structure;
  byte byteArray[gest_size];
};

typedef union proxPacket_t {
  prox_t structure;
  byte byteArray[prox_union_size];
};

typedef union humPacket_t {
  hum_t structure;
  byte byteArray[hum_union_size];
};

typedef union tempPacket_t {
  temp_t structure;
  byte byteArray[temp_union_size];
};

accelPacket_t accel;
gyroPacket_t gyro;
magPacket_t mag;
gestPacket_t gest;
proxPacket_t prox;
humPacket_t hum;
tempPacket_t temp;

BLEService IMUService("19B10010-E8F2-537E-4F6C-D104768A1214");  // create service
BLEService TempService("19B10009-E8F2-537E-4F6C-D104768A1214");
BLEService ProxService("19B10008-E8F2-537E-4F6C-D104768A1214");


// create switch characteristic and allow remote device to read and write
BLECharacteristic accelChar("19B10011-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, accel_union_size);
BLECharacteristic gyroChar("19B10012-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, gyro_union_size);
BLECharacteristic magChar("19B10013-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, mag_union_size);

BLECharacteristic gestChar("19B10014-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, gest_size);
BLECharacteristic proxChar("19B10015-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, gest_size);

BLECharacteristic humChar("19B10016-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, hum_union_size);
BLECharacteristic tempChar("19B10017-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, temp_union_size);

void setup() {
  Serial.begin(9600);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  };

  if (!HTS.begin()) {
    Serial.println("Failed to initialize humidity temperature sensor!");
    while (1);
  }

  if (!APDS.begin()) {
    Serial.println("* Error initializing APDS9960 sensor!");
  };
  APDS.setGestureSensitivity(80); 

  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");
    while (1);
  };

  // set device name
  BLE.setDeviceName("BLESense33");

  // set the local name peripheral advertises
  BLE.setLocalName("Sense33Service");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(IMUService);
  BLE.setAdvertisedService(TempService);
  BLE.setAdvertisedService(ProxService);

  // add the characteristics to the service
  IMUService.addCharacteristic(accelChar);
  IMUService.addCharacteristic(gyroChar);
  IMUService.addCharacteristic(magChar);
  
  ProxService.addCharacteristic(gestChar);
  ProxService.addCharacteristic(proxChar);

  TempService.addCharacteristic(humChar);
  TempService.addCharacteristic(tempChar);

  // add the service
  BLE.addService(IMUService);
  BLE.addService(TempService);
  BLE.addService(ProxService);

  accel.structure.x = 0.0;
  accel.structure.y = 0.0;
  accel.structure.z = 0.0;

  gyro.structure.x = 0.0;
  gyro.structure.y = 0.0;
  gyro.structure.z = 0.0;

  mag.structure.x = 0.0;
  mag.structure.y = 0.0;
  mag.structure.z = 0.0;

  gest.structure.gesture = gesture;
  prox.structure.proximity = 0.0;

  temp.structure.temperature = 0.0;
  hum.structure.humidity = 0.0;

  accelChar.writeValue(accel.byteArray, accel_union_size);
  gyroChar.writeValue(gyro.byteArray, gyro_union_size);
  magChar.writeValue(mag.byteArray, mag_union_size);
  
  gestChar.writeValue(gest.byteArray, gest_size);
  proxChar.writeValue(prox.byteArray, prox_union_size);

  tempChar.writeValue(temp.byteArray, temp_union_size);
  humChar.writeValue(hum.byteArray, hum_union_size);


  // start advertising
  BLE.advertise();
}

void loop() {
  BLE.poll();

  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    accel.structure.x = x;
    accel.structure.y = y;
    accel.structure.z = z;

    accelChar.writeValue(accel.byteArray, accel_union_size);
  }

  if (IMU.gyroscopeAvailable()) {
    IMU.readGyroscope(x, y, z);

    gyro.structure.x = x;
    gyro.structure.y = y;
    gyro.structure.z = z;

    gyroChar.writeValue(gyro.byteArray, gyro_union_size);
  }

  if (IMU.magneticFieldAvailable()) {
    IMU.readMagneticField(x, y, z);

    mag.structure.x = x;
    mag.structure.y = y;
    mag.structure.z = z;

    magChar.writeValue(mag.byteArray, mag_union_size);
  }

  if (APDS.proximityAvailable()) {
    prox.structure.proximity = APDS.readProximity();
    proxChar.writeValue(prox.byteArray, prox_union_size);
  }
    
    gesture = gestureDetectection();

    if (oldGestureValue != gesture) {  
      oldGestureValue = gesture;
      Serial.print("* Writing value to gesture_type characteristic: ");
      Serial.println(gesture);
      gest.structure.gesture = gesture;
      Serial.println("* Writing value to gesture_type characteristic done!");
      Serial.println(" ");
      gestChar.writeValue(gest.byteArray, gest_size);
    }

    float temperature = HTS.readTemperature();
    float humidity    = HTS.readHumidity();

    temp.structure.temperature = temperature;
    tempChar.writeValue(temp.byteArray, temp_union_size);

    hum.structure.humidity = humidity;
    humChar.writeValue(hum.byteArray, hum_union_size);

}

int gestureDetectection() {
  if (APDS.gestureAvailable()) {
    gesture = APDS.readGesture();

    switch (gesture) {
      case GESTURE_UP:
        Serial.println("- UP gesture detected");
        break;
      case GESTURE_DOWN:
        Serial.println("- DOWN gesture detected");
        break;
      case GESTURE_LEFT:
        Serial.println("- LEFT gesture detected");
        break;
      case GESTURE_RIGHT:
        Serial.println("- RIGHT gesture detected");
        break;
      default:
        Serial.println("- No gesture detected");
        break;
      }
    }
    return gesture;
}

# Arduino Nano 33 BLE Sense Sensor Demo

This project is an Angular Ionic application that showcases the use of sensors on an Arduino Nano 33 BLE Sense board. It establishes a Bluetooth connection between the board and the application, allowing real-time data streaming and visualization of sensor readings. Tested with web bluetooth, but can also be deployed as an iOS or Android applicaton

## Prerequisites

Before running the project, ensure you have the following prerequisites installed:

- 'Node.js' (v12 or higher)
- 'Ionic CLI' (v5 or higher)
- 'Arduino IDE' (for uploading firmware to the Arduino board)

## Getting Started

1. Clone this repository to your local machine:

   `git clone https://github.com/[this-repo]]](https://github.com/ttruty/ble-sense-33-ionic-explorer.git`

2. Navigate to the project directory:

   `cd ble-sense-33-ionic-explorer`

3. Install the project dependencies:

   `npm install`

4. Build the ionic app:

   `ionic build`

5. Connect your Arduino Nano 33 BLE Sense board to your computer using a USB cable.

6. Open the 'ardion-ble-sense-33-explorer.ino' file using the Arduino IDE.

7. Upload the firmware to your Arduino board.

8. Once the firmware is uploaded, start the Ionic development server:

   `ionic serve`

9. The Ionic app will now be accessible in your web browser at 'http://localhost:8100/'. You may need to grant permission to access Bluetooth devices in your browser when you click the "CONNECT" button.

10. On the app's home screen, click the "Connect" button to establish a Bluetooth connection with the Arduino Nano 33 BLE Sense board.

11. Once connected, you should see real-time sensor data displayed on the screen. The app supports visualizing data from various sensors, such as accelerometer, gyroscope, magnetometer, temperature, humidity, and more.

12. Experiment with the different sensors by interacting with the Arduino board or changing its orientation. The app will update the sensor readings accordingly.

## License

This project is licensed under the 'MIT License'.

## Acknowledgments

- [Arduino Nano 33 BLE Sense](https://store.arduino.cc/arduino-nano-33-ble-sense)
- [Ionic Framework](https://ionicframework.com/)
- [Angular Framework](https://angular.io/)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccelerometerComponent } from './accelerometer.component';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [AccelerometerComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgChartsModule
  ],
  exports: [AccelerometerComponent]
})
export class AccelerometerModule { }

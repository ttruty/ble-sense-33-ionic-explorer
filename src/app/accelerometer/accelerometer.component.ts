import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartStreaming from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';
Chart.register(ChartStreaming);


@Component({
  selector: 'app-accelerometer',
  templateUrl: './accelerometer.component.html',
  styleUrls: ['./accelerometer.component.scss'],
})
export class AccelerometerComponent  implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() datasets: any[] = [{
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

  options: any;
  constructor() { }

  ngOnInit() {
    //subscribe to device id

    this.options= {
      scales: {
        x: {
          type: 'realtime',


          realtime: {
            frameRate: 16000,
            duration: 20000,
            refresh: 1000,
            delay: 500,
          }

        },
        y: {
          ticks: {
            max: 200,
            min:0
          }
        }
      },
    };
  }
}

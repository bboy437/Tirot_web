import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent implements OnInit {
  dataTable: (string | Date)[][];
  chartData: { chartType: string; animation: { duration: number; easing: string; startup: boolean; }; dataTable: (string | Date)[][]; };
  @ViewChild('cchart') cchart;

  constructor() {
    Observable.timer(0, 1000).subscribe(timer => {
      console.log("timer", timer);

      if (timer == 3) {
        let dataTable = this.cchart.wrapper.getDataTable();
        let newvalue = { c : [{v: "A"},{v: "Washington"},{v: new Date(1789, 3, 30, 18, 5, 15)},{v: new Date(1789, 3, 30, 22, 5, 15)}]}
        dataTable.og.push(newvalue);
        this.cchart.redraw();
      }
    });

  }

  ngOnInit() {

    this.dataTable = [
      ['Type', 'Name', 'From', 'To'],
      ['A', 'Washington', new Date(1789, 3, 30, 12, 2, 5), new Date(1789, 3, 30, 13, 5, 15)],
      ['A', 'Adams', new Date(1789, 3, 30, 13, 5, 15), new Date(1789, 3, 30, 14, 5, 15)],
      ['A', 'Jefferson', new Date(1789, 3, 30, 14, 5, 15), new Date(1789, 3, 30, 18, 5, 15)],
    ]

    this.chartData = {
      chartType: 'Timeline',
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true
      },
      dataTable: this.dataTable
    }


  }

  public ready(event: ChartReadyEvent) {
    console.log(event);
  }

  public error(event: ChartErrorEvent) {
    // your logic
  }


}

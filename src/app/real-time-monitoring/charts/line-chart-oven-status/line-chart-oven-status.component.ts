import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { BrokerAPIService } from '../../../services/brokerapi.service';

@Component({
  selector: 'app-line-chart-oven-status',
  templateUrl: './line-chart-oven-status.component.html',
  styleUrls: ['./line-chart-oven-status.component.scss']
})
export class LineChartOvenStatusComponent implements OnInit {
  @Input() MachineID: string;
  @ViewChild('linechart') linechart;
  UrlAPI_GetCurrentNeotechOwenTemp: string = "Visualization/GetCurrentNeotechOwenTemp";

  dataTable: any = [];
  chartData: any = {};

  constructor(private brokerAPIService: BrokerAPIService) { }


  ngOnInit() {

    this.getAPICurrentNeotechOwenTemp();


    // this.dataTable = [
    //   ['Time','value','test'],

    //   [new Date(2018,12,13,1,7,0),34,null],
    //   [new Date(2018,12,13,1,9,0),37,null],

    //   [new Date(2018,12,13,1,8,0),null,34],
    //   [new Date(2018,12,13,1,13,0),null,37],

    // ]

    // this.chartData = {
    //   chartType: 'LineChart',
    //   dataTable: this.dataTable,
    //   options: {
    //     title: 'Oven Status',

    //     chartArea: { left: 50, width: "75%", height: "70%" },
    //       hAxis: {format: 'HH:mm',
    //       // gridlines: {count: 10}
    //     },
    //   }
    // }

  }

  private getAPICurrentNeotechOwenTemp() {
    console.log(this.UrlAPI_GetCurrentNeotechOwenTemp);
    this.brokerAPIService.get(this.UrlAPI_GetCurrentNeotechOwenTemp).subscribe(data => {
      console.log("UrlAPI_GetCurrentNeotechOwenTemp", data);
      if (data != null) {

        this.dataTable = [['Time', 'Oven#1', 'Oven#2', 'Oven#3', 'Oven#4', 'Oven#5']];


        data.owenTemp1.dailyLog.forEach(element => {
          this.dataTable.push([new Date(element.sensorDateTime), element.sensorNumericValue, null, null, null, null]);
        });

        data.owenTemp2.dailyLog.forEach(element => {
          this.dataTable.push([new Date(element.sensorDateTime), null, element.sensorNumericValue, null, null, null]);
        });

        data.owenTemp3.dailyLog.forEach(element => {
          this.dataTable.push([new Date(element.sensorDateTime), null, null, element.sensorNumericValue, null, null]);
        });

        data.owenTemp4.dailyLog.forEach(element => {
          this.dataTable.push([new Date(element.sensorDateTime), null, null, null, element.sensorNumericValue, null]);
        });

        data.owenTemp5.dailyLog.forEach(element => {
          this.dataTable.push([new Date(element.sensorDateTime), null, null, null, null, element.sensorNumericValue]);
        });

        //  console.log(this.dataTable);
        if (this.dataTable.length > 1) {
          this.chartData = {
            chartType: 'LineChart',
            dataTable: this.dataTable,

            options: {
              title: 'Oven Status',
           
              vAxis: {
                format: '#\' '+ data.owenTemp1.sensorValueUnitName +'\''
              },
              hAxis: { format: 'HH:mm' },
              chartArea: {
                left: 50, width: "75%", height: "70%",
              },
            }
          }
        }

      }
    });
  }



  private dataChange() {
    let dataTable = this.linechart.wrapper.getDataTable();
    let newvalue = { c: [{ v: "A" }, { v: "Washington" }, { v: new Date(1789, 3, 30, 18, 5, 15) }, { v: new Date(1789, 3, 30, 22, 5, 15) }] }
    dataTable.og.push(newvalue);
    this.linechart.redraw();
  }

  public ready(event: ChartReadyEvent) {
    //console.log(event);
    //  this.dataChange();
    let dataTable = this.linechart.wrapper.getDataTable();
    // console.log("dataTable", dataTable);

  }

  public error(event: ChartErrorEvent) {
    console.log(event);
  }

}

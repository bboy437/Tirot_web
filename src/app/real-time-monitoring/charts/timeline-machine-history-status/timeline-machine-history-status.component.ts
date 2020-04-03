import { Component, OnInit, Input, ViewChild, SimpleChange, OnChanges } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';

import { BrokerAPIService } from '../../../services/brokerapi.service';


@Component({
  selector: 'app-timeline-machine-history-status',
  templateUrl: './timeline-machine-history-status.component.html',
  styleUrls: ['./timeline-machine-history-status.component.scss']
})
export class TimelineMachineHistoryStatusComponent implements OnInit, OnChanges {

  @Input() LogDate: string;
  @Input() StartShift: string;
  @Input() EndShift: string;
  @ViewChild('timelinechart') timelinechart;
  StartStatusDateTime: string;
  EndStatusDateTime: string;

  objRow: any = {};
  dataTable: (string | Date)[][];
  DateSelected: number;
  pipe: string;

  UrlAPI_GetHistoryMachineAvailableList: string = "Visualization/GetHistoryMachineAvailableList/";

  chartData: any = {};

  constructor(private brokerAPIService: BrokerAPIService, ) { }




  ngOnInit() {
    this.getHistoryMachineAvailableList()
    this.DateSelected

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.getHistoryMachineAvailableList()
    console.log("ngOnChanges Shift",this.EndShift + this.StartShift);
    

  }


  private getHistoryMachineAvailableList() {
    console.log(this.UrlAPI_GetHistoryMachineAvailableList + this.LogDate);
    this.brokerAPIService.get(this.UrlAPI_GetHistoryMachineAvailableList + this.LogDate).subscribe(data => {
      console.log("UrlAPI_GetHistoryMachineAvailableList", data);
      this.dataTable = [
        ['Type', 'Name', 'From', 'To']
      ]

      if (data != null) {
        if (data.length > 0) {

    

          data.forEach(element => {
            if (element.dailyStatus.length > 0) {
              element.dailyStatus.forEach(dailyStatus => {
                let strmachineStatus: string;


                switch (dailyStatus.machineStatus) {
                  case 0:
                    strmachineStatus = "TurnOff";
                    break;
                  case 1:
                    strmachineStatus = "Running";
                    break;
                  case 2:
                    strmachineStatus = "Setup";
                    break;
                  case 3:
                    strmachineStatus = "Stop";
                    break;
                  case 4:
                    strmachineStatus = "QA";
                    break;
                 
                  default:
                    break;
                }

                let DateStart = new Date(dailyStatus.startStatusDateTime);
                let DateEnd = new Date(dailyStatus.endStatusDateTime);

                this.dataTable.push([element.machineName, strmachineStatus, DateStart, DateEnd]

                );

              });
            }
            else {
              this.dataTable.push(['MachineName', "Not Data", new Date(this.StartShift), new Date(this.EndShift)]);
            }

          });

        }
        else {
          this.dataTable.push(['MachineName', "Not Data", new Date(this.StartShift), new Date(this.EndShift)]);
        }

      }
      else {
        this.dataTable.push(['MachineName', "Not Data", new Date(this.StartShift), new Date(this.EndShift)]);
      }





      this.chartData = {
        chartType: 'Timeline',
        dataTable: this.dataTable,
        options: {
          colors: this.getColorsMachineStatus(data[0].dailyStatus)
        }
      }


    });

  }


  private getColorsMachineStatus(data: any) {
    console.log("getColorsMachineStatus", data);

    let colors: any = [];
    let colorMap = {
      // should contain a map of category -> color for every category
      0: 'rgb(65, 65, 65)', //Turn Off
      1: 'rgb(16, 150, 24)', //Running
      2: '#fff133', //Setup
      3: 'rgb(220, 57, 18)', //Stop
      4:  'rgb(51, 102, 204)', //QA
    }

    if (data != null) {
      if (data.length > 0) {
        let lookup = {};
        let items = data;
        let result = [];
        for (let item, i = 0; item = items[i++];) {
          let name = item.machineStatus;
          if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
          }
        }

        result.forEach(element => {
          colors.push(colorMap[element]);
        });
      }
      else {
        colors.push('black')
      }
    }
    else {
      colors.push('black')
    }
    return colors;
  }




  public ready(event: ChartReadyEvent) {
    console.log(event);
    //  this.dataChange();


  }

  public error(event: ChartErrorEvent) {
    console.log(event);
  }

  // btnSubmit() {

  // }



}

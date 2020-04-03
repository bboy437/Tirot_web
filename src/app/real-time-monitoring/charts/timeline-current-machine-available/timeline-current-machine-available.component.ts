import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { BrokerAPIService } from '../../../services/brokerapi.service';
import * as moment from "moment";
import { Moment } from "moment";
import { log } from 'util';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'primeng/api';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-timeline-current-machine-available',
  templateUrl: './timeline-current-machine-available.component.html',
  styleUrls: ['./timeline-current-machine-available.component.scss']
})
export class TimelineCurrentMachineAvailableComponent implements OnInit, OnChanges {
  @Input() MachineID: string;
  @ViewChild('timelinechart') timelinechart;

  private _hubConnection: HubConnection;
  msgs: Message[] = [];
  dataTable: any = {};

  UrlAPI_GetCurrentMachineAvailable: string = "Visualization/GetCurrentMachineAvailable/";
  chartData: any = {};

  constructor(private brokerAPIService: BrokerAPIService, ) { }

  ngOnInit() {
    //this.getAPICurrentMachineAvailable()
  }

  initSensor() {
    this._hubConnection = new HubConnectionBuilder().withUrl(AppConfig.settings.ServerApiMQUrl).build();  //new HubConnection('http://localhost:1874/notify');
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('UpdateMachineStatus', (data: any) => {
      this.msgs.push({ detail: data });
      //this.msgs.push({ id: SensorId, data: SensorTextValue, detail: SensorNumericValue });
      console.log("UpdateMachineStatus", data);
      //this.pieChartBindData(data);
      let dataTable = this.timelinechart.wrapper.getDataTable();
      console.log("dataTable", dataTable);
      let lengthdata = dataTable.og.length;
      console.log("lengthdata", lengthdata);
      let lastobj = dataTable.og[lengthdata - 1];
      console.log("lastobj", lastobj);

      let strmachineStatus: string;

      switch (data.curentStatus) {
        case 0:
          strmachineStatus = "Turn Off";
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


      //1 MachineName
      //2 StatusName
      //3 StartDate
      //4 EndDate
      if (strmachineStatus == lastobj.c[1].v) {
        lastobj.c[3].v = new Date();
      }
      else {
        let newvalue = { c: [{ v: data.machineName }, { v: strmachineStatus }, { v: new Date(lastobj.c[3].v) }, { v: new Date() }] }
        dataTable.og.push(newvalue);
      }
      this.timelinechart.redraw();

    });

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    //console.log("changes", changes);
    this.getAPICurrentMachineAvailable()
    this.initSensor();
  }

  private getAPICurrentMachineAvailable() {
    console.log(this.UrlAPI_GetCurrentMachineAvailable + this.MachineID);
    this.brokerAPIService.get(this.UrlAPI_GetCurrentMachineAvailable + this.MachineID).subscribe(data => {
      console.log("UrlAPI_GetCurrentMachineAvailable", data);
      this.dataTable = [
        ['Type', 'Name', 'From', 'To']
      ]

      console.log(data.dailyStatus);

      if (data.dailyStatus != null) {
        if (data.dailyStatus.length > 0) {


          data.dailyStatus.forEach(element => {
            let strmachineStatus: string;

            switch (element.machineStatus) {
              case 0:
                strmachineStatus = "Turn Off";
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

            let DateStart = new Date(element.startStatusDateTime);
            let DateEnd = new Date(element.endStatusDateTime);

            this.dataTable.push([data.machineName, strmachineStatus, DateStart, DateEnd]);

          });
        }
        else {
          this.dataTable.push(['A', "Not Data", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()-1), 
                                                         new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDay())]);
        }

      }
      else {
        this.dataTable.push(['A', "Not Data", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()-1), 
        new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDay())]);
      }


      console.log("this.dataTable", this.dataTable);
      this.chartData = {
        chartType: 'Timeline',
        dataTable: this.dataTable,
        options: {
          timeline: { showRowLabels: false },
          colors: this.getColorsMachineStatus(data)
        }
      }


    });



  }

  private getColorsMachineStatus(data: any) {
    let colors: any = [];
    let colorMap = {
      // should contain a map of category -> color for every category
      0: 'rgb(46, 46, 46)', // black Turn Off
      1: 'rgb(16, 150, 24)', //Running
      2: '#fff133', //Setup
      3: 'rgb(220, 57, 18)', //Stop
      4: 'rgb(51, 102, 204)', //QA
    }

    if (data.dailyStatus != null) {
      if (data.dailyStatus.length > 0) {
        let lookup = {};
        let items = data.dailyStatus;
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
        colors.push('rgb(46, 46, 46)')
      }
    }
    else {
      colors.push('rgb(46, 46, 46)')
    }
    return colors;
  }

  private dataChange() {
    let dataTable = this.timelinechart.wrapper.getDataTable();
    let newvalue = { c: [{ v: "A" }, { v: "Washington" }, { v: new Date(1789, 3, 30, 18, 5, 15) }, { v: new Date(1789, 3, 30, 22, 5, 15) }] }
    dataTable.og.push(newvalue);
    this.timelinechart.redraw();
  }

  public ready(event: ChartReadyEvent) {
    console.log(event);
    //  this.dataChange();


  }

  public error(event: ChartErrorEvent) {
    console.log(event);
  }

}

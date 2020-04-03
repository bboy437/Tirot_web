import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { BrokerAPIService } from '../../../services/brokerapi.service';
import { ChartReadyEvent } from 'ng2-google-charts';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'primeng/api';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-current-percent-availability',
  templateUrl: './chart-current-percent-availability.component.html',
  styleUrls: ['./chart-current-percent-availability.component.scss']
})
export class ChartCurrentPercentAvailabilityComponent implements OnInit,OnChanges {
  @Input() MachineID: string;
  
  private _hubConnection: HubConnection;
  msgs: Message[] = [];

  UrlAPI_GetCurrentPercentAvailability: string = "Visualization/GetCurrentPercentAvailabilityByMachine/";
  dataTable: any = [];
  pieChartData: { chartType: string; dataTable: any[][]; options:any };



  constructor(private brokerAPIService: BrokerAPIService, router: Router, ) { 
    router.events.subscribe((val) => {
      if(this._hubConnection != undefined)
      {
        this._hubConnection.stop();
      }
    
    });
  }

  ngOnInit() {
    
   
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log("changes", changes);
   this.getAPICurrentPercentAvailability();
   this.initSensor();
  }


  initSensor() {
    this._hubConnection = new HubConnectionBuilder().withUrl(AppConfig.settings.ServerApiMQUrl).build();  //new HubConnection('http://localhost:1874/notify');
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('UpdatePercentAvailable', (data: any) => {
      this.msgs.push({ detail: data });
      //this.msgs.push({ id: SensorId, data: SensorTextValue, detail: SensorNumericValue });
      console.log("UpdatePercentAvailable", data);
      this.pieChartBindData(data);
    });

  }


  private getAPICurrentPercentAvailability() {
    console.log("chart-current-percent-availability : MachineID", this.MachineID);
    this.brokerAPIService.get(this.UrlAPI_GetCurrentPercentAvailability + this.MachineID).subscribe(data => {
      console.log("UrlAPI_GetCurrentPercentAvailability", data);
      this.pieChartBindData(data);
    });
  }

  private pieChartBindData(data: any) {
    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Task', 'Percent Availability'],
        ['Running', data.running], //rgb(16, 150, 24) green
        ['Stop', data.stop], //rgb(220, 57, 18)red 
        ['Setup', data.setup], // #fff133 yello
        ['TurnOff', data.turnOff], // rgb((46, 46, 46) black
        ['QA', data.qa]//rgb(51, 102, 204) blue
      ],
      options: { 'title': 'Machine Availability', is3D: true,
       colors: ['rgb(16, 150, 24)', 'rgb(220, 57, 18)', '#fff133', 'rgb(65, 65, 65)', 'rgb(51, 102, 204)'] },
    };
  }

  public ready(event: ChartReadyEvent) {

    console.log(event);

    // this.brokerAPIService.get(this.UrlAPI_GetCurrentPercentAvailability).subscribe(data => {
    //   console.log("UrlAPI_GetCurrentPercentAvailability", data);

    //   this.pieChartData = {
    //     chartType: 'PieChart',
    //     dataTable: [
    //       ['Running', data.running],
    //       ['TurnOff', data.turnOff],
    //       ['Setup', data.setup],
    //       ['Stop', data.stop],
    //       ['QA', data.qa]
    //     ],
    //     options: { 'title': 'Tasks' },
    //   };

    // });
  }



}

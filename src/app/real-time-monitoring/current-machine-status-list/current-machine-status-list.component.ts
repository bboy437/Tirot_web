import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'primeng/api';
import { AppConfig } from '../../app.config';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-machine-status-list',
  templateUrl: './current-machine-status-list.component.html',
  styleUrls: ['./current-machine-status-list.component.scss']
})



export class CurrentMachineStatusListComponent implements OnInit {
  
  private _hubConnection: HubConnection;
  msgs: Message[] = [];
  UrlAPI_CurrentMachineStatusList: string = "Visualization/GetCurrentMachineStatusList";
  objarrMachineStatus: any = [];
  arrobjmachineGroupName: any = [];
  MachineGroupName: any;
  objarrMachineStatusfilter: any;
  url: any;



  constructor(private brokerAPIService: BrokerAPIService,router: Router,) { 
    router.events.subscribe((val) => {
      if(this._hubConnection != undefined)
      {
        this._hubConnection.stop();
      }
    
    });
  }
   

  ngOnInit() {

    this.url = "http://192.168.0.25:50353/reports/Tirot/test?ponofrom=800T&ponoto=1";

    this.MachineGroupName = 'ALL';
    this.getAPICurrentMachineStatusList();
    this.initSensor();
    // for (let index = 0; index < 12; index++) {
    //   this.objarrMachineStatus.push({});

    // }

  }

  ddlMachine_SelectIndexChange(data) {
    // console.log("ddlMachine_SelectIndexChange", data);
    if (data == 'ALL') {
      this.objarrMachineStatusfilter = this.objarrMachineStatus;
    }
    else {
      this.objarrMachineStatusfilter = this.objarrMachineStatus.filter(MachineStatus => MachineStatus.machineGroupName == data);
      //console.log(this.objarrMachineStatusfilter);
    }

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



      if (this.objarrMachineStatusfilter != null) {

        this.objarrMachineStatusfilter.forEach(element => {
          if (element.id = data.id) {
            console.log(element);
            element.curentStatus = data.curentStatus;
          }
        });
        // this.objarrMachineStatusfilter.filter(MachineStatus => MachineStatus.id === data.id)[0] = data;
        // console.log("objarrMachineStatus", this.objarrMachineStatusfilter);
      }



      // this.isLoadingResults = false;
    });
  }

  getAPICurrentMachineStatusList() {
    console.log(this.UrlAPI_CurrentMachineStatusList);
    this.brokerAPIService.get(this.UrlAPI_CurrentMachineStatusList).subscribe(data => {
      console.log("UrlAPI_GetCurrentProduction", data);

      // for (let index = 0; index < 12; index++) {

      //   let obj: any = {};
      //   obj.id = index;
      //   obj.machineName = "FAMA" + index;
      //   obj.curentStatus = Math.floor((Math.random() * 4) + 0);
      //   obj.machineModel = "test";
      //   obj.machineGroupName = Math.floor((Math.random() * 100) + 0);
      //   this.objarrMachineStatus.push(obj);

      // }


      // console.log("this.objarrMachineStatus", this.objarrMachineStatus);

      if (data != null) {
        this.objarrMachineStatus = data;
      }
      this.objarrMachineStatusfilter = this.objarrMachineStatus;
      this.arrobjmachineGroupName = this.getDistinctGroupName().sort(function (a, b) { return a - b });

      //   this.arrobjmachineGroupName = this.objarrMachineStatus.filter(function (value, index) { return this.objarrMachineStatus.indexOf(value.machineGroupName) == index.machineGroupName });

      // console.log("this.arrobjmachineGroupName",this.arrobjmachineGroupName);


      console.log("this.arrobjmachineGroupName", this.arrobjmachineGroupName);

    });
  }


  private getDistinctGroupName() {
    let unique = {};
    let distinct = [];
    for (let i in this.objarrMachineStatus) {
      if (typeof (unique[this.objarrMachineStatus[i].machineGroupName]) == "undefined") {
        distinct.push(this.objarrMachineStatus[i].machineGroupName);
      }
      unique[this.objarrMachineStatus[i].machineGroupName] = 0;
    }
    return distinct;
  }
}


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 

import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'primeng/api';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';
import { timeout } from 'rxjs/operators';
import { HubConnectionService } from '../../services/hubconnnection.service';

@Component({
  selector: 'app-real-time-monitoring',
  templateUrl: './real-time-monitoring.component.html',
  styleUrls: ['./real-time-monitoring.component.scss']
})
export class RealTimeMonitoringComponent implements OnInit {

  private UrlAPI_GetCurrentSensorByMachineList: string = "Visualization/GetCurrentSensorByMachineList/"
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/"
  private UrlAPI_GetProductionRecord: string = "ProductionRecord/Get/"
  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/"
  private UrlAPI_Machine_GetAllActive: string = "Machine/GetAllActive";

  private _hubConnection: HubConnection;
  msgs: Message[] = [];

  Process: any;
  jobOrderNo: any;
  productName: any;
  fabricRollNo: any;
  rollNo: any;
  startProductionTime: any;
  objCurrentSensor: any = {};
  statuses: any = [];
  MachineStatus: any;
  Motor: any;
  MainMotor: any;

  TempInOwen1: any;
  TempInOwen2: any;
  TempInOwen3: any;
  TempInOwen4: any;
  TempInOwen5: any;

  SpeedExhaustFan1: any;
  SpeedExhaustFan2: any;
  SpeedExhaustFan3: any;
  SpeedExhaustFan4: any;
  SpeedExhaustFan5: any;
  TensionControl: any;
  KnifeLevelL: any;
  KnifeLevelR: any;

  TempinExhaustDuct1: any;
  TempinExhaustDuct2: any;
  TempinExhaustDuct3: any;
  TempinExhaustDuct4: any;
  TempinExhaustDuct5: any;

  RightFanSpeedInOwen1: any;
  RightFanSpeedInOwen2: any;
  RightFanSpeedInOwen3: any;
  RightFanSpeedInOwen4: any;
  RightFanSpeedInOwen5: any;

  LeftFanSpeedInOwen1: any;
  LeftFanSpeedInOwen2: any;
  LeftFanSpeedInOwen3: any;
  LeftFanSpeedInOwen4: any;
  LeftFanSpeedInOwen5: any;
  WidthFabricIn: any;
  WidthFabricOut: any;
  shift: any;
  arrobjMachine: any;
  MachineID: any;
  objCurrentJob: any;
  objProductionRecord: any;

  constructor(private brokerAPIService: BrokerAPIService,
    router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) {
      router.events.subscribe((val) => {
        if(this._hubConnection != undefined)
        {
          this._hubConnection.stop();
        }
      
      });
     }

  async ngOnInit() {
    this.dialogService.showLoader(); //this.isLoadingResults = true;

    await this.getAPIMachineGetAllActive();
    await this.getAPICurrentSensor();
    await this.getAPICurrentJob();
    if (this.objCurrentJob != null) {
      await this.getAPIProductionRecord(this.objCurrentJob);
      if (this.objProductionRecord != null) {
        await this.getAPIProductionPlan(this.objProductionRecord);
      }
    }

  }


  async ddlMachine_SelectIndexChange(data) {
   
    console.log("ddlMachine_SelectIndexChange");
    if (this.objCurrentJob != null) {
      await this.getAPIProductionRecord(this.objCurrentJob);
      if (this.objProductionRecord != null) {
        await this.getAPIProductionPlan(this.objProductionRecord);
      }
    }
    await this.getAPICurrentJob();
  }


  async getAPICurrentJob() {

    this.dialogService.showLoader();
    await this.brokerAPIService.getAwait(
      this.UrlAPI_GetCurrentJob + this.MachineID,
      (data: any) => {
        this.objCurrentJob = data;
      }
    );
    this.dialogService.hideLoader();

    // this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + this.MachineID).subscribe(data => {
    //   console.log("UrlAPI_GetCurrentJob", data);
    //   if (data != null) {
    //     this.getProductionRecord(data);
    //   }
    // });

    // this.getCurrentSensor();
  }

  initSensor() {
    this._hubConnection = new HubConnectionBuilder().withUrl(AppConfig.settings.ServerApiMQUrl).build();  //new HubConnection('http://localhost:1874/notify');
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    //this.hubConnectionService.start();
    this._hubConnection.on('UpdateSensorData', (SensorId: Int32Array, SensorNumericValue: string, SensorTextValue: string, SensorDateTime: Date) => {
      this.msgs.push({ detail: SensorId.toString() + ' - ' + SensorNumericValue + ' : ' + SensorTextValue });
      //this.msgs.push({ id: SensorId, data: SensorTextValue, detail: SensorNumericValue });


      console.log('UpdateSensorData SensorId!' + SensorId.toString())

      if (SensorId.toString() == '11') {
        this.MachineStatus = SensorNumericValue;
        console.log("MachineStatus", SensorNumericValue + ' C : ' + SensorTextValue);
      }

      if (SensorId.toString() == '16') {
        this.Motor = SensorNumericValue;
        console.log("Motor", SensorNumericValue + ' C : ' + SensorTextValue);
      };

      if (SensorId.toString() == '57') {
        this.MainMotor = SensorNumericValue;
        console.log("MainMotor", SensorNumericValue + ' C : ' + SensorTextValue);
      };

      if (SensorId.toString() == '15') {
        this.TensionControl = SensorNumericValue;
      };

      if (SensorId.toString() == '20') {
        this.KnifeLevelR = SensorNumericValue;
      };

      if (SensorId.toString() == '21') {
        this.KnifeLevelL = SensorNumericValue;
      };

      if (SensorId.toString() == '25') {
        this.WidthFabricIn = SensorNumericValue;
      };

      if (SensorId.toString() == '56') {
        this.WidthFabricOut = SensorNumericValue;
      };


      if (SensorId.toString() == '28') {
        this.TempInOwen1 = SensorNumericValue;
      };
      if (SensorId.toString() == '29') {
        this.TempInOwen2 = SensorNumericValue;
      };
      if (SensorId.toString() == '30') {
        this.TempInOwen3 = SensorNumericValue;
      };
      if (SensorId.toString() == '31') {
        this.TempInOwen4 = SensorNumericValue;
      };
      if (SensorId.toString() == '32') {
        this.TempInOwen5 = SensorNumericValue;
      };

      //RightFanSpeedInOwen
      if (SensorId.toString() == '33') {
        this.RightFanSpeedInOwen1 = SensorNumericValue;
      };
      if (SensorId.toString() == '34') {
        this.RightFanSpeedInOwen2 = SensorNumericValue;
      };
      if (SensorId.toString() == '35') {
        this.RightFanSpeedInOwen3 = SensorNumericValue;
      };
      if (SensorId.toString() == '36') {
        this.RightFanSpeedInOwen4 = SensorNumericValue;
      };
      if (SensorId.toString() == '37') {
        this.RightFanSpeedInOwen5 = SensorNumericValue;
      };

      //LeftFanSpeedInOwen
      if (SensorId.toString() == '38') {
        this.LeftFanSpeedInOwen1 = SensorNumericValue;
      };
      if (SensorId.toString() == '39') {
        this.LeftFanSpeedInOwen2 = SensorNumericValue;
      };
      if (SensorId.toString() == '40') {
        this.LeftFanSpeedInOwen3 = SensorNumericValue;
      };
      if (SensorId.toString() == '41') {
        this.LeftFanSpeedInOwen4 = SensorNumericValue;
      };
      if (SensorId.toString() == '42') {
        this.LeftFanSpeedInOwen5 = SensorNumericValue;
      };

      if (SensorId.toString() == '43') {
        this.TempinExhaustDuct1 = SensorNumericValue;
      };
      if (SensorId.toString() == '44') {
        this.TempinExhaustDuct2 = SensorNumericValue;
      };
      if (SensorId.toString() == '45') {
        this.TempinExhaustDuct3 = SensorNumericValue;
      };
      if (SensorId.toString() == '46') {
        this.TempinExhaustDuct4 = SensorNumericValue;
      };
      if (SensorId.toString() == '47') {
        this.TempinExhaustDuct5 = SensorNumericValue;
      };


      if (SensorId.toString() == '49') {
        this.SpeedExhaustFan1 = SensorNumericValue;
      };
      if (SensorId.toString() == '50') {
        this.SpeedExhaustFan2 = SensorNumericValue;
      };
      if (SensorId.toString() == '51') {
        this.SpeedExhaustFan3 = SensorNumericValue;
      };
      if (SensorId.toString() == '52') {
        this.SpeedExhaustFan4 = SensorNumericValue;
      };
      if (SensorId.toString() == '53') {
        this.SpeedExhaustFan5 = SensorNumericValue;
      };


      if (SensorId.toString() == '18') {
        console.log(SensorNumericValue + ' C : ' + SensorTextValue);
      };
      if (SensorId.toString() == '19') {
        // this.view13 = SensorNumericValue + ' C : ' + SensorTextValue;
      };
      if (SensorId.toString() == '20') {
        // this.view15 = SensorNumericValue + ' C : ' + SensorTextValue;
      };

    });

  
    console.log('init Complete !');
    
    //this.isLoadingResults = false;
  }


  async getAPIMachineGetAllActive() {

    this.dialogService.showLoader();
    await this.brokerAPIService.getAwait(
      this.UrlAPI_Machine_GetAllActive,
      (data: any) => {
        this.arrobjMachine = data;
        this.MachineID = this.arrobjMachine[0].id;
        let params = this.route.snapshot.paramMap;
        if (params.has("MachineID")) {
          this.MachineID = Number(params.get("MachineID"));
        }
      }
    );
    this.dialogService.hideLoader();
    // this.brokerAPIService.get(this.UrlAPI_Machine_GetAllActive).subscribe(data => {
    //   if (data != null) {
    //     this.arrobjMachine = data;
    //     this.MachineID = this.arrobjMachine[0].id;
    //     let params = this.route.snapshot.paramMap;
    //     if (params.has("MachineID")) {
    //       this.MachineID = Number(params.get("MachineID"));
    //     }

    //     this.getAPICurrentJob();
    //   }
    // });

  }

  rejectGetAPI(err: any): any {
    //this.dialogService.showDialog("","","");
  }




  async getAPICurrentSensor() {

    let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentSensorByMachineList + this.MachineID);
    if (data != null) {

      this.objCurrentSensor = data;
      console.log("this.UrlAPI_GetCurrentSensorByMachineList" + this.MachineID, data);
      this.statuses = data.statuses;
      //console.log("this.UrlAPI_GetCurrentSensorByMachineList statuses" + this.MachineID, this.statuses);
      this.MachineStatus = this.getSensor(11);//this.statuses.filter(sensor => sensor.sensorId === 11)[0].sensorNumericValue;
      this.Motor = this.getSensor(16);// this.statuses.filter(sensor => sensor.sensorId === 16)[0].sensorNumericValue;
      this.MainMotor = this.getSensor(57); //this.statuses.filter(sensor => sensor.sensorId === 57)[0].sensorNumericValue;
      this.TensionControl = this.getSensor(15);

      this.WidthFabricIn = this.getSensor(25);
      this.WidthFabricOut = this.getSensor(56);

      this.KnifeLevelL = this.getSensor(21);
      this.KnifeLevelR = this.getSensor(20);
      //Temp
      this.TempInOwen1 = this.getSensor(28);
      this.TempInOwen2 = this.getSensor(29);
      this.TempInOwen3 = this.getSensor(30);
      this.TempInOwen4 = this.getSensor(31);
      this.TempInOwen5 = this.getSensor(32);

      this.TempinExhaustDuct1 = this.getSensor(43);
      this.TempinExhaustDuct2 = this.getSensor(44);
      this.TempinExhaustDuct3 = this.getSensor(45);
      this.TempinExhaustDuct4 = this.getSensor(46);
      this.TempinExhaustDuct5 = this.getSensor(47);

      this.SpeedExhaustFan1 = this.getSensor(49);
      this.SpeedExhaustFan2 = this.getSensor(50);
      this.SpeedExhaustFan3 = this.getSensor(51);
      this.SpeedExhaustFan4 = this.getSensor(52);
      this.SpeedExhaustFan5 = this.getSensor(53);

      this.RightFanSpeedInOwen1 = this.getSensor(33);
      this.RightFanSpeedInOwen2 = this.getSensor(34);
      this.RightFanSpeedInOwen3 = this.getSensor(35);
      this.RightFanSpeedInOwen4 = this.getSensor(36);
      this.RightFanSpeedInOwen5 = this.getSensor(37);

      this.LeftFanSpeedInOwen1 = this.getSensor(38);
      this.LeftFanSpeedInOwen2 = this.getSensor(39);
      this.LeftFanSpeedInOwen3 = this.getSensor(40);
      this.LeftFanSpeedInOwen4 = this.getSensor(41);
      this.LeftFanSpeedInOwen5 = this.getSensor(42);

      console.log("MachineStatus", this.MachineStatus);
      this.initSensor();
    }

    // this.brokerAPIService.get(this.UrlAPI_GetCurrentSensorByMachineList + this.MachineID).subscribe(data => {
    //   if (data != null) {

    //     this.objCurrentSensor = data;
    //     console.log("this.UrlAPI_GetCurrentSensorByMachineList" + this.MachineID, data);
    //     this.statuses = data.statuses;
    //     this.MachineStatus = this.getSensor(11);//this.statuses.filter(sensor => sensor.sensorId === 11)[0].sensorNumericValue;
    //     this.Motor = this.getSensor(16);// this.statuses.filter(sensor => sensor.sensorId === 16)[0].sensorNumericValue;
    //     this.MainMotor = this.getSensor(57); //this.statuses.filter(sensor => sensor.sensorId === 57)[0].sensorNumericValue;
    //     this.TensionControl = this.getSensor(15);

    //     this.WidthFabricIn = this.getSensor(25);
    //     this.WidthFabricOut = this.getSensor(56);

    //     this.KnifeLevelL = this.getSensor(21);
    //     this.KnifeLevelR = this.getSensor(20);
    //     //Temp
    //     this.TempInOwen1 = this.getSensor(28);
    //     this.TempInOwen2 = this.getSensor(29);
    //     this.TempInOwen3 = this.getSensor(30);
    //     this.TempInOwen4 = this.getSensor(31);
    //     this.TempInOwen5 = this.getSensor(32);

    //     this.TempinExhaustDuct1 = this.getSensor(43);
    //     this.TempinExhaustDuct2 = this.getSensor(44);
    //     this.TempinExhaustDuct3 = this.getSensor(45);
    //     this.TempinExhaustDuct4 = this.getSensor(46);
    //     this.TempinExhaustDuct5 = this.getSensor(47);

    //     this.SpeedExhaustFan1 = this.getSensor(49);
    //     this.SpeedExhaustFan2 = this.getSensor(50);
    //     this.SpeedExhaustFan3 = this.getSensor(51);
    //     this.SpeedExhaustFan4 = this.getSensor(52);
    //     this.SpeedExhaustFan5 = this.getSensor(53);

    //     this.RightFanSpeedInOwen1 = this.getSensor(33);
    //     this.RightFanSpeedInOwen2 = this.getSensor(34);
    //     this.RightFanSpeedInOwen3 = this.getSensor(35);
    //     this.RightFanSpeedInOwen4 = this.getSensor(36);
    //     this.RightFanSpeedInOwen5 = this.getSensor(37);

    //     this.LeftFanSpeedInOwen1 = this.getSensor(38);
    //     this.LeftFanSpeedInOwen2 = this.getSensor(39);
    //     this.LeftFanSpeedInOwen3 = this.getSensor(40);
    //     this.LeftFanSpeedInOwen4 = this.getSensor(41);
    //     this.LeftFanSpeedInOwen5 = this.getSensor(42);

    //     console.log("MachineStatus", this.MachineStatus);
    //     this.initSensor();
    //   }
    // });
  }

  private getSensor(sensorId: number): any {
    // console.log("getSensor  ","sensorId : " + sensorId + " " +this.statuses.filter(sensor => sensor.sensorId === sensorId));
    let arrojbSensor: any = [];
    arrojbSensor = this.statuses.filter(sensor => sensor.sensorId === sensorId);
    // console.log("arrojbSensor : ",arrojbSensor);
    if (arrojbSensor.length == 1) {
      return arrojbSensor[0].sensorNumericValue;
    }
    else {
      console.log("can not found sensorId " + sensorId);
      return {};
    }

  }

  async getAPIProductionRecord(data: any) {

    this.dialogService.showLoader();
    await this.brokerAPIService.getAwait(
      this.UrlAPI_GetProductionRecord + data.productionRecordId,
      (data: any) => {
        if (data != null) {
          this.fabricRollNo = data.fabricRollNo;
          this.startProductionTime = data.startProductionTime;
          this.objProductionRecord = data;

        }
      }
    );
    this.dialogService.hideLoader();

    // this.brokerAPIService.get(this.UrlAPI_GetProductionRecord + data.productionRecordId).subscribe(data => {
    //   console.log("UrlAPI_GetProductionRecord", data);
    //   if (data != null) {
    //     this.fabricRollNo = data.fabricRollNo;
    //     this.startProductionTime = data.startProductionTime;

    //     this.getProductionPlan(data);
    //   }
    // });

    //this.isLoadingResults = false;
  }

  async getAPIProductionPlan(data: any) {
    this.dialogService.showLoader();
    await this.brokerAPIService.getAwait(
      this.UrlAPI_GetProductionPlan + data.productionPlanId,
      (data: any) => {
        if (data != null) {
          this.fabricRollNo = data.fabricRollNo;
          this.startProductionTime = data.startProductionTime;
          this.objProductionRecord = data;

        }
      }
    );
    this.dialogService.hideLoader();

    // this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + data.productionPlanId).subscribe(data => {
    //   console.log("UrlAPI_GetProductionPlan", data);
    //   if (data.process != null) {
    //     this.Process = data.process.processName;
    //   }
    //   this.jobOrderNo = data.jobOrderNo;
    //   this.productName = data.product.productName;
    //   this.rollNo = data.rollNo;
    //   this.shift = data.shift.shiftName;

    // });
    //this.isLoadingResults = false;
  }
}

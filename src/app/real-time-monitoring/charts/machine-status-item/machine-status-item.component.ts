import { Component, OnInit, Input, ViewEncapsulation, SimpleChange, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machine-status-item',
  templateUrl: './machine-status-item.component.html',
  styleUrls: ['./machine-status-item.component.scss'],
})

export class MachineStatusItemComponent implements OnInit, OnChanges {
  @Input() objCurentMachine: any = {};

  StatusName: string = "";
  private Url_Dashboard: string = "/auth/real-time-monitoring/neotex-dashboard";
  private Url_RealTimeMonitoring: string = "/auth/real-time-monitoring/";
  constructor(private router: Router, ) { }

  ngOnInit() {
    //  console.log("objCurentMachine",this.objCurentMachine);
    // this.objCurentMachine.curentStatus = 0;

   // this.setStatusName();

    if (this.objCurentMachine.lotStartTime == '0001-01-01T00:00:00') {
      this.objCurentMachine.lotStartTime = null;
    }

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log("changes", changes);
    //this.setStatusName();


  }

  setStatusName() {
   
    switch (this.objCurentMachine.curentStatus) {
      case 0:
        this.StatusName = "Off";
        break;
      case 1:
        this.StatusName = "Running";
        break;
      case 2:
        this.StatusName = "Setup";
        break;
      case 3:
        this.StatusName = "Stop";
        break;
      case 4:
        this.StatusName = "QA";
        break;

      default:
        break;
    }

  }

  btnDashboardClick() {
    this.router.navigate([this.Url_Dashboard, { MachineID: this.objCurentMachine.id }]);
  }

  btnRealTimeMonitoringClick() {
    this.router.navigate([this.Url_RealTimeMonitoring, { MachineID: this.objCurentMachine.id }]);
  }

}

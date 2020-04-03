import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatDialog,
  MatDialogRef
} from "@angular/material";

import { BrokerAPIService } from '../../services/brokerapi.service';
import { IShiftSchdule } from '../../interfaces/productionrecords';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ProductionPlanComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  private UrlAPI_ShiftSchedule: string = "ShiftSchedule/GetAll";
  shiftSchedule: any = [];
  shiftID: string = "";
  stratDate: Moment = moment();
  date: string;
  selected = "30";
  constructor(
    public brokerpai: BrokerAPIService,
    private datePipe: DatePipe,
    private dialogService: DialogService) { }
    
  ngOnInit() {
    // this.getShiftSchedule();
    this.date = this.datePipe.transform(this.stratDate, "yyyy-MM-dd");
  }

  // getShiftSchedule() {
  //   this.brokerpai.get(this.UrlAPI_ShiftSchedule).subscribe
  //     (data => {
  //       this.shiftSchedule = <IShiftSchdule>data;
  //       console.log("shiftSchedule", this.shiftSchedule)

  //     });
  // }

  onDate(event): void {
    this.date = this.datePipe.transform(event.value, "yyyy-MM-dd");
    console.log(this.date);
  }

  btnCancelClick() {
    this.selected = '30';
    this.stratDate = moment();
  }

  btnPrintClick() {
    let date: string = this.date;
    let shiftID: string = this.selected;
    let printby: string = localStorage.getItem("currentUserName");
    let url: string = AppConfig.settings.ReportServerUrl + "ProductionPlanReport?" + "startdate=" + date + "&shiftid=" + shiftID + "&printby=" + printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
  }


}

import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatDialog,
  MatSnackBar,
  MatDialogRef
} from "@angular/material";
import { BrokerAPIService } from '../../services/brokerapi.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-production-lead-time',
  templateUrl: './production-lead-time.component.html',
  styleUrls: ['./production-lead-time.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ProductionLeadTimeComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  fromplanstartdate: any;
  toplanstartdate: any;
  fromplanfinishdate: any;
  toplanfinishdate: any;
  fromdeliverydate: any;
  todeliverydate: any
  // ponoFrom: string = "P20180121001";
  // ponoTo: string = "P20190110001";
  ponoFrom: string = "";
  ponoTo: string = "";
  fromPlanStartDate: string = "";
  toPlanStartDate: string = "";
  fromPlanFinishDate: string = "";
  toPlanFinishDate: string = "";
  fromDeliveryDate: string = "";
  toDeliveryDate: string = "";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  onDate(event, key): void {
    let date: string = this.datePipe.transform(event.value, "yyyy-MM-dd");
    if (key == "fromplanstartdate") {
      this.fromPlanStartDate = date;
    }
    if (key == "toplanstartdate") {
      this.toPlanStartDate = date;
    }
    if (key == "fromplanfinishdate") {
      this.fromPlanFinishDate = date;
    }
    if (key == "toplanfinishdate") {
      this.toPlanFinishDate = date;
    }
    if (key == "fromdeliverydate") {
      this.fromDeliveryDate = date;
    }
    if (key == "todeliverydate") {
      this.toDeliveryDate = date;
    }

  }

  
  btnCancelClick(){
    this.ponoFrom = "";
    this.ponoTo = "";
    this.fromplanstartdate = undefined;
    this.toplanstartdate = undefined;
    this.fromplanfinishdate = undefined;
    this.toplanfinishdate = undefined;
    this.fromdeliverydate = undefined;
    this.todeliverydate = undefined;

  }

  btnPrintClick() {
    let ponofromNew: string = this.ponoFrom;
    let ponotoNew: string = this.ponoTo;
    let fromplanstartdateNew: string = this.fromPlanStartDate;
    let toplanstartdateNew: string = this.toPlanStartDate;
    let fromplanfinishdateNew: string = this.fromPlanFinishDate;
    let toplanfinishdateNew: string = this.toPlanFinishDate;
    let fromdeliverydateNew: string = this.fromDeliveryDate;
    let todeliverydateNew: string = this.toDeliveryDate;
    let printby:string = localStorage.getItem("currentUserName");

    if (this.ponoFrom == "") {
      ponofromNew = "0";
    }
    if (this.ponoTo == "") {
      ponotoNew = "ZZZZZZZZZZZZ";
    }
    if (this.fromplanstartdate == undefined) {
      fromplanstartdateNew = "1900-01-01"
    }
    if (this.toplanstartdate == undefined) {
      toplanstartdateNew = "3000-01-01"
    }
    if (this.fromplanfinishdate == undefined) {
      fromplanfinishdateNew = "1900-01-01"
    }
    if (this.toplanfinishdate == undefined) {
      toplanfinishdateNew = "3000-01-01"
    }
    if (this.fromdeliverydate == undefined) {
      fromdeliverydateNew = "1900-01-01"
    }
    if (this.todeliverydate == undefined) {
      todeliverydateNew = "3000-01-01"
    }
    if (ponotoNew < ponofromNew) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.toPlanStartDate < this.fromPlanStartDate) {
      let strValidate: string = "Plan Start Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.toPlanFinishDate < this.fromPlanFinishDate) {
      let strValidate: string = "Plan Finish Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.toDeliveryDate < this.fromDeliveryDate) {
      let strValidate: string = "Delivery Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    
    if (this.ponoTo == "" && this.ponoFrom == "" && this.fromplanstartdate == undefined && this.toplanstartdate == undefined && this.fromplanfinishdate == undefined && this.toplanfinishdate == undefined && this.fromdeliverydate == undefined && this.todeliverydate == undefined){
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }else{

      let url: string = AppConfig.settings.ReportServerUrl + "ProductionLeadTimeReport?" +  "ponofrom=" + ponofromNew + "&ponoto=" + ponotoNew + "&fromplanstartdate=" + fromplanstartdateNew + "&toplanstartdate=" + toplanstartdateNew + "&fromplanfinishdate=" + fromplanfinishdateNew + "&toplanfinishdate=" + toplanfinishdateNew + "&fromdeliverydate=" + fromdeliverydateNew + "&todeliverydate=" + todeliverydateNew + "&printbye=" + printby;
      window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    }


  }



}

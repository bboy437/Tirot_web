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
import { ICustomer, IProduct } from '../../interfaces/productionrecords';
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
  selector: 'app-check-standard-report',
  templateUrl: './check-standard-report.component.html',
  styleUrls: ['./check-standard-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class CheckStandardReportComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  productionDateFrom: any;
  productionDateTo: any;
  ponofrom: string = "";
  ponoto: string = "";
  jobordernofrom: string = "";
  jobordernoto: string = "";
  startProductionDateFrom: string = "";
  endProductionDateTo: string = "";



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
    if (key == "productionDateFroms") {
      this.startProductionDateFrom = date
    }
    if (key == "productionDateTos") {
      this.endProductionDateTo = date
    }
  }

  btnCancelClick() {
    this.ponofrom = "";
    this.ponoto = "";
    this.jobordernofrom = "";
    this.jobordernoto = "";
    this.productionDateFrom = undefined;
    this.productionDateTo = undefined;
  }


  btnPrintClick() {
    let ponofromNew: string = this.ponofrom;
    let ponotoNew: string = this.ponoto;
    let jobordernofromNew: string = this.jobordernofrom;
    let jobordernotoNew: string = this.jobordernoto;
    let productionDateFromNew: string = this.startProductionDateFrom;
    let productionDateToNew: string = this.endProductionDateTo;
    let printby: string = localStorage.getItem("currentUserName");
    if (this.ponofrom == "") {
      ponofromNew = "0";
    }
    if (this.ponoto == "") {
      ponotoNew = "ZZZZZZZZZZZZ";
    }
    if (this.jobordernofrom == "") {
      jobordernofromNew = "0";
    }
    if (this.jobordernoto == "") {
      jobordernotoNew = "ZZZZZZZZZZZZ";
    }
    if (this.productionDateFrom == undefined) {
      productionDateFromNew = "1900-01-01"
    }
    if (this.productionDateTo == undefined) {
      productionDateToNew = "3000-01-01"
    }
    if (ponotoNew < ponofromNew) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (jobordernotoNew < jobordernofromNew) {
      let strValidate: string = "Job Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (productionDateToNew < productionDateFromNew) {
      let strValidate: string = "Production Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.ponofrom == "" && this.ponoto == "" && this.jobordernofrom == "" && this.jobordernoto == "" && this.productionDateFrom == undefined && this.productionDateTo == undefined) {
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    } else {

      let url: string = AppConfig.settings.ReportServerUrl + "CheckStandardReport?" + "ponofrom=" + ponofromNew + "&ponoto=" + ponotoNew + "&jobnofrom=" + jobordernofromNew + "&jobnoto=" + jobordernotoNew + "&pronofrom=" + productionDateFromNew + "&pronoto=" + productionDateToNew + "&printbye=" + printby;
      window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    }
  }

}

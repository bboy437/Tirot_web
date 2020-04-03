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
  selector: 'app-monthly-performance-report',
  templateUrl: './monthly-performance-report.component.html',
  styleUrls: ['./monthly-performance-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MonthlyPerformanceReportComponent implements OnInit {

  numYearSelected: number;
  numMonthSelected: number;
  objarrYear: any = [];
  objarrMonth: any = [];

  constructor() { }

  ngOnInit() {
    this.setYear();
    this.setMonth();
    
  }

  setYear() {
    var year = new Date(new Date().getFullYear() + 1, 0, 1);
    this.numYearSelected = year.getFullYear() - 1;
    for (let index = 0; index < 11; index++) {
      if (index != 0) {
        year.setFullYear(year.getFullYear() - 1);
      }

      this.objarrYear.push({ year: year.getFullYear() });
    }
  }

  setMonth() {
    var month = new Date();
    this.numMonthSelected = month.getMonth() + 1;
    for (let index = 0; index < 12; index++) {
      month.setMonth(index, 15);
      this.objarrMonth.push({ month: month.getMonth() + 1 });
    }
  }

  MonthChange(monthdata) {
    this.numMonthSelected = monthdata;
  }

  YearChange(yeardata) {
    this.numYearSelected = yeardata;
  }

  btnCancelClick() {
    this.setYear();
    this.setMonth();
  }


  btnPrintClick() {
    let numMonthSelected: number = this.numMonthSelected
    let numYearSelected: number = this.numYearSelected
    let printby: string = localStorage.getItem("currentUserName"); 

    let url: string = AppConfig.settings.ReportServerUrl + "MonthlyPerformanceReport?" + "frommonths=" + numMonthSelected + "&fromyears=" + numYearSelected + "&printby=" + printby  ;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
  }


}

import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from "@angular/material";

import { BrokerAPIService } from '../../services/brokerapi.service';
import { IShiftSchdule } from '../../interfaces/productionrecords';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-checktempandwidths-report',
  templateUrl: './checktempandwidths-report.component.html',
  styleUrls: ['./checktempandwidths-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChecktempandwidthsReportComponent implements OnInit {

  operationDate: Moment = moment();
  date: string;
  private UrlAPI_GetCheckTempReport: string = "Report/GetCheckTempReport/";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.date = this.datePipe.transform(this.operationDate, "yyyy-MM-dd");
  }

  onDate(event): void {
    this.date = this.datePipe.transform(event.value, "yyyy-MM-dd");
    console.log(this.date);
  }

  btnCancelClick() {
    this.operationDate = moment();
    this.date = this.datePipe.transform(this.operationDate, "yyyy-MM-dd");
  }

  async btnPrintClick() {

    if (this.operationDate !== undefined) {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCheckTempReport + this.date)
      // console.log("data",data.success)
      if (data.success) {
        let date: string = this.date;
        let printby: string = localStorage.getItem("currentUserName");
        let url: string = AppConfig.settings.ReportServerUrl + "CheckTempandWidthsReport?" + "operationdate=" + date + "&guid=" + data.data + "&printbye=" + printby;
        window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');

      } else {
        this.dialogService.showDialog(
          "error",
          "Error",
          data.message
        );
      }
    }

  }

}

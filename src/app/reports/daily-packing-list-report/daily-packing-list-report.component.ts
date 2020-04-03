import { Component, OnInit } from '@angular/core';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material";
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { BrokerAPIService } from "../../services/brokerapi.service";
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { Moment } from "moment"
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
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
  selector: 'app-daily-packing-list-report',
  templateUrl: './daily-packing-list-report.component.html',
  styleUrls: ['./daily-packing-list-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DailyPackingListReportComponent implements OnInit {

  constructor(private brokerAPIService: BrokerAPIService,
    private dialog: MatDialog, ) { }

  dialogRef: MatDialogRef<MessageDialogComponent>;
  packingdateonenew: any;


  objRow: any = {};


  
  ngOnInit() {

    // let today = moment(currentDate).format("YYYY/MM/DD")
    // console.log("tranfer = ", today);

    let currentDate: Date = new Date();
    this.packingdateonenew = currentDate
  }





  btnCancelClick() {
    let currentDate: Date = new Date();
    this.packingdateonenew = currentDate
  }


  btnPrintClick() {

    console.log("weerapon",this.packingdateonenew);
    
    let packingdateone: any = this.packingdateonenew;
    let printby: string = localStorage.getItem("currentUserName");
    console.log("printby", printby);

    if (packingdateone == undefined) {
      // let today = moment(currentDate).format("YYYY/MM/DD")
      let currentDate: Date = new Date();
      packingdateone = currentDate;
      packingdateone = moment(packingdateone).format("YYYY-MM-DD")
    } else {
      packingdateone = moment(packingdateone).format("YYYY-MM-DD")
      console.log("packingdateone", packingdateone);
    }

    let url: string = AppConfig.settings.ReportServerUrl + "DailyPackingListReport?" + "packingdateone=" + packingdateone + "&printby=" + printby;
    console.log(url);
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    return;
  }
 
  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }
}

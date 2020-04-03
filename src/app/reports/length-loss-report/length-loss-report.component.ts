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
  selector: 'app-length-loss-report',
  templateUrl: './length-loss-report.component.html',
  styleUrls: ['./length-loss-report.component.scss'],
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
export class LengthLossReportComponent implements OnInit {

  constructor(private brokerAPIService: BrokerAPIService,
    private dialog: MatDialog,
    private dialogService: DialogService ) { }

  dialogRef: MatDialogRef<MessageDialogComponent>;
  productionorderdatefromnew: any;
  productionorderdatetonew: any;
  ponofromnew: string;
  ponotonew: string;

  ngOnInit() {
  }

  // onDate(event, key): void {

  // }


  btnCancelClick() {

    this.ponofromnew = "";
    this.ponotonew = "";
    this.productionorderdatefromnew = undefined;
    this.productionorderdatetonew = undefined;


  }




  btnPrintClick() {

    let ponofrom: string = this.ponofromnew;
    let ponoto: string = this.ponotonew;
    let productionorderdatefrom: any = this.productionorderdatefromnew;
    let productionorderdateto: any = this.productionorderdatetonew;
    let printby: string = localStorage.getItem("currentUserName");
    console.log("printby", printby);



    if ((ponofrom == "" || ponofrom == undefined) && (ponoto == "" || ponoto == undefined) && productionorderdatefrom == undefined && productionorderdateto == undefined ) {
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }

    if (ponofrom == "" || ponofrom == undefined ) {
      ponofrom = "0";
    }
    if (ponoto == "" || ponoto == undefined ) {
      ponoto = "ZZZZZZZZZZZZ";
    }
    if (productionorderdatefrom == undefined) {
      productionorderdatefrom = "1900-01-01"
    } else {
      productionorderdatefrom = moment(productionorderdatefrom).format("YYYY-MM-DD")
      console.log("productionorderdatefrom", productionorderdatefrom);

    }
    if (productionorderdateto == undefined) {
      productionorderdateto = "3000-12-31"
    } else {
      productionorderdateto = moment(productionorderdateto).format("YYYY-MM-DD")
      console.log("productionorderdateto", productionorderdateto);

    }
    if (ponoto < ponofrom) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }
    if (productionorderdateto < productionorderdatefrom) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }

    let url: string = AppConfig.settings.ReportServerUrl + "LengthLossByProcessReport?" + "ponofrom=" + ponofrom + "&ponoto=" + ponoto + "&productionorderdatefrom=" + productionorderdatefrom + "&productionorderdateto=" + productionorderdateto + "&printby=" + printby;
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

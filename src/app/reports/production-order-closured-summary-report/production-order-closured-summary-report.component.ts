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
  selector: 'app-production-order-closured-summary-report',
  templateUrl: './production-order-closured-summary-report.component.html',
  styleUrls: ['./production-order-closured-summary-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ProductionOrderClosuredSummaryReportComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  deliveryDateFrom: any;
  deliveryDateTo: any;
  poDateFrom: any;
  poDateTo: any;
  coDateFrom: any;
  coDateTo: any;
  private Listing: string = "Promotion/GetRedeemList/";
  private URL_customerGetALl: string = "Customer/GetAll";
  private URL_productGetALl: string = "Product/GetAll";
  ponofrom: string = "";
  ponoto: string = "";
  startdeliverydate: string = "";
  enddeliverydate: string = "";
  startpodate: string = "";
  endpodate: string = "";
  startcodate: string = "";
  endcodate: string = "";
  arrobjCustomer: any = [];
  customer: string = "";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private dialogService: DialogService
  ) { }



 
  ngOnInit() {
    this.getCustomer();
  }

  getCustomer() {
    this.brokerAPIService
      .get(this.URL_customerGetALl)
      .subscribe(data => {
        this.arrobjCustomer = <ICustomer>data;

      });
  }


  onDate(event, key): void {
    let date: string = this.datePipe.transform(event.value, "yyyy-MM-dd");
    if (key == "deliveryDateFrom") {
      this.startdeliverydate = date
    }
    if (key == "deliveryDateTo") {
      this.enddeliverydate = date
    }
    if (key == "poDateFrom") {
      this.startpodate = date
    }
    if (key == "poDateTo") {
      this.endpodate = date
    }
    if (key == "coDateFrom") {
      this.startcodate = date
    }
    if (key == "coDateTo") {
      this.endcodate = date
    }

  }

  btnCancelClick() {
    this.ponofrom = "";
    this.ponoto = "";
    this.deliveryDateFrom = undefined;
    this.deliveryDateTo = undefined;
    this.poDateFrom = undefined;
    this.poDateTo = undefined;
    this.coDateFrom = undefined;
    this.coDateTo = undefined;
    this.customer = "";
  }


  btnPrintClick() {
    let ponofromNew: string = this.ponofrom;
    let ponotoNew: string = this.ponoto;
    let startdeliverydateNew: string = this.startdeliverydate;
    let enddeliverydateNew: string = this.enddeliverydate;
    let startpodateNew: string = this.startpodate;
    let endpodateNew: string = this.endpodate;
    let startcodateNew: string = this.startcodate;
    let endcodateNew: string = this.endcodate;
    let customerNew: string = this.customer;
    let printby: string = localStorage.getItem("currentUserName");


    if (this.ponofrom == "") {
      ponofromNew = "0";
    }
    if (this.ponoto == "") {
      ponotoNew = "ZZZZZZZZZZZZ";
    }
    if (this.deliveryDateFrom == undefined) {
      startdeliverydateNew = "1900-01-01"
    }
    if (this.deliveryDateTo == undefined) {
      enddeliverydateNew = "3000-01-01"
    }
    if (this.poDateFrom == undefined) {
      startpodateNew = "1900-01-01"
    }
    if (this.poDateTo == undefined) {
      endpodateNew = "3000-01-01"
    }
    if (this.coDateFrom == undefined) {
      startcodateNew = "1900-01-01"
    }
    if (this.coDateTo == undefined) {
      endcodateNew = "3000-01-01"
    }
    if (this.customer == "") {
      customerNew = "0"
    }

    if (ponotoNew < ponofromNew) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.enddeliverydate < this.startdeliverydate) {
      let strValidate: string = "Delivery Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.endpodate < this.startpodate) {
      let strValidate: string = "Production Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.endcodate < this.startcodate) {
      let strValidate: string = "Customer Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.ponofrom == "" && this.ponoto == "" && this.deliveryDateFrom == undefined && this.deliveryDateTo == undefined && this.poDateFrom == undefined && this.poDateTo == undefined && this.coDateFrom == undefined && this.coDateTo == undefined && this.customer == ""){
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }else{

      let url: string = AppConfig.settings.ReportServerUrl + "ProductionOrderClosuredSummaryReport?" + "ponofrom=" + ponofromNew + "&ponoto=" + ponotoNew + "&startdeliverydate=" + startdeliverydateNew + "&enddeliverydate=" + enddeliverydateNew + "&startpodate=" + startpodateNew + "&endpodate=" + endpodateNew + "&startcodate=" + startcodateNew + "&endcodate=" + endcodateNew  + "&madeto=" + customerNew + "&printbye=" + printby;
      window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    }




  }



}


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
  selector: 'app-production-order-status',
  templateUrl: './production-order-status.component.html',
  styleUrls: ['./production-order-status.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ProductionOrderStatusComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  deliveryDateFrom: any;
  deliveryDateTo: any;
  planDateFrom: any;
  planDateTo: any;
  private URL_customerGetALl: string = "Customer/GetAll";
  private URL_productGetALl: string = "Product/GetAll";
  ponofrom: string = "";
  ponoto: string = "";
  startdeliverydate: string = "";
  enddeliverydate: string = "";
  startplandate: string = "";
  endplandate: string = "";
  arrobjCustomer: any = [];
  customer: string = "";
  arrobjProduct: any = [];
  product: string = "";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getCustomer();
    this.getProduct();
  }

  getCustomer() {
    this.brokerAPIService
      .get(this.URL_customerGetALl)
      .subscribe(data => {
        this.arrobjCustomer = <ICustomer>data;

      });
  }

  getProduct() {
    this.brokerAPIService
      .get(this.URL_productGetALl)
      .subscribe(data => {
        this.arrobjProduct = <IProduct>data;

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
    if (key == "planDateFrom") {
      this.startplandate = date
    }
    if (key == "planDateTo") {
      this.endplandate = date
    }

  }

  btnCancelClick() {
    this.ponofrom = "";
    this.ponoto = "";
    this.deliveryDateFrom = undefined;
    this.deliveryDateTo = undefined;
    this.planDateFrom = undefined;
    this.planDateTo = undefined;
    this.product = "";
    this.customer = "";
  }


  btnPrintClick() {
    let ponofromNew: string = this.ponofrom;
    let ponotoNew: string = this.ponoto;
    let startdeliverydateNew: string = this.startdeliverydate;
    let enddeliverydateNew: string = this.enddeliverydate;
    let startplandateNew: string = this.startplandate;
    let endplandateNew: string = this.endplandate;
    let customerNew: string = this.customer;
    let productNew: string = this.product;
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
    if (this.planDateFrom == undefined) {
      startplandateNew = "1900-01-01"
    }
    if (this.planDateTo == undefined) {
      endplandateNew = "3000-01-01"
    }
    if (this.customer == "") {
      customerNew = "0"
    }
    if (this.product == "") {
      productNew = "0"
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
    if (this.endplandate < this.startplandate) {
      let strValidate: string = "Plan Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    console.log(this.customer);

    if (this.ponofrom == "" && this.ponoto == "" && this.deliveryDateFrom == undefined && this.deliveryDateTo == undefined && this.planDateFrom == undefined && this.planDateTo == undefined && this.product == "" && this.customer == "") {
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    } else {

      let url: string = AppConfig.settings.ReportServerUrl + "ProductionOrderStatusReport?" + "ponofrom=" + ponofromNew + "&ponoto=" + ponotoNew + "&startdeliverydate=" + startdeliverydateNew + "&enddeliverydate=" + enddeliverydateNew + "&startplandate=" + startplandateNew + "&endplandate=" + endplandateNew + "&product=" + productNew + "&customer=" + customerNew + "&printbye=" + printby;
      window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    }



  }


}

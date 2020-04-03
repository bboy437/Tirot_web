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
  selector: 'app-wip-report',
  templateUrl: './wip-report.component.html',
  styleUrls: ['./wip-report.component.scss'],
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


export class WipReportComponent implements OnInit {


  dialogRef: MatDialogRef<MessageDialogComponent>;


  ponoformnew: string;
  ponotonew: string;
  planstartdatefromnew: any;
  planstartdatetonew: any;
  planfinishdatefromnew: any;
  planfinishdatetonew: any;
  deliverydateformnew: any;
  deliverydatetonew: any;



  constructor(private brokerAPIService: BrokerAPIService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogService: DialogService, ) { }

  ngOnInit() {



  }

  // onDate(event, key): void {
  //   // console.log(event);
  //   // let date: string = this.datePipe.transform(event.value, "yyyy-MM-dd");
  //   // console.log(date);


  // }



  btnCancelClick() {
    this.ponoformnew = "";
    this.ponotonew = "";
    this.planstartdatefromnew = undefined;
    this.planstartdatetonew = undefined;
    this.planfinishdatefromnew = undefined;
    this.planfinishdatetonew = undefined;
    this.deliverydateformnew = undefined;
    this.deliverydatetonew = undefined;



  }





  btnPrintClick() {
    // console.log(this.abcdef);

    // let Link: string = "http://192.168.0.25:50353/reports/Tirot/WIP_Report2?";
    let ponofrom: string = this.ponoformnew;
    let ponoto: string = this.ponotonew;
    let planstartdatefrom: any = this.planstartdatefromnew;
    let planstartdateto: any = this.planstartdatetonew;
    let planfinishdatefrom: any = this.planfinishdatefromnew;
    let planfinishdateto: any = this.planfinishdatetonew;
    let deliverydatefrom: any = this.deliverydateformnew;
    let deliverydateto: any = this.deliverydatetonew;
    let printby: string = localStorage.getItem("currentUserName");
    console.log("printby", printby);


    //############ เช็คค่าว่างทั้งหมด  ########################


    // if(ว่างทุกอัน)
    // {
    //   dialog ออกไปนะ
    //   return;
    // }

    //############ เช็คค่าว่างทั้งหมด  ########################

    //  if(ponofrom ว่างใช่ไหม)
    // {
    //   ponoo = 0;
    // }
    // if(ponoto ว่างไหม)
    // {
    //   pomo 
    // }



    // if(ponofrom มากกว่า to)
    // {
    //   dialog ไม่ได้นะ ต้องกรอกน้อยกว่านะ
    //   return;
    // }
    //ดักข้อมูลที่ว่างให้เด้งให้กดinput 1 อัน
    if ((ponofrom == "" || ponofrom == undefined) && (ponoto == "" || ponoto == undefined) && planstartdatefrom == undefined && planstartdateto == undefined && planfinishdatefrom == undefined && planfinishdateto == undefined && deliverydatefrom == undefined && deliverydateto == undefined) {
      let strValidate: string = "โปรดระบุอย่างน้อย 1 รายการ";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }

    //กรณีที่ไม่กรอกข้อมูลจะมีตัวdefall มาให้
    if (ponofrom == "" || ponofrom == undefined ) {
      ponofrom = "0" 
    }


    if (ponoto == "" || ponoto == undefined )  {
      ponoto = "ZZZZZZZZZZZZ"
    }

    if (planstartdatefrom == undefined) {
      planstartdatefrom = "1900-01-01";
    }
    else {
      planstartdatefrom = moment(planstartdatefrom).format("YYYY-MM-DD")
    }

    if (planstartdateto == undefined) {
      planstartdateto = "3000-12-31";
    }
    else {
      planstartdateto = moment(planstartdateto).format("YYYY-MM-DD")
    }

    if (planfinishdatefrom == undefined) {
      planfinishdatefrom = "1900-01-01";
    }
    else {
      planfinishdatefrom = moment(planfinishdatefrom).format("YYYY-MM-DD")
    }

    if (planfinishdateto == undefined) {
      planfinishdateto = "3000-12-31";
    }
    else {
      planfinishdateto = moment(planfinishdateto).format("YYYY-MM-DD")
    }

    if (deliverydatefrom == undefined) {
      deliverydatefrom = "1900-01-01";
    }
    else {
      deliverydatefrom = moment(deliverydatefrom).format("YYYY-MM-DD")
    }

    if (deliverydateto == undefined) {
      deliverydateto = "3000-12-31";
    }
    else {
      deliverydateto = moment(deliverydateto).format("YYYY-MM-DD")
    }

    //ตัวข้างหลัง น้อยกว่า ตัวข้างหน้า
    if (ponoto < ponofrom) {
      let strValidate: string = "Production Order No.";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }
    if (planstartdateto < planstartdatefrom) {
      let strValidate: string = "Plan Start Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }
    if (planfinishdateto < planfinishdatefrom) {
      let strValidate: string = "Plan Finish Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }
    if (deliverydateto < deliverydatefrom) {
      let strValidate: string = "Delivery Date";
      this.dialogService.showDialog("error", "Error", strValidate);
      return;
    }


    let url: string = AppConfig.settings.ReportServerUrl + "WIPReport?" + "ponofrom=" + ponofrom + "&ponoto=" + ponoto + "&planstartdatefrom=" + planstartdatefrom + "&planstartdateto=" + planstartdateto + "&planfinishdatefrom=" + planfinishdatefrom + "&planfinishdateto=" + planfinishdateto + "&deliverydatefrom=" + deliverydatefrom + "&deliverydateto=" + deliverydateto + "&printby=" + printby;
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


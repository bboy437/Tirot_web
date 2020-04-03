import { Component, OnInit, ViewChild } from "@angular/core";
import "rxjs/add/operator/map";
import { IProductionOrder, IShiftSchdule } from "../../interfaces/productionrecords";
import {MatSort,MatPaginator,MatTableDataSource,DateAdapter,MAT_DATE_LOCALE,MAT_DATE_FORMATS, MatDialog, MatDialogRef} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment"
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { DatePipe } from "@angular/common";
import { AppConfig } from "../../app.config";
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
  selector: 'app-report-dailyproduction',
  templateUrl: './report-dailyproduction.component.html',
  styleUrls: ['./report-dailyproduction.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class ReportDailyproductionComponent implements OnInit {

  dialogRef: MatDialogRef<MessageDialogComponent>;
  private UrlAPI_ShiftSchedule: string = "ShiftSchedule/GetAll";
  shiftSchedule: any = [];
  shiftID: string = "";
  stratDate: Moment = moment();
  date: string;
  selected = "30";

  constructor(
    public brokerpai: BrokerAPIService,
    private dialog: MatDialog,
    private datePipe: DatePipe) { }
    
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
    let url :string = AppConfig.settings.ReportServerUrl + "DailyProductionReport?startdate="+ date +"&shiftid=" + shiftID + "&printby="+ printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');

  }

  clearContents(element) {
  element.value = '';

}
}


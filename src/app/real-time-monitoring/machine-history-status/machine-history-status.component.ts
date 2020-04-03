import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { IArticle, IProductionOrder } from "../../interfaces/productionrecords";
import { Observable } from "rxjs/Observable";
// import { ProductionOrderListingDialogComponent } from "../production-order-listing/dialog/production-order-listing-dialog/production-order-listing-dialog.component";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { DataSource } from "@angular/cdk/collections";
import { ProductionOrderListingDialogComponent } from "../../transaction/production-order-listing/dialog/production-order-listing-dialog/production-order-listing-dialog.component";

import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { Moment } from "moment"
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
  selector: 'app-machine-history-status',
  templateUrl: './machine-history-status.component.html',
  styleUrls: ['./machine-history-status.component.scss'],
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
export class MachineHistoryStatusComponent implements OnInit {


  isLoadingResults = false;

  @Input() LogDate: string;

  @ViewChild('timelinechart') timelinechart;

  endShift: string;
  startShift: string;
  currentShift: string;
  ShiftInDay: string

  numYearSelected: string;

  DateSelected: Moment = moment();
  YearChange: number;

  dataTable: (string | Date)[][];

  UrlAPI_GetHistoryMachineAvailableList: string = "Visualization/GetHistoryMachineAvailableList/";
  UrlAPI_GetRangeShiftByDate: string = "ShiftSchedule/GetRangeShiftByDate/";
  Url_TimeLineMachine: string = "/../../Charts/timeline-machine-history-status.component";
  chartData: { chartType: string; dataTable: (string | Date)[][]; };
  RangeShift: string;


  constructor(private brokerAPIService: BrokerAPIService,
    private datePipe: DatePipe, ) { }
  dataSource = new MatTableDataSource();
  objRow: any = {};

  ngOnInit() {
    this.numYearSelected = moment(this.DateSelected).format("YYYY-MM-DD")
    this.GetRangeShiftByDate();
    this.GetHistoryMachineAvailableList();





  }

  public onDateChanged(event): void {
    console.log("event", event);
    this.numYearSelected = moment(event).format("YYYY-MM-DD")
    console.log("numYearSelected", this.numYearSelected);
    this.ShiftInDay = moment(event).format("YYYY-MM-DD")
    console.log("weerapon", this.ShiftInDay);
    this.GetRangeShiftByDate();
    this.GetHistoryMachineAvailableList();
    this.objRow.DateSelected = new Date();
    //  this.UrlAPI_GetRangeShiftByDate = this.endShift;







  }





  private GetHistoryMachineAvailableList() {
    this.isLoadingResults = true;
    this.brokerAPIService.get(this.UrlAPI_GetHistoryMachineAvailableList + this.numYearSelected)
      .subscribe(data => {
        console.log("UrlAPI_GetHistoryMachineAvailableList", data);






        // this.dataSource.data = this.objRow.orderItems;

        // console.log("eeee",this.objRow.orderItems);



      });

  }


  private GetRangeShiftByDate() {
    this.isLoadingResults = true;
    this.brokerAPIService.get(this.UrlAPI_GetRangeShiftByDate + this.numYearSelected)
      .subscribe(data => {
        console.log("UrlAPI_GetRangeShiftByDate", data);
        if (data != null) {
          this.startShift = data.startShift;
          this.endShift = data.endShift;
          this.RangeShift = 'From ' + moment(data.startShift).format("DD/MM/YYYY HH:mm:ss") + ' To ' + moment(data.endShift).format("DD/MM/YYYY HH:mm:ss")

        }
      });


  }






  // btnSubmit() {

  // }


}  

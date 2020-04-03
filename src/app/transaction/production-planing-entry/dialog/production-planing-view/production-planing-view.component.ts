
import { Component, ViewChild, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { BrokerAPIService } from "../../../../services/brokerapi.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import { IShiftSchdule } from '../../../../interfaces/productionrecords';
import {
  MatSnackBar, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";


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
  selector: 'app-production-planing-view',
  templateUrl: './production-planing-view.component.html',
  styleUrls: ['./production-planing-view.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ProductionPlaningViewComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "planStartTime",
    "jobOrderNo",
    "productCode",
    "processName",
    "rollNo",
    "planQty",
  ];

  private UrlAPI_GetProductionPlanByDateAndShift: string =
    "ProductionOrder/GetProductionPlanByDateAndShift/";
  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";
  private Url_Detail: string = "/auth/transaction/production-planing-entry";
  shiftID: String;
  DateSelected: Moment = moment();
  strselecteddate:string
  numYearSelected: number;
  numMonthSelected: number;
  plandata: any;
  arrobjShift: any = [];

  constructor(
    public dialogRef: MatDialogRef<ProductionPlaningViewComponent>, 
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) { }

  async ngOnInit() {
    this.shiftID = "0";
    this.strselecteddate = moment(this.DateSelected).format("MM-DD-YYYY");
    this.setSelectShift();
    this.getProductionPlanByMonthAndShift_List();

  }

  shiftChange(id) {
    this.shiftID = id;
    this.getProductionPlanByMonthAndShift_List();
  }

  planningDateChange(event) {
    this.strselecteddate = moment(event.value).format("MM-DD-YYYY");
    this.getProductionPlanByMonthAndShift_List();
  }

  async getProductionPlanByMonthAndShift_List() {
   let data: any =  await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionPlanByDateAndShift + this.strselecteddate + "," + this.shiftID)
    this.dataSource.data = data;

  }


  setSelectShift() {
    this.brokerAPIService.get(this.UrlAPI_GetAllShift).subscribe(data => {
      this.arrobjShift = <IShiftSchdule[]>data.sort(function (a, b) {
        return a.shiftNo - b.shiftNo;
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}


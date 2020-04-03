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
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { DataSource } from "@angular/cdk/collections";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
import { strictEqual } from "assert";
@Component({
  selector: 'app-machine-summary-status',
  templateUrl: './machine-summary-status.component.html',
  styleUrls: ['./machine-summary-status.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class MachineSummaryStatusComponent implements OnInit {

  isLoadingResults = true;
  objarrProductionOrderListing: any = {};
  objarrYear: any = [];
  objarrMonth: any = [];
  DateSelected: Moment = moment();

  numYearSelected: string;
  numMonthSelected: number;
  dataSource = new MatTableDataSource();
  resourcesLoaded: boolean = true;
  displayedColumns = [
    "id",
    "machineName",
    "runTime",
    "runCount",
    "setupTime",
    "setupCount",
    "stopTime",
    "stopCount",
    // "qaTime",
    // "qaCount",
    "total",
  ];

  objRowSelected: IProductionOrder;
  filter: string = "";
  month: string = "";
  year: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");
  expandedElement: any;

  private UrlAPI_ProductGetAll: string = "Product/GetAll";
  private UrlAPI_GetHistoryMachineSummaryStatus: string =
    "Visualization/GetHistoryMachineSummaryStatus/";
  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router, private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.numYearSelected = moment(this.DateSelected).format("YYYY-MM-DD")
    console.log("numYearSelected", this.numYearSelected);
    this.getHistoryMachineSummaryStatus();

  }

  public onDateChanged(event): void {
    console.log("event", event);
    this.numYearSelected = moment(event).format("YYYY-MM-DD")
    console.log("numYearSelected", this.numYearSelected);

    this.getHistoryMachineSummaryStatus();


  }



  private getHistoryMachineSummaryStatus() {
    this.isLoadingResults = true;
    this.brokerAPIService.get(this.UrlAPI_GetHistoryMachineSummaryStatus + this.numYearSelected)
      .subscribe(data => {
        console.log("data", data);
        this.objarrProductionOrderListing = data;
        this.calculation();
        console.log("objarrProductionOrderListing", this.objarrProductionOrderListing);
        // this.dataSource.data = this.objarrProductionOrderListing;
        this.dataSource.filter = this.filter.toLowerCase();
        this.isLoadingResults = false;


      });
  }



  calculation() {
    var total = null;
    var secondsrunTime = null;
    var secondsetupTime = null;
    var secondstopTime = null;
    // var secondsTime = null;
    var a = null;
    var b = null;
    var c = null;
    // var d = null;

    for (let rows of this.objarrProductionOrderListing) {
      //var date = new Date();
      var rowsrunTime = (rows.runTime);
      var rowsetupTime = (rows.setupTime);
      var rowstopTime = (rows.stopTime);
      // var rowsqaTime = (rows.qaTime);

      a = rowsrunTime.split(":");
      b = rowsetupTime.split(":");
      c = rowstopTime.split(":");
      // d = rowsqaTime.split(":");

      secondsrunTime = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
      secondsetupTime = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
      secondstopTime = (+c[0]) * 60 * 60 + (+c[1]) * 60 + (+c[2]);
      // secondsTime = (+d[0]) * 60 * 60 + (+d[1]) * 60 + (+d[2]);

      var date = new Date(2000, 0, 1);
      let secondstotal = (secondsrunTime + secondsetupTime + secondstopTime );
      // console.log("transform secondstotal" ,this.transform(secondstotal));
      date.setSeconds(secondstotal);
      total = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      console.log("total", total)

      if (this.transform(secondstotal).trim() == '1 day') {
        rows.total = '1 day';
      }
      else {
        rows.total = total;
      }

    }
    this.dataSource.data = this.objarrProductionOrderListing;

  }


  times = {
    year: 31557600,
    month: 2629746,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }

  transform(seconds) {
    let time_string: string = '';
    let plural: string = '';
    for (var key in this.times) {
      if (Math.floor(seconds / this.times[key]) > 0) {
        if (Math.floor(seconds / this.times[key]) > 1) {
          plural = 's';
        }
        else {
          plural = '';
        }

        time_string += Math.floor(seconds / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
        seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);

      }
    }
    return time_string;
  }



  downloadButtonPush() {

    var csvData = this.ConvertToCSV();
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob);
    } else {
      var a = document.createElement("a");
      var date = moment(this.numYearSelected).format("YYYY-MM-DD")

      a.href = url;
      a.download = 'MachineSummaryStatus' + date + '.csv' ;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

 

  ConvertToCSV() {
    let filteredData: any;
    filteredData = this.dataSource.filteredData;
    console.log("filteredData", filteredData)

    let arrData = JSON.parse(JSON.stringify(filteredData, ["id", "machineName", "runTime", "runCount", "setupTime", "setupCount", "setupTime", "stopCount", "qaTime", "qaCount", "total"]));
    console.log("arrData", arrData);
    var array = arrData;
    var str = '';
    var row = "";

    for (var index in arrData[0]) {
        //Now convert each value to string and comma-separated
        row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
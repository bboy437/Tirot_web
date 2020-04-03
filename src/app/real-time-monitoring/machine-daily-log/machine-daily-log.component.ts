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
import * as moment from "moment";
import { Moment } from "moment"
import { MomentDateAdapter } from "@angular/material-moment-adapter";
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
  selector: 'app-machine-daily-log',
  templateUrl: './machine-daily-log.component.html',
  styleUrls: ['./machine-daily-log.component.scss'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],

})
export class MachineDailyLogComponent implements OnInit {

  isLoadingResults = true;
  objarrProductionOrderListing: any = {};
  objarrYear: any = [];
  objarrMonth: any = [];
  DateSelected: Moment = moment();
  dailyStatus: any = {};
  dailyStatus1: any = {};
  numYearSelected: string;
  // numYearSelected: number;
  numMonthSelected: number;
  dataSource = new MatTableDataSource();
  resourcesLoaded: boolean = true;
  displayedColumns = [
    "MachineID",
    "MachineName",
    "LogStartDate",
    "LogEndDate",
    "StatusNo",
    "StatusName",
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
  private UrlAPI_GetHistoryMachineAvailableList: string = "Visualization/GetHistoryMachineAvailableList/";
  // private Url_Detail: string = "/auth/transaction/production-order-detail";
  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router, private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.numYearSelected = moment(this.DateSelected).format("YYYY-MM-DD")
    this.GetHistoryMachineAvailableList();

  }

  public onDateChanged(event): void {
    console.log("event", event);
    this.numYearSelected = moment(event).format("YYYY-MM-DD")
    console.log("numYearSelected", this.numYearSelected);
    this.GetHistoryMachineAvailableList();
  }

  private GetHistoryMachineAvailableList() {
    this.isLoadingResults = true;
    this.brokerAPIService.get(this.UrlAPI_GetHistoryMachineAvailableList + this.numYearSelected)
      .subscribe(data => {
         console.log("data", data);
        
        this.objarrProductionOrderListing = data;
        for (let machineAvailableList of this.objarrProductionOrderListing) {
          var machineAvailableListID = machineAvailableList.id
          var machineAvailableListMachineName = machineAvailableList.machineName

          for (let i = 0; i < this.objarrProductionOrderListing.length; i++) {
            if (this.objarrProductionOrderListing[i].dailyStatus !== null) {
              this.dailyStatus = this.objarrProductionOrderListing[i].dailyStatus;

              for (let i = 0; i < this.dailyStatus.length; i++) {
                if (this.dailyStatus[i].machineStatus !== null) {
                  this.dailyStatus1 = this.dailyStatus[i];
                  this.dailyStatus1.machineAvailableListID = machineAvailableListID

                   this.dailyStatus1.startStatusDateTime = moment( this.dailyStatus1.startStatusDateTime).format("YYYY/MM/DD HH:mm:ss") 
                   this.dailyStatus1.endStatusDateTime = moment( this.dailyStatus1.endStatusDateTime).format("YYYY/MM/DD HH:mm:ss") 



                  this.dailyStatus1.machineAvailableListMachineName = machineAvailableListMachineName
                  this.dailyStatus1.machineStatusName = this.dailyStatus[i].machineStatus == 
                  '0'? 'TurnOff':(this.dailyStatus[i].machineStatus ==
                  '1'? 'Running':(this.dailyStatus[i].machineStatus == 
                  '2'? 'Setup':(this.dailyStatus[i].machineStatus ==
                  '3'? 'Stop':(this.dailyStatus[i].machineStatus ==
                  '4'? 'QA':this.dailyStatus[i].machineStatus))))
                  // console.log("XXXXX", this.dailyStatus);
                }
              }
            }
          }
        }

        this.dataSource.data = this.dailyStatus;
        // console.log("SSSSS", this.dailyStatus1);
        this.dataSource.filter = this.filter.toLowerCase();
        this.isLoadingResults = false;

      });
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

  downloadButtonPush() {
    let filteredData: any;
    filteredData = this.dataSource.filteredData;
    var csvData = this.ConvertToCSV(filteredData);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);

    var data = moment(this.numYearSelected).format("YYYY-MM-DD");
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = 'MachineDailyLog' + data + '.csv' ;
      this.numYearSelected
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  ConvertToCSV(objArray: any): string {
    
    let ExPort = JSON.parse(JSON.stringify(objArray,["machineAvailableListID","machineAvailableListMachineName","startStatusDateTime","endStatusDateTime","machineStatus","machineStatusName"]));

    var array = ExPort ; 
    var str = '';
    var row = "";

    
    // Machine ID." + ',' + "Machine Name" + ',' + "Log StartDate" + ','+ "Log EndDate" + ','+ "Status No." + ','+ "Status Name
    for (var index in ExPort[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';

      console.log("row",row)
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

}
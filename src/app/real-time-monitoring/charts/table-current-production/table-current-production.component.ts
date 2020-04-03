import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../../services/brokerapi.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-table-current-production',
  templateUrl: './table-current-production.component.html',
  styleUrls: ['./table-current-production.component.scss']
})
export class TableCurrentProductionComponent implements OnInit, OnChanges {
  @Input() MachineID: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  dataSource_currentOperation = new MatTableDataSource();
  dataSource_previousOperation = new MatTableDataSource();
  lengthCurrent : number;
  lengthPrevious : number;

  currentShift: any = {};
  previousShift: any = {};

  displayedColumns_previousOperation = ['productNane', 'rollNo', 'processName', 'productionTime', 'productionQty', 'status', 'defectDesc'];
  displayedColumns_currentOperation = ['productNane', 'rollNo', 'processName', 'productionTime', 'productionQty', 'status', 'defectDesc'];

  UrlAPI_GetCurrentProduction: string = "Visualization/GetCurrentProduction/";
  UrlAPI_GetCurrentShift: string = "Visualization/GetCurrentShift";
  objCurrentProduction: any;

  constructor(private brokerAPIService: BrokerAPIService) { }

  ngOnInit() {
    //this.getAPICurrentProduction();
    //this.getAPICurrentShift();
  }

  ngAfterViewInit() {
    this.dataSource_currentOperation.paginator = this.paginator;
    this.dataSource_currentOperation.sort = this.sort;

    this.dataSource_previousOperation.paginator = this.paginator;
    this.dataSource_previousOperation.sort = this.sort;

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    //console.log("changes", changes);
    this.getAPICurrentProduction()

  }

  private getAPICurrentProduction() {
    console.log(this.UrlAPI_GetCurrentProduction + this.MachineID);
    this.brokerAPIService.get(this.UrlAPI_GetCurrentProduction + this.MachineID).subscribe(data => {
      console.log("UrlAPI_GetCurrentProduction", data);
      if (data != null) {
        this.objCurrentProduction = data;
        this.dataSource_currentOperation = this.objCurrentProduction.currentOperation.productionDetail;
        this.dataSource_previousOperation = this.objCurrentProduction.previousOperation.productionDetail;

        this.previousShift.shiftName = this.objCurrentProduction.previousOperation.shiftName;
        this.currentShift.shiftName = this.objCurrentProduction.currentOperation.shiftName;
        this.previousShift.operationTime = this.objCurrentProduction.previousOperation.operationTime;
        this.currentShift.operationTime = this.objCurrentProduction.currentOperation.operationTime;

        this.lengthCurrent = this.objCurrentProduction.currentOperation.productionDetail.length;
        this.lengthPrevious = this.objCurrentProduction.previousOperation.productionDetail.length;
      }
      else {
        this.objCurrentProduction = null;
        this.dataSource_currentOperation = null;
        this.dataSource_previousOperation = null;

        this.previousShift.shiftName = null;
        this.currentShift.shiftName = null;
        this.previousShift.operationTime = null;
        this.currentShift.operationTime = null;
      }
    });
  }

  private getAPICurrentShift() {
    console.log(this.UrlAPI_GetCurrentShift);
    this.brokerAPIService.get(this.UrlAPI_GetCurrentShift).subscribe(data => {
      console.log("UrlAPI_GetCurrentShift", data);
      if (data != null) {
        if (data.previousShift != null && data.currentShift != null) {
          this.previousShift = data.previousShift;
          this.currentShift = data.currentShift

          console.log(this.previousShift);

          this.previousShift.startShiftHour = ("0" + this.previousShift.startShiftHour).slice(-2);
          this.previousShift.startShiftMinute = ("0" + this.previousShift.startShiftMinute).slice(-2);

          this.previousShift.endShiftHour = ("0" + this.previousShift.endShiftHour).slice(-2);
          this.previousShift.endShiftMinute = ("0" + this.previousShift.endShiftMinute).slice(-2);

          this.currentShift.startShiftHour = ("0" + this.currentShift.startShiftHour).slice(-2);
          this.currentShift.startShiftMinute = ("0" + this.currentShift.startShiftMinute).slice(-2);

          this.currentShift.endShiftHour = ("0" + this.currentShift.endShiftHour).slice(-2);
          this.currentShift.endShiftMinute = ("0" + this.currentShift.endShiftMinute).slice(-2);
        }
      }
    });
  }


  rowClicked(row: any, tableName: string): void {
    console.log(row);

    // this.objRowSelected = <IArticle>row;
    // this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter } ]);

  }



}



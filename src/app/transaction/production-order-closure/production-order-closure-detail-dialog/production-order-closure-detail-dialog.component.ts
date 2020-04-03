import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";

import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { Moment } from "moment";

@Component({
  selector: "app-production-order-closure-detail-dialog",
  templateUrl: "./production-order-closure-detail-dialog.component.html",
  styleUrls: ["./production-order-closure-detail-dialog.component.scss"]
})
export class ProductionOrderClosureDetailDialogComponent implements OnInit {
  displayedColumns = [
    "OrderNo",
    "product",
    "totalOrderQty",
    "totalFGQty",
    "percentFG"
  ]; //["No", "product", "totalOrderQty", "percentFG", "%FG"];
  dataSource1 = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  objDataHead: any;

  constructor(
    public dialogRef: MatDialogRef<ProductionOrderClosureDetailDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data",data);
  }

  headDate: any;
  ngOnInit() {
    this.dataSource1.data = this.data.objSend;
    this.objDataHead = this.data.objHeadData[0];
    this.headDate = moment(this.objDataHead.deliveryDate).format("DD/MM/YYYY");
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  onClickSave(): void {
    console.log("Save");
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

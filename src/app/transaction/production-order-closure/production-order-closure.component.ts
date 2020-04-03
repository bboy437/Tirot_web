import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MatTableDataSource,
  MatSort,
  MatPaginator
} from "@angular/material";
import { ProductionOrderClosureDetailDialogComponent } from "./production-order-closure-detail-dialog/production-order-closure-detail-dialog.component";
import { Validate } from "../../librarys/Validate";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-production-order-closure",
  templateUrl: "./production-order-closure.component.html",
  styleUrls: ["./production-order-closure.component.scss"]
})
export class ProductionOrderClosureComponent implements OnInit {
  //System
  // import { Validate } from "../../librarys/Validate";
  objValidate: Validate;
  objCurrentData: any;
  //URL
  private UrlAPI_GetOrderClosure: string = "ProductionOrder/GetOrderClosure/";

  //Component
  isDelivery: boolean = true;
  arrMonth: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  arrYear: any = [];

  numYearSelected: number;
  numMonthSelected: number;
  numTolerances: number = 5;
  isOpenComponentCondition: boolean;
  arrBufferProductionOrderIDChecked: any = [];

  dialogRef: MatDialogRef<ProductionOrderClosureDetailDialogComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    "select",
    "productionOrderNo",
    "madeTo",
    "deliveryDate",
    "totalOrderQty",
    "totalFGQty",
    "percentFG"
  ];
  dataSource1 = new MatTableDataSource();

  // deliveryDate: "2019-01-29T00:00:00"
  // madeTo: "เทยิน"
  // percentFG: 200
  // productionOrderId: 60
  // productionOrderNo: "P20190111002"
  // totalFGQty: 200
  // totalOrderQty: 100

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {
    this.objValidate = new Validate();
  }

  // await this.brokerAPIService.getAwait(
  //   "ProductionOrder/GetOrderClosureDetail/61",
  //   this.resolveGetOrderClosure,
  //   this.rejectGetOrderClosure
  // );

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  async ngOnInit() {
    this.setYear();
    this.setCurrentDate();

    await this.GetAPITableOrderClosureThenRefleshTable();
  }

  //##### API ####
  async GetAPITableOrderClosureThenRefleshTable() {
    this.dialogService.showLoader();

    try {
      let data: any = await this.brokerAPIService.getAwait(
        this.getURLGetOrderClosure(
          this.numYearSelected,
          this.numMonthSelected,
          this.numTolerances
        )
      );

      //set default allrow select false
      this.objCurrentData = data;
      data.forEach(element => {
        element["select"] = false;
      });

      this.dataSource1.data = data;

      //Clear buffer checked order id
      this.arrBufferProductionOrderIDChecked = [];
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  async PostAPICloseOrder() {
    // return;
    this.dialogService.showLoader();

    //Validate
    // if (!this.validatePost()) {
    //   this.dialogService.hideLoader();
    //   return;
    // }

    try {
      let data: any = await this.brokerAPIService.postAwait(
        "ProductionOrder/CloseProductionOrder",
        this.arrBufferProductionOrderIDChecked
      );

      if (data.success) {
        await this.GetAPITableOrderClosureThenRefleshTable();
      } else {
        this.dialogService.showDialog("error", "Error", data.message);
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }
  // validatePost() {
  //   if (this.arrBufferProductionOrderIDChecked.length <= 0) {
  //     //show dialog
  //     this.dialogService.showDialog(
  //       "Type",
  //       "Close Order",
  //       "กรุณาเลือกรายการที่จะลบ"
  //     );
  //     return false;
  //   }
  //   return true;
  // }

  rejectUpdateCloseProductionOrder(err: any) {
    console.log("Do rejectUpdateCloseProductionOrder ######");
    console.log(err);
  }

  //###### Event

  btnDeleteClick() {
    console.log("onclick Close order");

    if (this.arrBufferProductionOrderIDChecked.length <= 0) {
      //show dialog
      this.dialogService.showDialog(
        "Type",
        "Close Order",
        "Please your choose Order Closure."
      );
      return false;
    }

    this.dialogService.showDialogConfirm(
      "",
      "Confirm",
      "Confirm Order Closure ?",
      "400px",
      "220px"
    );
    this.dialogService.dialogConfirm.afterClosed().subscribe(result => {
      console.log("The dialog was closed == ", result);
      if (result === "confirm") {
        this.PostAPICloseOrder();
      }
    });
  }

  onchangeDelivery(checked) {
    console.log(checked);
    if (checked) {
      this.setCurrentDate();
      this.isOpenComponentCondition = false;
    } else {
      this.setDefaultComponent();

      this.isOpenComponentCondition = true;
    }
    this.GetAPITableOrderClosureThenRefleshTable();
  }
  onMonthChange(month) {
    this.numMonthSelected = month;
    console.log(this.numMonthSelected);

    this.GetAPITableOrderClosureThenRefleshTable();
  }
  onYearChange(year) {
    this.numYearSelected = year;
    console.log(this.numYearSelected);

    this.GetAPITableOrderClosureThenRefleshTable();
  }

  isCheckingbox = false;
  onCheckbox(checked, productionOrderId) {
    this.isCheckingbox = true;
    console.log("onCheckbox");

    if (checked === true)
      this.arrBufferProductionOrderIDChecked.push(productionOrderId);
    else {
      const index = this.arrBufferProductionOrderIDChecked.indexOf(
        productionOrderId,
        0
      );
      if (index > -1) {
        this.arrBufferProductionOrderIDChecked.splice(index, 1);
      }
    }
    console.log("PID buffer = ", this.arrBufferProductionOrderIDChecked);
  }

  async onRowClicked(row) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      //block when click check box
      if (this.isCheckingbox) {
        this.isCheckingbox = false;
        return;
      }
      console.log(row);

      let data: any = await this.brokerAPIService.getAwait(
        "ProductionOrder/GetOrderClosureDetail/" + row.productionOrderId
      );
      console.log("xxxxxx", data);

      this.showDialog(data);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  changeTolerances(value) {
    setTimeout(() => {
      if (value > 100) this.numTolerances = 100;
    }, 10);
  }
  onFocusOutTolerances() {
    this.GetAPITableOrderClosureThenRefleshTable();
  }

  //#####################
  showDialog(arrObjDataDetailDialogComponent) {
    // console.log("Open dialog", arrObjDetailDialogComponent);

    let objSend: any = {
      objSend: arrObjDataDetailDialogComponent,
      objHeadData: this.objCurrentData
    };

    let dialogRef = this.dialog.open(
      ProductionOrderClosureDetailDialogComponent,
      {
        data: objSend,
        disableClose: true,
        width: "850px",
        height: "520px"
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result != undefined) {
        // this.objRow.sensorExpression = result;
        // console.log(result);
      }
    });
  }

  //###### Set Get ######
  setCurrentDate() {
    var date = new Date();

    this.numMonthSelected = date.getMonth() + 1;
    this.numYearSelected = date.getFullYear();
    this.numTolerances = 5;
  }
  setDefaultComponent() {
    this.numMonthSelected = 0;
    this.numYearSelected = 0;
    this.numTolerances = 0;
  }
  setYear() {
    var date = new Date();
    let currentYear = date.getFullYear();

    this.arrYear = [];
    for (let index = 0; index < 11; index++) {
      this.arrYear.push(currentYear - index);
    }
  }

  getURLGetOrderClosure(numYearSelected, numMonthSelected, numTolerances) {
    let url =
      this.UrlAPI_GetOrderClosure +
      numYearSelected +
      "," +
      numMonthSelected +
      "," +
      numTolerances;

    return url;
  }
}

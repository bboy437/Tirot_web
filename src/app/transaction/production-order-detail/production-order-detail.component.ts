import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import {
  ICustomer,
  IProduct,
  IOrderItem
} from "../../interfaces/productionrecords";
import { IProductionOrder } from "../../interfaces/productionrecords";
import { ProductionOrderDetailDialogComponent } from "../production-order-detail/dialog/production-order-detail-dialog/production-order-detail-dialog.component";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  VERSION,
  MatSnackBar,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DialogService } from "../../services/dialog.service";

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
import * as moment from "moment";
import { Moment } from "moment";
import { ConfirmCancelorderDialogComponent } from "../../dialogs/confirm-cancelorder-dialog/confirm-cancelorder-dialog.component";

@Component({
  selector: "app-production-order-detail",
  templateUrl: "./production-order-detail.component.html",
  styleUrls: ["./production-order-detail.component.scss"],
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
export class ProductionOrderDetailComponent implements OnInit, AfterViewInit {
  version = VERSION;
  isLoadingResults = false;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  dialogRefCanaelOrder: MatDialogRef<ConfirmCancelorderDialogComponent>;
  dialogRefProduction: MatDialogRef<ProductionOrderDetailDialogComponent>;

  numYearSelected: number;
  numMonthSelected: number;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) { }

  // public isLoadingResults = false;
  dataSource = new MatTableDataSource();
  displayedColumns = ["itemNo", "product.productName", "orderQty", "actions"];

  private RowID: string;
  arrobjFG: any = [];
  arrobjCustomer: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  objorderItems: any = {};

  filter: string;
  month: string;
  year: string;

  private UrlAPI_GetSingleRow: string = "ProductionOrder/Get/";
  private UrlAPI_Update: string = "ProductionOrder/Update";
  private UrlAPI_Create: string = "ProductionOrder/Create";
  private UrlAPI_GetAllCustomer: string = "Customer/GetAll";
  private Url_Listing: string = "/auth/transaction/production-order-listing";
  private UrlAPI_Delete: string = "ProductionOrder/CancelOrder";

  @ViewChild("MatPaginatorProductionOrder")
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild("fileInput")
  fileInput;

  public productionOrderNo: string;
  public productionOrderDate: string;
  public deliveryDate: string;
  public Madeto: string;
  public customerOrderId: string;
  public cutomerOrderDate: string;
  public remark: string;
  status: any;
  readonly = false;
  customerName: string;
  madeTo: string;
  cutomerOrderDates: any;
  productionOrderDates: any;
  deliveryDates: any;

  ngOnInit() {
    console.log("***** production detail");

    this.setSelectCustomer();
    // this.isLoadingResults = true;

    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      this.filter = params.get("filter");
      this.month = params.get("month");
      this.year = params.get("year");
      this.status = params.get("status");
      // console.log(params.get("status"));
      if (this.status == 3) {
        this.readonly = true;
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <IProductionOrder>data;
            this.cutomerOrderDates = moment(this.objRow.cutomerOrderDate).format("DD/MM/YYYY");
            this.productionOrderDates = moment(this.objRow.productionOrderDate).format("DD/MM/YYYY");
            this.deliveryDates = moment(this.objRow.deliveryDate).format("DD/MM/YYYY");
            this.customerName = this.objRow.customerOrder.customerName;
            if (this.objRow.madeTo == "O") {
              this.madeTo = "Order";
            }
            if (this.objRow.madeTo == "S") {
              this.madeTo = "Stock";
            }
            // console.log("test", this.objRow);
          });
      }

      if (this.RowID == "new") {
        this.objRow.productionOrderNo = "<Auto Gen.>";
        this.objRow.productionOrderDate = new Date();
        this.objRow.deliveryDate = null;
        this.objRow.madeTo = "O";
        this.objRow.customerOrderId = null;
        this.objRow.cutomerOrderDate = null;
        this.objRow.remark = null;
      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <IProductionOrder>data;
            // console.log(this.objRow);
            this.dataSource.data = this.objRow.orderItems;
            // console.log("orderItems",this.objRow.orderItems);
          });
      }
    }
    // this.isLoadingResults = false;
  }

  setSelectCustomer() {
    this.brokerAPIService.get(this.UrlAPI_GetAllCustomer).subscribe(data => {
      this.arrobjCustomer = <ICustomer[]>data;
      console.log(this.arrobjCustomer);
    });
  }

  btnSaveClick() {
    if (this.validate()) {
      this.save();
    }
    //console.log(this.uploadfile(this.fileInput.nativeElement));
    // let strUrl : string = "";
    // let fi : any = this.fileInput.nativeElement;
    // if (fi.files && fi.files[0]) {
    //   let fileToUpload = fi.files[0];
    //   this.brokerAPIService.upload("Utility/UploadFile", fileToUpload).subscribe(
    //     data => {
    //       this.objAPIResponse = <IAPIResponse>data;
    //       if (this.objAPIResponse.success) {
    //         strUrl = this.objAPIResponse.data;
    //         console.log("strUrl");
    //         console.log(strUrl);

    //         console.log("save");
    //         this.save();
    //       }
    //       else {
    //         console.log('this.objAPIResponse.success :' + this.objAPIResponse.success);
    //         strUrl = "error";
    //       }
    //     },
    //     err => {
    //       // กรณี error
    //       console.log('Something went wrong!');
    //       strUrl = "error";
    //     });

    // }
    // this.save();
  }

  uploadfile(fi: any): Observable<string> {
    let strUrl: string = "";
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.brokerAPIService
        .upload("Utility/UploadFile", fileToUpload)
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              strUrl = this.objAPIResponse.data;
            } else {
              console.log(
                "this.objAPIResponse.success :" + this.objAPIResponse.success
              );
              strUrl = "error";
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
            strUrl = "error";
          }
        );
    }

    return Observable.of(strUrl);
  }
  validate() {
    console.log(this.objRow.deliveryDate);
    let strValidate: string = "";

    if (
      this.objRow.deliveryDate == undefined ||
      this.objRow.deliveryDate == ""
    ) {
      strValidate = "Delivery Date";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.madeTo == undefined || this.objRow.madeTo == "") {
      strValidate = "Made To";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.madeTo == "O") {
      if (
        this.objRow.customerOrderId == undefined ||
        this.objRow.customerOrderId == ""
      ) {
        strValidate = "Customer";
      }

      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      }
      if (
        this.objRow.cutomerOrderDate == undefined ||
        this.objRow.cutomerOrderDate == ""
      ) {
        strValidate = "Customer Order Date";
      }

      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      }
    }

    if (this.objRow.orderItems == undefined || this.objRow.orderItems == "") {
      strValidate = " not data orderItems";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }

  save() {
    console.log("save()");
    if (this.RowID == "new") {
      //Create
      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";
      this.objRow.inActivated = false;

      this.brokerAPIService.post(this.UrlAPI_Create, this.getdata()).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
            this.router.navigate([
              this.Url_Listing,
              { filter: this.filter, month: this.month, year: this.year }
            ]);
          } else {
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width: "300px",
              height: "200px",
              data: {
                Messagetype: "error",
                Messagetitle: "Error",
                Messagebody: "Save Error"
              },
              disableClose: true
            });
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
    } else {
      //Update
      console.log(this.objRow);
      this.brokerAPIService.post(this.UrlAPI_Update, this.getdata()).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
            this.router.navigate([
              this.Url_Listing,
              { filter: this.filter, month: this.month, year: this.year }
            ]);
          } else {
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width: "300px",
              height: "200px",
              data: {
                Messagetype: "error",
                Messagetitle: "Error",
                Messagebody: "Save Error"
              },
              disableClose: true
            });
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
    }

    // return Observable.of(false);
  }
  getdata() {
    let objdata: any = {};
    if (this.objRow.id !== undefined) {
      objdata.id = this.objRow.id;
    }

    if (
      this.objRow.productionOrderNo !== undefined &&
      this.objRow.productionOrderNo != "<Auto Gen.>"
    ) {
      objdata.productionOrderNo = this.objRow.productionOrderNo;
    }

    if (this.objRow.productionOrderDate !== undefined) {
      // objdata.productionOrderDate = this.objRow.productionOrderDate;
      objdata.productionOrderDate = this.datePipe.transform(
        this.objRow.productionOrderDate,
        "yyyy-MM-ddTHH:mm:ss"
      );
    }

    if (this.objRow.deliveryDate !== undefined) {
      //  objdata.deliveryDate = this.objRow.deliveryDate;
      objdata.deliveryDate = this.datePipe.transform(
        this.objRow.deliveryDate,
        "yyyy-MM-ddTHH:mm:ss"
      );
    }

    if (this.objRow.madeTo !== undefined) {
      objdata.madeTo = this.objRow.madeTo;
    }

    console.log(this.objRow.customerOrderId);
    if (
      this.objRow.customerOrderId != null &&
      this.objRow.customerOrderId != undefined
    ) {
      let objCustomer: any = {};
      objCustomer = this.arrobjCustomer.filter(
        obj => obj.id === this.objRow.customerOrderId
      );

      if (objCustomer[0].id !== undefined) {
        objdata.customerOrderId = objCustomer[0].id;
      }
      objdata.customerOrderId = this.objRow.customerOrderId;
    }

    if (this.objRow.madeTo == "S") {
      objdata.customerOrderId = 1;
    }

    if (
      this.objRow.cutomerOrderDate !== undefined &&
      this.objRow.cutomerOrderDate !== null
    ) {
      // objdata.cutomerOrderDate = this.objRow.cutomerOrderDate;
      objdata.cutomerOrderDate = this.datePipe.transform(
        this.objRow.cutomerOrderDate,
        "yyyy-MM-ddTHH:mm:ss"
      );
    }

    if (this.objRow.remark !== undefined) {
      objdata.remark = this.objRow.remark;
    }

    // let objFG : any ={};
    // objFG =  this.arrobjFG.filter(obj => obj.id === this.objRow.id);
    // console.log("objFG");
    // console.log(objFG[0]);
    // if (objFG[0].id !== undefined){
    //   objdata.id = objFG[0].id;
    // }
    // objdata.id =this.objRow.id
    // if (objFG[0].productionOrderNo !== undefined){
    //   objdata.productionOrderNo = objFG[0].productionOrderNo;
    // }
    // objdata.productionOrderNo = this.objRow.productionOrderNo
    // if (objFG[0].productionOrderDate !== undefined){
    //   objdata.productionOrderDate = objFG[0].productionOrderDate;
    // }
    // objdata.productionOrderDate = this.objRow.productionOrderDate

    objdata.createBy = this.objRow.createBy;
    if (this.objRow.createDate !== undefined) {
      objdata.createDate = this.objRow.createDate;
    }
    objdata.updateBy = this.objRow.updateBy;
    if (this.objRow.updateDate !== undefined) {
      objdata.updateDate = this.objRow.updateDate;
    }

    objdata.inActivated = this.objRow.inActivated;

    let dataorderItems: any = [];
    let i: number = 0;

    this.objRow.orderItems.forEach(element => {
      console.log(element);
      dataorderItems[i] = {};

      if (element.id !== undefined && element.id !== null) {
        dataorderItems[i].id = element.id;
      }
      dataorderItems[i].itemNo = element.itemNo;
      dataorderItems[i].productionOrderId = this.objRow.id;
      dataorderItems[i].productId = element.product.id;
      dataorderItems[i].status = element.status;
      dataorderItems[i].orderQty = element.orderQty;

      dataorderItems[i].createBy = element.createBy;
      if (element.createDate !== undefined) {
        dataorderItems[i].createDate = element.createDate;
      }
      dataorderItems[i].updateBy = element.updateBy;
      if (element.updateDate !== undefined) {
        dataorderItems[i].updateDate = element.updateDate;
      }

      i++;
    });
    objdata.orderItems = dataorderItems;

    console.log("getdata");
    console.log(objdata);
    return objdata;
  }

  addNew() {
    const dialogRefProduction = this.dialog.open(
      ProductionOrderDetailDialogComponent,
      {
        data: this.getItemNo(),
        disableClose: true
      }
    );

    dialogRefProduction.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.itemNo != undefined) {
          if (this.objRow.orderItems == undefined) {
            this.objRow.orderItems = <IProductionOrder[]>[];
            this.objRow.orderItems[0] = result;
          } else {
            this.objRow.orderItems.push(result);
          }
          this.bindOrderItemDataSource();
        }
      }
    });

  }

  private getItemNo() {
    console.log(this.objRow.orderItems);
    console.log("this.objRow.length");
    let objItemOrder: any = {};
    objItemOrder.id = 0;
    if (this.objRow.orderItems != undefined) {
      if (this.objRow.orderItems.length > 0) {
        objItemOrder.itemNo =
          this.objRow.orderItems[this.objRow.orderItems.length - 1].itemNo + 1;
      } else {
        objItemOrder.itemNo = 1;
      }
    } else {
      objItemOrder.itemNo = 1;
    }

    return objItemOrder;
  }

  private bindOrderItemDataSource() {
    this.dataSource.data = this.objRow.orderItems.sort(function (a, b) {
      return a.itemNo - b.itemNo;
    });
  }

  startEdit(id: number) {
    this.objorderItems = this.objRow.orderItems.find(x => x.id === id);

    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);
    this.dialogRefProduction = this.dialog.open(
      ProductionOrderDetailDialogComponent,
      {
        data: this.objorderItems,
        disableClose: true
      }
    );
    this.dialogRefProduction.afterClosed().subscribe(result => {
      console.log("afterClosed Edit");
      console.log(result);
      if (result != undefined) {
        // if (result.process != undefined) {
        // }
      }
      this.bindOrderItemDataSource();
    });
  }

  deleteItem(index: number, id: number) {
    this.dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
      // data: {id: id, title: title, state: state, url: url}
      disableClose: true
    });

    this.dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        console.log(id);
        // const foundIndex = this.objoperationInstruction.findIndex(x => x.id === id);
        // console.log(foundIndex);
        // for delete we use splice in order to remove single object from DataService
        this.objorderItems = this.objRow.orderItems.find(x => x.id === id);
        this.objRow.orderItems = this.objRow.orderItems
          .filter(obj => obj !== this.objorderItems)
          .map((obj, idx) => ((obj.itemNo = idx + 1), obj));
        //delete this.objRow.operationInstruction[index];

        this.bindOrderItemDataSource();
      }
    });
  }


  btnCloseClick() {
    this.router.navigate([
      this.Url_Listing,
      { filter: this.filter, month: this.month, year: this.year }
    ]);
  }

  cancelOrder(id: number) {
    const dialogRefCanaelOrder = this.dialog.open(ConfirmCancelorderDialogComponent, {
      disableClose: true
    });
    dialogRefCanaelOrder.afterClosed().subscribe(result => {
      if (result) {
        // let objdelete =  this.getdata().find(
        //     x => x.id === id
        // );
        this.brokerAPIService.post(this.UrlAPI_Delete, this.getdata()).subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.router.navigate([
                this.Url_Listing,
                { filter: this.filter, month: this.month, year: this.year }
              ]);
            }
            else {
              this.dialogService.showDialog(
                "error",
                "Error",
                this.objAPIResponse.message,
                "800px"
              );
            }
          });
      }
    });
  }

  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (obj, property) =>
      this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);

  // showSnackBar(message: string) {
  //   this.snackBar.open(message, "", {
  //     duration: 2000
  //   });
  // }
  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }
  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "300px",
      height: "200px",
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }
}

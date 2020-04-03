import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import {
  IProduct,
  ITeam,
  IShiftSchdule,
  IProcess,
  IProductionOrder,
  IProcessLot
} from "../../interfaces/productionrecords";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";
import * as moment from "moment";
import { Moment } from "moment";
import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  VERSION,
  MatSnackBar,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { DialogService } from "../../services/dialog.service";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { ProductionPlaningViewComponent } from "./dialog/production-planing-view/production-planing-view.component";

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
  selector: "app-production-planing-entry",
  templateUrl: "./production-planing-entry.component.html",
  styleUrls: ["./production-planing-entry.component.scss"],
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
export class ProductionPlaningEntryComponent implements OnInit {
  version = VERSION;

  dialogRef: MatDialogRef<MessageDialogComponent>;
  //planType: string = "PR";
  public maskTime = [/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/];
  filteredOpenProductionOrder: Observable<any[]>;
  allOpenProductionOrder: any = [];
  myControl = new FormControl();
  defaultStandard: string;
  ProductionOrderNoReadOnly: boolean = false;
  objarrStandard: any = [];
  wokingTeamId: any;
  totalOrder: any;
  totalPlan: any;
  totalWIP: any;
  totalFG: any;
  objOrderHistory: any;

  dataSource = new MatTableDataSource();
  displayedColumns = [
    "lotNo",
    "jobOrderNo",
    "rollNo",
    "processName",
    "productionDateTime",
    "planFinishTime",
    "planQty",
    "fgQty",
    "planDateTime",
    "actions"
  ];
  deliveryDate: any;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) { }

  // dataSource = new MatTableDataSource();
  // displayedColumns = [
  //   "process.processName",
  //   "rawmaterialName",
  //   "product.productName",
  //   "process.defaultStandard",
  //   "actions"
  // ];

  ProductionOrderNo: string;
  JobOrderNo: string;
  LotNo: string;
  ProcessID_PR: number;
  ProcessID_NR: number;
  ProductID: number;

  TotalOrderLength: number;
  PlanedLength: number;
  WIPLength: number;
  FGLength: number;
  OrderLength: number;
  RollNo_OrderNo: string;
  StandardID: number;
  planQty: number;
  planDate: Moment = moment();

  RowID: string;
  arrobjFG: any = [];
  objProductionPlaning: any = {};
  objAPIResponse: any = {};
  objoperationInstruction: any = {};
  objProcessID_PR: any = {};

  planStartTime: any;
  planFinishTime: any;
  ///None Production

  arrobjProcessID_PR: any = [];
  arrobjActivity: any = [];
  arrobjProcessNR: any = [];
  arrobjProcessPR: any = [];
  arrobjLotNo: any = [];
  arrobjShift: any = [];
  arrobjTeam: any = [];
  arrobjProduct: any = [];
  objProductNP: any = {};
  processName: string;
  FilterPlan: string = "";
  planView: any ;

  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";
  private UrlAPI_GetAllTeam: string = "Team/GetAll";
  private UrlAPI_GetAllNR: string = "Process/GetAllNR";
  private UrlAPI_GetGetProcessByProduct: string =
    "Article/GetProcessByProduct/";

  private UrlAPI_GetLotByOrderNo: string = "Article/GetLotByOrderNo/";

  private UrlAPI_GetProcessByLot: string = "Article/GetProcessByLot/";
  private UrlAPI_GetOrderQtySummary: string =
    "ProductionOrder/GetOrderQtySummary/";
  private UrlAPI_Machine_GetAllActive: string = "Machine/GetAllActive";
  private UrlAPI_GetProductionOrder: string = "ProductionOrder/Get/";
  private UrlAPI_GetNP: string = "Product/GetNP";
  private UrlAPIGetPreviousOrderRollNo: string =
    "ProductionOrder/GetPreviousOrderRollNo/";
  private UrlAPI_GetStandardList: string = "Standard/GetStandardList/";
  private UrlAPI_GetSingleRow: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_Update: string = "ProductionOrder/UpdateProductionPlan";
  private UrlAPI_Create: string = "ProductionOrder/CreateProductionPlan";
  private UrlAPI_Delete: string = "/ProductionOrder/DeleteProductionPlan";
  private UrlAPI_GetAllFG: string = "Product/GetAllFG";
  private UrlAPI_GetListOpenProductionOrderNo: string =
    "ProductionOrder/GetListOpenProductionOrderNo";
  private Url_Listing: string = "/auth/transaction/production-planing";

  private UrlAPI_GetOrderHistory: string = "ProductionOrder/GetOrderHistory/";

  @ViewChild("MatPaginatorArticle")
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild("fileInput")
  fileInput;

  async ngOnInit() {
    this.dialogService.showLoader();

    try {
      await this.setOpenProductionOrder();
      await this.setSelectArticle();
      await this.setSelectTeam();
      await this.setSelectShift();
      await this.setSelectNR();
      await this.setProductNP();

      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        this.RowID = params.get("id");
        this.FilterPlan = params.get("FilterPlan");
        this.planView = JSON.parse(params.get('planView'));
        console.log("planView", JSON.parse(params.get('planView')));

        if (this.RowID == "new") {
          this.ProductionOrderNoReadOnly = false;
          this.objProductionPlaning.useForProductId = null;
          this.planDate = moment(params.get("date"));
          this.LotNo = "0";
          this.JobOrderNo = "<Auto Gen.>";
          // this.objProductionPlaning.shiftID = + localStorage.getItem("shiftID")
          this.objProductionPlaning.planType = "PR";
        } else {
    
          this.ProductionOrderNoReadOnly = true;
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objProductionPlaning = data;
          this.planDate = moment(this.objProductionPlaning.planDate);
          this.planStartTime = moment(this.objProductionPlaning.planStartTime).format("HH:mm");
          this.planFinishTime = moment(this.objProductionPlaning.planFinishTime).format("HH:mm");
          this.JobOrderNo = this.objProductionPlaning.jobOrderNo;
          this.planQty = this.objProductionPlaning.planQty;
          if (this.objProductionPlaning.planType == "PR") {
            this.LotNo = this.objProductionPlaning.lotNo;
            let objlot: any = {};
            objlot.id = this.LotNo;
            this.arrobjLotNo.push(objlot);
            this.ProductionOrderNo = this.objProductionPlaning.productionOrderNo;
            this.ProductID = this.objProductionPlaning.productId;
            await this.getAPIGetOrderQtySummary();
            this.processName = this.objProductionPlaning.process.processName;
            this.ProcessID_PR = this.objProductionPlaning.processId;

            await this.getAPIGetOrderHistory(this.ProductionOrderNo, this.ProductID);

            this._filter(this.ProductionOrderNo);
            let objOpenProductionOrder = this.allOpenProductionOrder.filter(
              option =>
                option.productionOrderNo
                  .toLowerCase()
                  .includes(this.ProductionOrderNo)
            );
            if (objOpenProductionOrder.length == 1) {
              await this.setProductEdit(objOpenProductionOrder[0].id, this.objProductionPlaning.productId, this.objProductionPlaning.processId);
            }
            this.StandardID = this.objProductionPlaning.standardId;
            await this.setStandard(this.ProcessID_PR);
            this.RollNo_OrderNo = this.objProductionPlaning.rollNo;

          } else if (this.objProductionPlaning.planType == "NR") {
            this.ProcessID_NR = this.objProductionPlaning.processId;
          }
        }
      }

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  //keynumber
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  planStartTimeOnChange(planStartTimeValue: string) {
    console.log("onValueUpdate " + this.planStartTime);
  }

  planStartTimeOnInput(planTimeValue: string) {
    let arrtime = planTimeValue.split(":");
    if (arrtime.length == 2) {
      if (Number(arrtime[0]) > 23) {
        this.planStartTime = "00:00";
      }
    }
  }

  planFinishTimeOnInput(planTimeValue: string) {
    let arrtime = planTimeValue.split(":");
    if (arrtime.length == 2) {
      if (Number(arrtime[0]) > 23) {
        this.planFinishTime = "00:00";
      }
    }
  }


  async btnSaveClick() {
    try {
      await this.save();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

  }
  btnDeleteClick() {
    this.delete();
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

  async save() {
    try {
      this.objProductionPlaning.planDate = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
      this.objProductionPlaning.planStartTime = this.getPlanStartTime();
      this.objProductionPlaning.planFinishTime = this.getPlanFinishTime();
      if (this.RowID == "new") {
        await this.APISave(this.UrlAPI_Create);
      } else {
        await this.APISave(this.UrlAPI_Update);
        // console.log(this.getdata());

      }
    } catch (error) {
      throw error;
    }
    // return Observable.of(false);
  }

  async APISave(strUrlAPI: string) {
    try {

      this.dialogService.showLoader();
      let data = await this.brokerAPIService.postAwait(strUrlAPI, this.getdata());
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.hideLoader();
        this.dialogService.showSnackBar("Save Complete");
        this.router.navigate([this.Url_Listing, { FilterPlan: this.FilterPlan }]);
      }
      else {
        this.dialogService.hideLoader();
        this.dialogService.showDialog("error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // let objdelete =  this.getdata().find(
        //     x => x.id === id
        this.brokerAPIService.post(this.UrlAPI_Delete, this.getdata()).subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.dialogService.hideLoader();
              this.dialogService.showSnackBar("Delete Complete");

              this.router.navigate([
                this.Url_Listing,
                { FilterPlan: this.FilterPlan }
              ]);
            } else {
              this.dialogService.hideLoader();
              this.dialogService.showDialog(
                "error",
                "Error",
                this.objAPIResponse.message,
                "800px"
              );
            }
          },
          err => {
            this.dialogService.hideLoader();
            this.dialogService.showDialog(
              "error",
              "Error",
              this.objAPIResponse.message,
              "800px"
            );
          }
        );
      }
    });
  }

  // delete() {
  //   if (this.RowID == "new") {
  //     return;
  //   }
  //   // var objDataPost = { id: this.RowID };
  //   // console.log(objDataPost);

  //   this.brokerAPIService.post(this.UrlAPI_Delete, this.getdata()).subscribe(
  //     data => {
  //       this.objAPIResponse = <IAPIResponse>data;
  //       if (this.objAPIResponse.success) {
  //         this.dialogService.hideLoader();
  //         this.dialogService.showSnackBar("Delete Complete");

  //         this.router.navigate([
  //           this.Url_Listing,
  //           { FilterPlan: this.FilterPlan }
  //         ]);
  //       } else {
  //         this.dialogService.hideLoader();
  //         this.dialogService.showDialog(
  //           "error",
  //           "Error",
  //           this.objAPIResponse.message,
  //           "800px"
  //         );
  //       }
  //     },
  //     err => {
  //       this.dialogService.hideLoader();
  //       this.dialogService.showDialog(
  //         "error",
  //         "Error",
  //         this.objAPIResponse.message,
  //         "800px"
  //       );
  //     }
  //   );

  //   // return Observable.of(false);
  // }
  private getPlanFinishTime(day: number = 0) {
    let result: string = "";
    if (this.planFinishTime != null && this.planFinishTime != "") {
      let arrplanFinishTime: String[];
      arrplanFinishTime = this.planFinishTime.split(":");

      let planFinishTime: Moment = moment(this.planDate.toDate().setHours(+arrplanFinishTime[0], +arrplanFinishTime[1]));
      planFinishTime.add(day, 'days');
      result = planFinishTime.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      result = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    }
    return result;
  }

  private getPlanStartTime(): string {
    let result: string = "";
    if (this.planStartTime != null && this.planStartTime != "") {
      let arrplanStartTime: String[];
      arrplanStartTime = this.planStartTime.split(":");
      let planStartTime: Moment = moment(
        this.planDate
          .toDate()
          .setHours(+arrplanStartTime[0], +arrplanStartTime[1])
      );
      result = planStartTime.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      result = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    }

    return result;
  }

  getdata() {
    let objdata: any = {};
    if (this.RowID == "new") {
      objdata.createBy = localStorage.getItem("currentUserName");
    } else {
      if (this.objProductionPlaning.id !== undefined) {
        objdata.id = this.objProductionPlaning.id;
      }
      objdata.createBy = this.objProductionPlaning.createBy;
    }

    // this.objProductionPlaning.planType = this.planType;
    
    objdata.planType = this.objProductionPlaning.planType;
    objdata.planDate = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    objdata.shiftId = this.objProductionPlaning.shiftId;
    objdata.wokingTeamId = this.objProductionPlaning.wokingTeamId;

    objdata.planStartTime = this.getPlanStartTime();

    if (moment(this.getPlanStartTime()).isAfter(moment(this.getPlanFinishTime()))) {
      objdata.planFinishTime = this.getPlanFinishTime(1);
    }
    else {
      objdata.planFinishTime = this.getPlanFinishTime();
    }

    objdata.remark = "";
    
    if (this.objProductionPlaning.planType == "PR") {
      objdata.productionOrderNo = this.ProductionOrderNo;
      objdata.processId = this.ProcessID_PR;
      objdata.productId = this.ProductID;
      objdata.rollNo = this.RollNo_OrderNo;
      objdata.standardId = this.StandardID;
      objdata.planQty = this.planQty;
      objdata.lotNo = this.LotNo;
    } else if (this.objProductionPlaning.planType == "NR") {
      objdata.processId = this.ProcessID_NR;
      objdata.productId = 18;
      objdata.standardId = 1;
    }



    if (this.objProductionPlaning.createDate !== undefined) {
      objdata.createDate = this.objProductionPlaning.createDate;
    }

    //objdata.updateBy = this.objProductionPlaning.updateBy;
    objdata.updateBy = localStorage.getItem("currentUserName");
    if (this.objProductionPlaning.updateDate !== undefined) {
      objdata.updateDate = this.objProductionPlaning.updateDate;
    }

    console.log("getdata");
    console.log(JSON.stringify(objdata));
    console.log(objdata);

    return objdata;
  }

  async setSelectArticle() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllFG)
      this.arrobjFG = <IProduct[]>data;
    } catch (error) {
      throw error;
    }
  }


 async setOpenProductionOrder() {
    this.brokerAPIService.get(this.UrlAPI_GetListOpenProductionOrderNo).subscribe(data => {
      // this.bb = <IProductionOrder[]>data.sort(function (a, b) {
      //   return b.productionOrderNo - a.productionOrderNo;
      // });
      this.allOpenProductionOrder = <IProductionOrder[]>data.sort((a, b) => {
        if (a.productionOrderNo > b.productionOrderNo) return -1;
        else if (a.productionOrderNo < b.productionOrderNo) return 1;
        else return 0;
      });
      // this.allOpenProductionOrder = <IProductionOrder[]>this.bb;
      this.filteredOpenProductionOrder = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });
  }

  // async setOpenProductionOrder() {
  //   try {
  //     let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetListOpenProductionOrderNo);
      
  //     this.allOpenProductionOrder = <IProductionOrder[]>data;
  //     this.filteredOpenProductionOrder = this.myControl.valueChanges.pipe(
  //       startWith(""),
  //       map(value => this._filter(value))
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  //   // asyncsubscribe(data => {
  //   //   this.allOpenProductionOrder = <IProductionOrder[]>data;

  //   //   this.filteredOpenProductionOrder = this.myControl.valueChanges.pipe(
  //   //     startWith(""),
  //   //     map(value => this._filter(value))
  //   //   );
  //   // });
  // }

  private _filter(value: string): any[] {
    console.log("_filter" + value);

    try {
      const filterValue = value.toLowerCase();
      //console.log(this.allOpenProductionOrder.filter(option => option.productionOrderNo.toLowerCase().includes(filterValue)));
      let objOpenProductionOrder = this.allOpenProductionOrder.filter(option =>
        option.productionOrderNo.toLowerCase().includes(filterValue)
      );

      if (objOpenProductionOrder.length == 1) {
        this.deliveryDate = objOpenProductionOrder[0].deliveryDate;
        this.setProduct(objOpenProductionOrder[0].id);

        this.objProcessID_PR = {};
      } else {
        if (!this.ProductionOrderNoReadOnly) {
          this.arrobjProduct = [];
          this.ProductID = undefined;

          this.arrobjLotNo = [];
          this.LotNo = "0";

          this.arrobjProcessPR = [];
          this.ProcessID_PR = undefined;

          this.objProcessID_PR = {};
        }
        // console.log(this.ProductID);
      }

      return this.allOpenProductionOrder.filter(option =>
        option.productionOrderNo.toLowerCase().includes(filterValue)
      );
    } catch (error) {
      throw error;
    }

  }

  async setSelectShift() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllShift);
      this.arrobjShift = <IShiftSchdule[]>data.sort(function (a, b) {
        return a.shiftNo - b.shiftNo;
      });
      if (this.RowID == "new") {
        this.objProductionPlaning.shiftId = +localStorage.getItem("shiftID");
      }
    } catch (error) {
      
      throw error;
    }
  }

  ShiftChange(data) {
    try {
      this.objProductionPlaning.shift = this.arrobjShift.find(x => x.id === data);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  async setSelectTeam() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllTeam);
      this.arrobjTeam = <ITeam[]>data.sort(function (a, b) {
        return a.id - b.id;
      });
    } catch (error) {
      throw error;
    }
  }

  TeamChange(data) {
    try {
      this.objProductionPlaning.wokingTeam = this.arrobjTeam.find(x => x.id === data);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  async setSelectNR() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllNR);
      this.arrobjProcessNR = <IProcessLot[]>data;
    } catch (error) {
      throw error;
    }
  }

  dtpplanDate_Change() {
    console.log("dtpplanDate_Change");
    console.log("dtpplanDate_Change", this.deliveryDate);

    if (this.deliveryDate != undefined) {
      if (this.planDate >= moment(this.deliveryDate)) {
        console.log("this.planDate >= this.deliveryDate");
        this.dialogRef = this.dialog.open(MessageDialogComponent, {
          width: "300px",
          height: "200px",
          data: {
            Messagetype: "Error",
            Messagetitle: "Validation",
            Messagebody:
              "Delivery Date :" + moment(this.deliveryDate).format("DD/MM/YYYY")
          },
          disableClose: true
        });

        if (moment(this.objProductionPlaning.planDate) != undefined) {
          this.planDate = moment(this.objProductionPlaning.planDate);
        } else {
          this.planDate = moment();
        }
      }
    }
  }

  async ddlProduct_Change() {
    this.dialogService.showLoader();
    try {
      await this.getAPIGetOrderHistory(this.ProductionOrderNo, this.ProductID);
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetLotByOrderNo + this.ProductionOrderNo + "," + this.ProductID);
      this.arrobjLotNo = [];
      console.log("ddlProduct_Change data", data);
      data.forEach(element => {
        let objlot: any = {};
        objlot.id = element;
        this.arrobjLotNo.push(objlot);
      });
      await this.ddlLotNo_Change();
      await this.getAPIGetOrderQtySummary();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async getAPIGetOrderQtySummary() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetOrderQtySummary + this.ProductionOrderNo + "," + this.ProductID);
      console.log("getAPIGetOrderQtySummary", data);

      this.totalOrder = data.totalOrder;
      this.totalPlan = data.totalPlan;
      this.totalWIP = data.totalWIP;
      this.totalFG = data.totalFG;

    } catch (error) {
      throw error;
    }
  }

  async getAPIGetOrderHistory(ProductionOrderNo: string, ProductID: number) {
    try {
      // console.log("data", (this.UrlAPI_GetOrderHistory + ProductionOrderNo + "," + ProductID));
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetOrderHistory + ProductionOrderNo + "," + ProductID);
      console.log("getAPIGetOrderHistory", data);
      this.objOrderHistory = data;
      this.dataSource.data = this.objOrderHistory;
    } catch (error) {
      throw error;
    }

  }

  async ddlLotNo_Change() {
    // console.log(this.UrlAPI_GetGetProcessByProduct + this.ProductionOrderNo +","+this.ProductID+","+ String(id));
    this.dialogService.showLoader();
    try {
      if (
        this.ProductionOrderNo != undefined &&
        this.ProductID != undefined &&
        this.LotNo != undefined
      ) {
        await this.getAPIPreviousOrderRollNo(this.ProductionOrderNo, this.ProductID, this.LotNo);
        let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetProcessByLot + this.ProductionOrderNo + "," + this.ProductID + "," + String(this.LotNo));
        this.objProcessID_PR = <IProcessLot[]>data;
        this.ProcessID_PR = this.objProcessID_PR.id;
        await this.setStandard(this.ProcessID_PR);
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async getAPIPreviousOrderRollNo(ProductionOrderNo: string, ProductID: number, LotNo: string) {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPIGetPreviousOrderRollNo + ProductionOrderNo + "," + ProductID + "," + LotNo);
      // console.log("getAPIPreviousOrderRollNo", data);

      if (data != null) {
        this.RollNo_OrderNo = String(data.data);
      } else {
        this.RollNo_OrderNo = "";
      }
    } catch (error) {
      console.log("getAPIPreviousOrderRollNo : error", error);
      throw error;
    }
  }

  async setProductNP() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetNP);
      this.objProductNP = <IProduct>data;
    } catch (error) {
      throw error;
    }
  }

  async setProduct(id: number) {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionOrder + String(id));
      let objProductionOrder = <IProductionOrder>data;
      for (let i = 0; i < objProductionOrder.orderItems.length; i++) {
        this.arrobjProduct[i] = objProductionOrder.orderItems[i].product;
      }
    } catch (error) {
      throw error;
    }
  }

  async setStandard(ProcessID: number) {
    try {
      let dataMachine = await this.brokerAPIService.getAwait(this.UrlAPI_Machine_GetAllActive);
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetStandardList + dataMachine[0].id + "," + String(ProcessID));
      this.objarrStandard = data;
      if (data != null) {
        this.StandardID = this.objarrStandard[0].id;
      }
    } catch (error) {
      throw error;
    }
  }

  async  setProductEdit(id: number, ProductID: number, ProcessID_PR: number) {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionOrder + String(id));
      let objProductionOrder = <IProductionOrder>data;
      for (let i = 0; i < objProductionOrder.orderItems.length; i++) {
        this.arrobjProduct[i] = objProductionOrder.orderItems[i].product;
      }
      this.setSelectPREdit(ProductID, ProcessID_PR);

    } catch (error) {
      throw error;
    }


  }

  async setSelectPREdit(ProductID: number, ProcessID_PR: number) {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetGetProcessByProduct + String(ProductID));
      this.arrobjProcessPR = <IProcessLot[]>data;
      this.ProcessID_PR = ProcessID_PR;
      this.changeProcess(ProcessID_PR);
    } catch (error) {
      throw error;
    }

  }

  changeProcess(id: number) {
    try {
      let objProcess = this.arrobjProcessPR.filter(option => option.id == id);
      if (objProcess.length == 1) {
        this.defaultStandard = objProcess[0].defaultStandard;
      }
    } catch (error) {
      throw error;
    }

  }

  caltime() {
    //  console.log("planQty",this.planQty);

    if (this.objProductionPlaning.planType == "PR") {
      if (this.planQty != undefined && this.objarrStandard != undefined) {
        let objStandard = this.objarrStandard.find(x => (x.id = this.StandardID));
        let runningSpeed =  objStandard.runningSpeed / 1000;
        console.log("runningSpeed", runningSpeed);
        let timeinprocess = this.planQty / runningSpeed;
        // console.log("caltime", this.getPlanStartTime());
        // console.log("caltime",this.getPlanStartTime());
        if (this.planStartTime != null && this.planStartTime != "") {
        let datefinish = moment(this.getPlanStartTime()).add(timeinprocess, "m").toDate();
        this.planFinishTime =("0" + datefinish.getHours()).slice(-2) + ":" + ("0" + datefinish.getMinutes()).slice(-2);
        }
        // console.log("caltime", this.planFinishTime);
      }
    } else if (this.objProductionPlaning.planType == "NR") {

      if (this.arrobjProcessNR != undefined && this.planStartTime != undefined ) {

        let objNRProcess = this.arrobjProcessNR.find( x => (x.id == this.ProcessID_NR));

        let datefinish = moment(this.getPlanStartTime()).add(objNRProcess.machineRunningSpeed, "m").toDate();
        this.planFinishTime = ("0" + datefinish.getHours()).slice(-2) + ":" + ("0" + datefinish.getMinutes()).slice(-2);
      }
    }

    if(this.planStartTime == "")
    {
      this.planFinishTime = "";
    }

  }

  
  btnplanview(): void {
    const dialogRef = this.dialog.open(ProductionPlaningViewComponent, {
      // data:this.objReedeem = <Promotion>id,
      // data: this.planView,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { FilterPlan: this.FilterPlan }]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (obj, property) =>
      this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);

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

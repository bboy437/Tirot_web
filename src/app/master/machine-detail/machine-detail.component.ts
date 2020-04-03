import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { Sensor } from "../../interfaces/productionrecords";
import {
  IMachine,
  IOperationInstruction
} from "../../interfaces/productionrecords";
import { ArticleDialogComponent } from "../article-detail/dialogs/article-dialog/article-dialog.component";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";

import {
  MatDialog,
  MatSnackBar,
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { MachineDialogComponent } from "./machine-dialog/machine-dialog.component";
import { DialogService } from "../../services/dialog.service";
@Component({
  selector: "app-machine-detail",
  templateUrl: "./machine-detail.component.html",
  styleUrls: ["./machine-detail.component.scss"]
})
export class MachineDetailComponent implements OnInit {
  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) { }

  dataSource = new MatTableDataSource();
  displayedColumns = [
    "sensorName",
    "sensorLocation",
    "sensorGroupName",
    "sensorValueUnitName",
    "actions"
  ];

  version = VERSION;

  //Props
  private props: any;
  private RowID: string;
  filter: string;

  arrobjGetAllActive: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  objSensor: any = {};
  private UrlAPI_GetSingleRow: string = "Machine/Get/";
  private UrlAPI_Update: string = "Machine/Update";
  private UrlAPI_Create: string = "Machine/Create";
  private Url_Listing: string = "/auth/master/machine-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  dialogRefMachine: MatDialogRef<MachineDialogComponent>;
  // dialogRefArticle: MatDialogRef<ArticleDialogComponent>;

  objRowSelected: any;

  @ViewChild("fileInput")
  fileInput;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //URL
  private URL_Sensor_detail: string = "/auth/master/sensor-detail";

  async ngOnInit() {
    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      //Check before process
      if (!params.has("props")) {
        console.log("Params null");
        return;
      }
      //Process
      this.props = JSON.parse(params.get("props"));
      this.RowID = this.props.machineId;
      this.filter = this.props.filter;

      if (this.RowID == "new") {
      } else {
        let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
        this.objRow = <IMachine>data;
        this.dataSource.data = this.objRow.sensors;
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();

  }

  addNew() {
    // console.log("rowClicked",row);
    this.props.sensorId = "new";
    this.router.navigate([
      this.URL_Sensor_detail,
      { props: JSON.stringify(this.props) }
    ]);
  }

  rowClicked(row: any): void {
    // console.log("rowClicked",row);
    this.objRowSelected = <any>row;

    this.props.sensorId = this.objRowSelected.id;
    this.router.navigate([
      this.URL_Sensor_detail,
      { props: JSON.stringify(this.props) }
    ]);
  }

  btnSaveClick() {
    if (this.validate()) {
      this.save();
    }
  }

  // uploadfile(fi: any): Observable<string> {
  //   let strUrl: string = "";
  //   if (fi.files && fi.files[0]) {
  //     let fileToUpload = fi.files[0];
  //     this.brokerAPIService
  //       .upload("Utility/UploadFile", fileToUpload)
  //       .subscribe(
  //         data => {
  //           this.objAPIResponse = <IAPIResponse>data;
  //           if (this.objAPIResponse.success) {
  //             strUrl = this.objAPIResponse.data;
  //           } else {
  //             console.log(
  //               "this.objAPIResponse.success :" + this.objAPIResponse.success
  //             );
  //             strUrl = "error";
  //           }
  //         },
  //         err => {
  //           // กรณี error
  //           console.log("Something went wrong!");
  //           strUrl = "error";
  //         }
  //       );
  //   }

  //   return Observable.of(strUrl);
  // }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { props: JSON.stringify(this.props) }]);
  }
//code เดิม
  // save() {
  //   if (this.RowID == "new") {
  //     //Create

  //     this.objRow.createBy = "admin";
  //     this.objRow.updateBy = "admin";

  //     this.brokerAPIService.post(this.UrlAPI_Create, this.objRow).subscribe(
  //       data => {
  //         this.objAPIResponse = <IAPIResponse>data;
  //         if (this.objAPIResponse.success) {
  //           this.showSnackBar("Save Complete");
  //           this.router.navigate([this.Url_Listing]);
  //         } else {
  //           console.log(
  //             "this.objAPIResponse.success :" + this.objAPIResponse.success
  //           );
  //         }
  //       },
  //       err => {
  //         // กรณี error
  //         console.log("Something went wrong!");
  //       }
  //     );
  //   } else {
  //     //Update
  //     this.brokerAPIService
  //       .post(this.UrlAPI_Update, <IMachine>this.objRow)
  //       .subscribe(
  //         data => {
  //           this.objAPIResponse = <IAPIResponse>data;
  //           if (this.objAPIResponse.success) {
  //             this.showSnackBar("Save Complete");
  //             this.router.navigate([this.Url_Listing]);
  //           } else {
  //             console.log(
  //               "this.objAPIResponse.success :" + this.objAPIResponse.success
  //             );
  //           }
  //         },
  //         err => {
  //           // กรณี error
  //           console.log("Something went wrong!");
  //         }
  //       );
  //   }
  // }


  
  async save() {
    this.dialogService.showLoader();
    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");

        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, this.objRow);
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { filter: this.filter }]);
        } else {
          this.dialogService.showDialog(
            "error",
            "Error",
            this.objAPIResponse.message
          );
        }
      } else {
        //Update
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IMachine>this.objRow);
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.dialogService.showSnackBar("Save Complete");
              this.router.navigate([this.Url_Listing, { filter: this.filter }]);
            }
            else {
              this.dialogService.showDialog(
                "error",
                "Error",
                this.objAPIResponse.message
              );
            }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();

  }

  validate() {
    console.log(this.objRow.machineName);
    let strValidate: string = "";

    if (this.objRow.machineName == undefined || this.objRow.machineName == "") {
      strValidate = "Machine Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (
      this.objRow.machineModel == undefined ||
      this.objRow.machineModel == ""
    ) {
      strValidate = "Machine Model";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (
      this.objRow.machineLocation == undefined ||
      this.objRow.machineLocation == ""
    ) {
      strValidate = "Machine Location";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.objRow.Sensor == undefined || this.objRow.Sensor == "") {
      strValidate = "Please data in the table";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }

  // addNew() {
  //   const dialogRefMachine = this.dialog.open(ArticleDialogComponent,
  //     {
  //     // data: this.getOderNo(),
  //     disableClose: true
  //   });

  //   dialogRefMachine.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       if (result.orderNo != undefined) {
  //         if (this.objRow.sensors == undefined) {
  //           this.objRow.Sensor = <Sensor[]>[];
  //           this.objRow.Sensor[0] = result;
  //         } else {
  //           this.objRow.Sensor.push(result);
  //         }
  //         this.dataSource.data = this.objRow.Sensor;
  //       }
  //     }
  //   });
  // }

  // private bindoperationInstructionDataSource() {
  //   this.dataSource.data = this.objRow.Sensor.sort(function(a, b){return a.orderNo - b.orderNo;});
  // }

  startEdit(id: number) {
    this.objSensor = this.objRow.Sensor.find(x => x.id === id);
    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);

    this.dialogRefMachine = this.dialog.open(MachineDialogComponent, {
      data: this.objSensor,
      disableClose: true
    });

    this.dialogRefMachine.afterClosed().subscribe(result => {
      console.log("afterClosed Edit");
      console.log(result);
      if (result != undefined) {
        // if (result.process != undefined) {
        // }
      }
      // this.bindoperationInstructionDataSource();
    });

    // this.dialogRefArticle.afterClosed().subscribe(result => {
    //   // console.log("afterClosed Edit");
    //   // console.log(result);
    //   if (result != undefined) {
    //     if (result.process != undefined) {
    //     }
    //   }

    //   this.dataSource.data = this.objRow.operationInstruction;
    // });
  }

  deleteItem(index: number, id: number) {
    const dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
      // data: {id: id, title: title, state: state, url: url}
      disableClose: true
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        console.log(id);
        // const foundIndex = this.objoperationInstruction.findIndex(x => x.id === id);
        // console.log(foundIndex);
        // for delete we use splice in order to remove single object from DataService
        this.objSensor = this.objRow.Sensor.find(x => x.id === id);
        this.objRow.Sensor = this.objRow.Sensor.filter(
          obj => obj !== this.objSensor
        );
        //delete this.objRow.operationInstruction[index];
        // console.log(this.objRow);
        // this.dataSource.data = this.objRow.operationInstruction;
        // this.bindoperationInstructionDataSource();
      }
    });
  }

  // getdata() {
  //   let objdata: any = {};
  //   if (this.objRow.id !== undefined) {
  //     objdata.id = this.objRow.id;
  //   }

  //   if (this.objRow.machineName !== undefined) {
  //     objdata.machineName = this.objRow.machineName;
  //   }

  //   let objFG : any = {};
  //   objFG = this.arrobjGetAllActive.filter(obj => obj.id === this.objRow.useForProductId);
  //   console.log("objGetAll");
  //   console.log(this.objSensor[0]);
  //   if (objFG[0].productName !== undefined) {
  //     objdata.articleName = objFG[0].productName;
  //   }

  //   objdata.useForProductId = this.objRow.useForProductId;

  //   objdata.createBy = this.objRow.createBy;
  //   if (this.objRow.createDate !== undefined) {
  //     objdata.createDate = this.objRow.createDate;
  //   }
  //   objdata.updateBy = this.objRow.updateBy;
  //   if (this.objRow.updateDate !== undefined) {
  //     objdata.updateDate = this.objRow.updateDate;
  //   }

  //   objdata.inActivated = this.objRow.inActivated;

  //   let dataSensor: any = [];
  //   let i: number = 0;
  //   this.objRow.Sensor.forEach(element => {
  //     console.log(element);
  //     dataSensor[i] = {};
  //     if (element.id !== undefined && element.id !== null) {
  //       dataSensor[i].id = element.id;
  //     }
  //     dataSensor[i].orderNo = element.orderNo;
  //     dataSensor[i].processId = element.process.id;
  //     dataSensor[i].rawmaterialName = element.rawmaterialName;
  //     dataSensor[i].productId = element.product.id;
  //     if (element.usingStandard !== undefined && element.usingStandard !== null) {
  //       dataSensor[i].usingStandard = element.usingStandard;
  //     }
  //     dataSensor[i].createBy = element.createBy;
  //     if (element.createDate !== undefined) {
  //       dataSensor[i].createDate = element.createDate;
  //     }
  //     dataSensor[i].updateBy = element.updateBy;
  //     if (element.updateDate !== undefined) {
  //       dataSensor[i].updateDate = element.updateDate;
  //     }

  //     i++;
  //   });
  //   objdata.Sensor = dataSensor;

  //   console.log("getdata");
  //   console.log(objdata);
  //   return objdata;
  // }

  // addNew() {
  //   const dialogRefArticle = this.dialog.open(ArticleDialogComponent,
  //     {
  //     disableClose: true
  //   });

  //   dialogRefArticle.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       if (result.orderNo != undefined) {
  //         if (this.objRow.Sensor == undefined) {
  //           this.objRow.Sensor = <Sensor[]>[];
  //           this.objRow.Sensor[0] = result;
  //         } else {
  //           this.objRow.Sensor.push(result);
  //         }
  //         this.dataSource.data = this.objRow.Sensor;
  //       }
  //     }
  //   });
  // }

  // setSelectMachine() {
  //   this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(data => {
  //     this.arrobjGetAllActive = <Sensor[]>data;
  //    // console.log(this.arrobjFG);
  //   });
  // }

  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (obj, property) =>
      this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);


}

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IProduct } from "../../interfaces/productionrecords";
import {
  IArticle,
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
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"]
})
export class ArticleDetailComponent implements OnInit, AfterViewInit {
  version = VERSION;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  dialogRefArticle: MatDialogRef<ArticleDialogComponent>;
  filter: string;

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
    "orderNo",
    "rawmaterialName",
    "process.processName",
    "product.productName",
    // "process.defaultStandard",
    "actions"
  ];

  private RowID: string;
  arrobjFG: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  objoperationInstruction: any = {};

  private intDelID: number;
  private UrlAPI_GetSingleRow: string = "Article/Get/";
  private UrlAPI_Update: string = "Article/Update";
  private UrlAPI_Create: string = "Article/Create";
  private UrlAPI_GetAllFG: string = "Product/GetAllFG";
  private Url_Listing: string = "/auth/master/article-listing";

  @ViewChild("MatPaginatorArticle") paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("fileInput") fileInput;

  async ngOnInit() {
    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        console.log(params.get("id"));
        this.RowID = params.get("id");
        this.filter = params.get("filter");

        if (this.RowID == "new") {
          this.objRow.useForProductId = null;
        } else {
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID)
          this.objRow = <IArticle>data;
          this.dataSource.data = this.objRow.operationInstruction;
        }
      }
      await this.setSelectArticle();

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async setSelectArticle() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllFG)
      this.arrobjFG = <IProduct[]>data;
    } catch (error) {
      throw error
    }
  }

  btnSaveClick() {
    if (this.validate()) {
      this.save();
    }
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
    this.dialogService.showLoader();
    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");
        this.objRow.inActivated = false;

        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, this.getdata());
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
      let data:any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, this.getdata());
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
    console.log(this.objRow.useForProductId);
    let strValidate: string = "";

    if (
      this.objRow.useForProductId == undefined ||
      this.objRow.useForProductId == ""
    ) {
      strValidate = "Article Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (
      this.objRow.operationInstruction == undefined ||
      this.objRow.operationInstruction == ""
    ) {
      strValidate = "Please data in the table";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }
  getdata() {
    let objdata: any = {};
    if (this.objRow.id !== undefined) {
      objdata.id = this.objRow.id;
    }

    if (this.objRow.articleName !== undefined) {
      objdata.articleName = this.objRow.articleName;
    }

    let objFG: any = {};
    objFG = this.arrobjFG.filter(obj => obj.id === this.objRow.useForProductId);
    console.log("objFG");
    console.log(objFG[0]);
    if (objFG[0].productName !== undefined) {
      objdata.articleName = objFG[0].productName;
    }

    objdata.useForProductId = this.objRow.useForProductId;

    objdata.createBy = this.objRow.createBy;
    if (this.objRow.createDate !== undefined) {
      objdata.createDate = this.objRow.createDate;
    }
    objdata.updateBy = this.objRow.updateBy;
    if (this.objRow.updateDate !== undefined) {
      objdata.updateDate = this.objRow.updateDate;
    }

    objdata.inActivated = this.objRow.inActivated;

    let dataOperationInstruction: any = [];
    let i: number = 0;
    this.objRow.operationInstruction.forEach(element => {
      console.log(element);
      dataOperationInstruction[i] = {};
      if (element.id !== undefined && element.id !== null) {
        dataOperationInstruction[i].id = element.id;
      }
      dataOperationInstruction[i].orderNo = element.orderNo;
      dataOperationInstruction[i].processId = element.process.id;
      dataOperationInstruction[i].rawmaterialName = element.rawmaterialName;
      dataOperationInstruction[i].productId = element.product.id;
      if (
        element.usingStandard !== undefined &&
        element.usingStandard !== null
      ) {
        dataOperationInstruction[i].usingStandard = element.usingStandard;
      }
      dataOperationInstruction[i].createBy = element.createBy;
      if (element.createDate !== undefined) {
        dataOperationInstruction[i].createDate = element.createDate;
      }
      dataOperationInstruction[i].updateBy = element.updateBy;
      if (element.updateDate !== undefined) {
        dataOperationInstruction[i].updateDate = element.updateDate;
      }

      i++;
    });
    objdata.operationInstruction = dataOperationInstruction;

    console.log("getdata");
    console.log(objdata);
    return objdata;
  }

  addNew() {
    const dialogRefArticle = this.dialog.open(ArticleDialogComponent, {
      data: this.getOderNo(),
      disableClose: true
    });

    dialogRefArticle.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.orderNo != undefined) {
          if (this.objRow.operationInstruction == undefined) {
            this.objRow.operationInstruction = <IOperationInstruction[]>[];
            this.objRow.operationInstruction[0] = result;
          } else {
            this.objRow.operationInstruction.push(result);
          }
          this.dataSource.data = this.objRow.operationInstruction;
        }
      }
    });
  }

  private getOderNo() {
    console.log(this.objRow.operationInstruction);
    console.log("this.objRow.length");
    let objInstructionoperation: any = {};
    objInstructionoperation.id = 0;

    if (this.objRow.operationInstruction != undefined) {
      if (this.objRow.operationInstruction.length > 0) {
        objInstructionoperation.orderNo =
          this.objRow.operationInstruction[
            this.objRow.operationInstruction.length - 1
          ].orderNo + 1;
      } else {
        objInstructionoperation.orderNo = 1;
      }
    } else {
      objInstructionoperation.orderNo = 1;
    }

    return objInstructionoperation;
  }

  private bindoperationInstructionDataSource() {
    this.dataSource.data = this.objRow.operationInstruction.sort(function (
      a,
      b
    ) {
      return a.orderNo - b.orderNo;
    });
  }

  startEdit(id: number) {
    this.objoperationInstruction = this.objRow.operationInstruction.find(
      x => x.id === id
    );
    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);

    this.dialogRefArticle = this.dialog.open(ArticleDialogComponent, {
      data: this.objoperationInstruction,
      disableClose: true
    });

    this.dialogRefArticle.afterClosed().subscribe(result => {
      console.log("afterClosed Edit");
      console.log(result);
      if (result != undefined) {
        // if (result.process != undefined) {
        // }
      }
      this.bindoperationInstructionDataSource();
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
        this.objoperationInstruction = this.objRow.operationInstruction.find(
          x => x.id === id
        );
        this.objRow.operationInstruction = this.objRow.operationInstruction
          .filter(obj => obj !== this.objoperationInstruction)
          .map((obj, idx) => ((obj.orderNo = idx + 1), obj));
        //delete this.objRow.operationInstruction[index];
        // console.log(this.objRow);
        // this.dataSource.data = this.objRow.operationInstruction;
        this.bindoperationInstructionDataSource();
      }
    });
  }



  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { filter: this.filter }]);
  }

  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (obj, property) =>
      this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);

  
}

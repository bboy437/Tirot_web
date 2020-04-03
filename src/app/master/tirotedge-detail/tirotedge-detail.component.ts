import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ITirotEdge } from "../../interfaces/productionrecords";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";

import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  VERSION,
  MatSnackBar
} from "@angular/material";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-tirotedge-detail",
  templateUrl: "./tirotedge-detail.component.html",
  styleUrls: ["./tirotedge-detail.component.scss"]
})
export class TirotedgeDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "TirotEdge/Get/";
  private UrlAPI_Update: string = "TirotEdge/Update";
  private UrlAPI_Create: string = "TirotEdge/Create";
  private Url_Listing: string = "/auth/master/tirotedge-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    this.dialogService.showLoader();

    try {
      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        console.log(params.get("id"));
        this.RowID = params.get("id");

        this.filter = params.get("filter");
        if (this.RowID == "new") {
        } else {
          let data: any = await this.brokerAPIService.getAwait(
            this.UrlAPI_GetSingleRow + this.RowID
          );
          this.objRow = <ITirotEdge>data;
        }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  btnSaveClick() {
    if (this.validate()) {
      this.save();
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { filter: this.filter }]);
  }

  async save() {
    this.dialogService.showLoader();

    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = "admin";
        this.objRow.updateBy = "admin";

        let data: any = await this.brokerAPIService.postAwait(
          this.UrlAPI_Create,
          this.objRow
        );

        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { filter: this.filter }]);
        } else {
          //ส่งไป แต่ข้อมูลผิดพลาด
          this.dialogService.showDialog(
            "error",
            "Error",
            this.objAPIResponse.message
          );
        }
      } else {
        //Update
        let data: any = await this.brokerAPIService.postAwait(
          this.UrlAPI_Update,
          <ITirotEdge>this.objRow
        );
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { filter: this.filter }]);
        } else {
          //ส่งไป แต่ข้อมูลผิดพลาด
          this.dialogService.showDialog(
            "error",
            "Error",
            this.objAPIResponse.message
          );
        }
      }
    } catch (error) {
      console.log("error", error);

      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  validate() {
    console.log(this.objRow.name);
    let strValidate: string = "";

    if (this.objRow.name == undefined || this.objRow.name == "") {
      strValidate = "Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (
      this.objRow.installLocation == undefined ||
      this.objRow.installLocation == ""
    ) {
      strValidate = "InstallLocation";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }
}

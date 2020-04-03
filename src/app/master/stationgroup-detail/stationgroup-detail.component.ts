import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IStationGroup } from "../../interfaces/productionrecords";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-stationgroup-detail",
  templateUrl: "./stationgroup-detail.component.html",
  styleUrls: ["./stationgroup-detail.component.scss"]
})
export class StationGroupDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "StationGroup/Get/";
  private UrlAPI_Update: string = "StationGroup/Update";
  private UrlAPI_Create: string = "StationGroup/Create";

  private Url_Listing: string = "/auth/master/stationgroup-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    this.dialogService.showLoader();

    try {
      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        this.RowID = params.get("id");
        this.filter = params.get("filter");
        if (this.RowID == "new") {
        } else {
          let data: any = await this.brokerAPIService.getAwait(
            this.UrlAPI_GetSingleRow + this.RowID
          );
          this.objRow = <IStationGroup>data;
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
        this.objRow.inActivated = false;

        let data: any = await this.brokerAPIService.postAwait(
          this.UrlAPI_Create,
          this.objRow
        );
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
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
          <IStationGroup>this.objRow
        );

        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
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
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  validate() {
    console.log(this.objRow.stationGroupName);
    let strValidate: string = "";

    if (
      this.objRow.stationGroupName == undefined ||
      this.objRow.stationGroupName == ""
    ) {
      strValidate = "Station Group Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }
}

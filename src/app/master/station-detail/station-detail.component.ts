import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IStation } from "../../interfaces/productionrecords";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { LogLevel } from "@aspnet/signalr";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-station-detail",
  templateUrl: "./station-detail.component.html",
  styleUrls: ["./station-detail.component.scss"]
})
export class StationDetailComponent implements OnInit {
  version = VERSION;

  private RowID: string;
  StationGroupID: number;
  MachineID: number;
  objRow: any = {};
  objAPIResponse: any = {};
  objStationGroup: any = [];
  objMachine: any = [];

  private UrlAPI_GetSingleRow: string = "Station/Get/";
  private UrlAPI_Update: string = "Station/Update";
  private UrlAPI_Create: string = "Station/Create";

  private UrlAPI_GetAllStationGroup: string = "StationGroup/GetAll";
  private UrlAPI_GetListMachine: string = "Station/GetListMachine";
  private Url_Listing: string = "/auth/master/station-listing";

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
    console.log("Loading ====================");

    try {
      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        console.log(params.get("id"));
        this.RowID = params.get("id");
        this.filter = params.get("filter");

        this.objStationGroup = await this.brokerAPIService.getAwait(
          this.UrlAPI_GetAllStationGroup
        );
        this.objMachine = await this.brokerAPIService.getAwait(
          this.UrlAPI_GetListMachine
        );

        if (this.RowID == "new") {
          this.objRow.inStationGroup = {};
          this.objRow.inMachine = {};
        } else {
          let data: any = await this.brokerAPIService.getAwait(
            this.UrlAPI_GetSingleRow + this.RowID
          );
          this.objRow = <IStation>data;
          this.StationGroupID = this.objRow.stationGroupId;
          this.MachineID = this.objRow.machineId;
        }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    console.log("hideLoader ====================");
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
        this.objRow.stationGroupId = this.StationGroupID;
        this.objRow.machineId = this.MachineID;

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
        // console.log("UrlAPI_Update");
        console.log(<IStation>this.objRow);

        let arrobjStationGroupfilter: any = [];
        arrobjStationGroupfilter = this.objStationGroup.filter(
          obj => obj.id === this.StationGroupID
        );
        if (arrobjStationGroupfilter.length == 1) {
          this.objRow.inStationGroup = arrobjStationGroupfilter[0];
        }

        let arrobjmachinefilter: any = [];
        arrobjmachinefilter = this.objStationGroup.filter(
          obj => obj.id === this.MachineID
        );
        if (arrobjmachinefilter.length == 1) {
          this.objRow.inMachine = arrobjmachinefilter[0];
        }

        let data: any = await this.brokerAPIService.postAwait(
          this.UrlAPI_Update,
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
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  validate() {
    console.log(this.objRow.stationName);
    let strValidate: string = "";

    if (this.objRow.stationName == undefined || this.objRow.stationName == "") {
      strValidate = "Station Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }
}

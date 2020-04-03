import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ISysRole } from "../../interfaces/productionrecords";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-sysrole-detail",
  templateUrl: "./sysrole-detail.component.html",
  styleUrls: ["./sysrole-detail.component.scss"]
})
export class SysRoleDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;

  RolesLevel: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "SysRole/Get/";
  private UrlAPI_Update: string = "SysRole/Update";
  private UrlAPI_Create: string = "SysRole/Create";

  private Url_Listing: string = "/auth/master/sysrole-listing";
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
        console.log(params.get("id"));
        this.RowID = params.get("id");
        this.filter = params.get("filter");

        if (this.RowID == "new") {
        } else {
          let data: any = await this.brokerAPIService.getAwait(
            this.UrlAPI_GetSingleRow + this.RowID
          );
          this.objRow = <ISysRole>data;
          this.RolesLevel = String(this.objRow.rolesLevel);
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
      this.objRow.rolesLevel = this.RolesLevel;
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
          <ISysRole>this.objRow
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
    console.log(this.objRow.rolesName);
    let strValidate: string = "";

    if (this.objRow.rolesName == undefined || this.objRow.rolesName == "") {
      strValidate = "Roles Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }
}

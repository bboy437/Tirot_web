import { DialogService } from "./../../services/dialog.service";
import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IGrade } from "../../interfaces/productionrecords";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Validate } from "../../librarys/Validate";

@Component({
  selector: "app-grade-detail",
  templateUrl: "./grade-detail.component.html",
  styleUrls: ["./grade-detail.component.scss"]
})
export class GradeDetailComponent implements OnInit {
  version = VERSION;

  private RowID: string;

  objValidate: Validate;

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Grade/Get/";
  private UrlAPI_Update: string = "Grade/Update";
  private UrlAPI_Create: string = "Grade/Create";

  private Url_Listing: string = "/auth/master/grade-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

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
          let data = await this.brokerAPIService.getAwait(
            this.UrlAPI_GetSingleRow + this.RowID
          );
          this.objRow = <IGrade>data;
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
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");
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
          <IGrade>this.objRow
        );
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
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  validate() {
    console.log(this.objRow.gradeName);
    let strValidate: string = "";

    if (this.objRow.gradeName == undefined || this.objRow.gradeName == "") {
      strValidate = "Grade Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }

  //ตัวอย่างโหลด
  async GetExample() {
    this.dialogService.showLoader();

    try {
      let data: any = await this.brokerAPIService.getAwait("UrlGet");
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  //ตัวอย่าง Post
  async PostExample() {
    this.dialogService.showLoader();

    try {
      //Validate
      let objResultValidate: any = this.objValidate.requireField(this.objRow, [
        "sensorName"
      ]);
      console.log(objResultValidate);

      let data: any = await this.brokerAPIService.postAwait("url", this.objRow);
      //this.objAPIResponse = <IAPIResponse>data;

      if (data.success == true) {
        //ถูกต้องสมบูรณ์
        this.dialogService.showSnackBar("Save Complete");
      } else {
        //ส่งไป แต่ข้อมูลผิดพลาด
        this.dialogService.showDialog(
          "error",
          "Error",
          this.objAPIResponse.message
        );
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }
}

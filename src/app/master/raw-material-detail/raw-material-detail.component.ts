import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IRawMaterial } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-raw-material-detail",
  templateUrl: "./raw-material-detail.component.html",
  styleUrls: ["./raw-material-detail.component.scss"]
})
export class RawMaterialDetailComponent implements OnInit {

  version = VERSION;
  private RowID: string;
  isLoadingResults = true;

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "RawMaterial/Get/";
  private UrlAPI_Update: string = "RawMaterial/Update";
  private UrlAPI_Create: string = "RawMaterial/Create";

  private Url_Listing: string = "/auth/master/raw-material-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter:string;
  rawMaterialType = "FB";
  disable :boolean = false;

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
          this.disable = true;
        } else {
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objRow = <IRawMaterial>data;
          this.disable = true;
          console.log(this.objRow);
        }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  btnSaveClick() {
    if(this.validate()){
      this.save();
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing,{ filter: this.filter }]);
  }


  async save() {

    this.dialogService.showLoader();
    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");
        this.objRow.inActivated = false;
        this.objRow.rawMaterialType = this.rawMaterialType;

        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, this.objRow)
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
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IRawMaterial>this.objRow)
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
    console.log(this.objRow.rawMaterialCode);
    let strValidate: string = "";

    if (
      this.objRow.rawMaterialCode == undefined ||
      this.objRow.rawMaterialCode == ""
    ) {
      strValidate = "Material Code";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } 
    if (
      this.objRow.rawMaterialName == undefined ||
      this.objRow.rawMaterialName == ""
    ) {
      strValidate = "Material Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } 
    // if (
    //   this.rawMaterialType == undefined ||
    //   this.rawMaterialType == ""
    // ) {
    //   strValidate = "Material Type";
    // }

    // if (strValidate != "") {
    //   this.dialogService.showDialog("error", "Error", strValidate);
    //   return false;
    // }
    else {
      return true;
    }

  }

  
}

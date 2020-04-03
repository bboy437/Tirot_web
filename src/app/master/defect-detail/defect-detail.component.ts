import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IDefect } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-defect-detail',
  templateUrl: './defect-detail.component.html',
  styleUrls: ['./defect-detail.component.scss']
})
export class DefectDetailComponent implements OnInit {

  version = VERSION;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Defect/Get/";
  private UrlAPI_Update: string = "Defect/Update";
  private UrlAPI_Create: string = "Defect/Create";
  private Url_Listing: string = "/auth/master/defect-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;


  constructor(private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) { }

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
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objRow = <IDefect>data;
          console.log(this.objRow);
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
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IDefect>this.objRow)
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
    console.log(this.objRow.defectCode);
    let strValidate: string = "";

    if (this.objRow.defectCode == undefined || this.objRow.defectCode == "") {
      strValidate = "Defect Code";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (
      this.objRow.defectName == undefined ||
      this.objRow.defectName == ""
    ) {
      strValidate = "Defect Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.defectNameTH == undefined || this.objRow.defectNameTH == "") {
      strValidate = "Defect Name TH";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.defectType == undefined || this.objRow.defectType == "") {
      strValidate = "Defect Type";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    else {
      return true;
    }

  }

}

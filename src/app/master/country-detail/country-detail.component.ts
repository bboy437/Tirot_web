import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ICountry } from "../../interfaces/productionrecords"
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";

import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource, MatDialogRef, VERSION, MatSnackBar,
} from "@angular/material";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {

  version = VERSION;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Country/Get/";
  private UrlAPI_Update: string = "Country/Update";
  private UrlAPI_Create: string = "Country/Create";
  private Url_Listing: string = "/auth/master/country-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

  constructor(
    private brokerAPIService: BrokerAPIService,
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
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID)
          this.objRow = <ICountry>data;
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
        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <ICountry>this.objRow)
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
    console.log(this.objRow.countryCode);
    let strValidate: string = "";

    if (this.objRow.countryCode == undefined || this.objRow.countryCode == "") {
      strValidate = "CountryCode";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objRow.countryName == undefined || this.objRow.countryName == "") {
      strValidate = "CountryName";
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

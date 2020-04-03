import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ICustomer, ICountry } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;
  CountryID: number;
  objCountry: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Customer/Get/";
  private UrlAPI_Update: string = "Customer/Update";
  private UrlAPI_Create: string = "Customer/Create";
  private UrlAPI_GetAllCountry: string = "Country/GetAll";
  private Url_Listing: string = "/auth/master/customer-listing";
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
        this.RowID = params.get("id");
        this.filter = params.get("filter");

        if (this.RowID == "new") {
        } else {
         let data =  await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
              this.objRow = <ICustomer>data;
              this.CountryID = this.objRow.countryId;
         
        }
      }

      this.objCountry = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllCountry);
      // console.log(this.objCountry);

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


  validate() {
    console.log(this.objRow.customerCode);
    let strValidate: string = "";

    if (this.objRow.customerCode == undefined || this.objRow.customerCode == "") {
      strValidate = "Customer Code";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }
    if (this.objRow.customerName == undefined || this.objRow.customerName == "") {
      strValidate = "Customer Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }
    if (this.objRow.customerShortName == undefined || this.objRow.customerShortName == "") {
      strValidate = "Short Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }
    if (this.objRow.address1 == undefined || this.objRow.address1 == "") {
      strValidate = "Address1";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }


    else {
      return true;
    }
  }

 async save() {
    this.dialogService.showLoader();
    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");
        this.objRow.inActivated = false;
        this.objRow.countryId = this.CountryID

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
        // let arrobjCountryfilter: any = [];
        // arrobjCountryfilter = this.objCountry.filter(
        //   obj => obj.id === this.CountryID
        // );
        // if (arrobjCountryfilter.length == 1) {
        //   this.objRow.inobjCountryfilter = arrobjCountryfilter[0];
        // }
        this.objRow.countryId = this.CountryID
        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <ICustomer>this.objRow)
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

}

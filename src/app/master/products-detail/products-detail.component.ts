import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";

import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";

import { IProduct } from "../../interfaces/productionrecords";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";

import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-products-detail",
  templateUrl: "./products-detail.component.html",
  styleUrls: ["./products-detail.component.scss"]
})
export class ProductsDetailComponent implements OnInit {

  public toggle: boolean;
  public rgbaText: string = '';
  public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);

  
  version = VERSION;
  private RowID: string;

  bgcolor: string;

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Product/Get/";
  private UrlAPI_Update: string = "Product/Update";
  private UrlAPI_Create: string = "Product/Create";

  private Url_Listing: string = "/auth/master/products-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter:string;
  constructor(public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);

      return this.cpService.rgbaToCmyk(rgba);
    }

    return new Cmyk(0, 0, 0, 0);
  }

  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);

    if (hsva) {
      return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    return '';
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
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objRow = <IProduct>data;
          this.bgcolor = String(this.objRow.bgColor);
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
    this.objRow.bgColor = this.bgcolor;
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
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IProduct>this.objRow)
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
    console.log(this.objRow.productCode);
    let strValidate: string = "";

    if (this.objRow.productCode == undefined || this.objRow.productCode == "") {
      strValidate = "Product Code";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
      
    }
    if (this.objRow.productName == undefined || this.objRow.productName == "") {
      strValidate = "Product Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
      
    }
    if (this.objRow.productType == undefined || this.objRow.productType == "") {
      strValidate = "Product Type";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
      
    }else {
      return true;
    }
  }


  
}

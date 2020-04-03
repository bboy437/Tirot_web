import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IShiftSchdule } from "../../interfaces/productionrecords";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-shift-schdule-detail",
  templateUrl: "./shift-schdule-detail.component.html",
  styleUrls: ["./shift-schdule-detail.component.scss"]
})
export class ShiftSchduleDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;

  ShiftHour: string;
  objRow: any = {};
  objAPIResponse: any = {};
  public maskTime = [/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/];

  private UrlAPI_GetSingleRow: string = "ShiftSchedule/Get/";
  private UrlAPI_Update: string = "ShiftSchedule/Update";
  private UrlAPI_Create: string = "ShiftSchedule/Create";
  private UrlAPI_Delete: string = "ShiftSchedule/Delete";

  private Url_Listing: string = "/auth/master/shift-schdule-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter:string;

  Starttime: string;
  Endtime: string;
  StartShiftDay: string;
  EndShiftDay: string;


  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  // ngOnInit() {

  //   let params = this.route.snapshot.paramMap;

  //   if (params.has("id")) {
  //     console.log(params.get("id"));
  //     this.RowID = params.get("id");
  //     this.filter = params.get("filter");
  //     if (this.RowID == "new") {
  //     } else {
  //       this.brokerAPIService
  //         .get(this.UrlAPI_GetSingleRow + this.RowID)
  //         .subscribe(data => {
  //           this.objRow = <IShiftSchdule>data;
  //           this.ShiftHour =  String(this.objRow.shiftHour);
  //           this.Starttime =
  //             ("0" + this.objRow.startShiftHour).slice(-2) +
  //             ":" +
  //             ("0" + this.objRow.startShiftMinute).slice(-2);
  //           this.Endtime =
  //             ("0" + this.objRow.endShiftHour).slice(-2) +
  //             ":" +
  //             ("0" + this.objRow.endShiftMinute).slice(-2);

  //           this.StartShiftDay = String(this.objRow.startShiftDay);
  //           this.EndShiftDay = String(this.objRow.endShiftDay);
  //           console.log(this.objRow);
            
  //         });
  //     }
  //   }
  // }

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
          this.objRow = <IShiftSchdule>data;
          this.ShiftHour =  String(this.objRow.shiftHour);
          this.Starttime =
            ("0" + this.objRow.startShiftHour).slice(-2) +
            ":" +
            ("0" + this.objRow.startShiftMinute).slice(-2);
          this.Endtime =
            ("0" + this.objRow.endShiftHour).slice(-2) +
            ":" +
            ("0" + this.objRow.endShiftMinute).slice(-2);

          this.StartShiftDay = String(this.objRow.startShiftDay);
          this.EndShiftDay = String(this.objRow.endShiftDay);
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
    this.router.navigate([this.Url_Listing,{ filter: this.filter }]);
  }

  btnDeleteClick(id: number) {
    
    // if(){
      this.delete();
     

    // }
    
      
  }

  validate() {
    console.log(this.objRow.shiftName);
    let strValidate: string = "";

    if (this.objRow.shiftName == undefined || this.objRow.shiftName == "") {
      strValidate = "Shift Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }


  async save() {
    this.dialogService.showLoader();

    this.objRow.shiftHour = this.ShiftHour;
    if (this.Starttime != null) {
      let arrstarttime: string[];
      arrstarttime = this.Starttime.split(":");
      this.objRow.startShiftHour = +arrstarttime[0];
      this.objRow.startShiftMinute = +arrstarttime[1];
    }

    if (this.Endtime != null) {
      let arrendtime: string[];
      arrendtime = this.Endtime.split(":");
      this.objRow.endShiftHour = +arrendtime[0];
      this.objRow.endShiftMinute = +arrendtime[1];
    }

    this.objRow.startShiftDay = +this.StartShiftDay;
    this.objRow.endShiftDay = +this.EndShiftDay;

    try {
      if (this.RowID == "new") {
        //Create
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");

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
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IShiftSchdule>this.objRow)
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

  delete() {
    this.brokerAPIService.post(this.UrlAPI_Delete, this.objRow).subscribe(
      
      data => {
        this.objAPIResponse = <IAPIResponse>data;
        
        if (this.objAPIResponse.success) {
          this.router.navigate([this.Url_Listing]);
          // this.objRow = this.objRow.shiftNo
          // .filter (obj => obj !== this.objRow.shiftNo)
          // .map ((obj, idx) => (obj.objRow.shiftNo = (idx + 1), obj)) ;

        } else {
          console.log(
            "this.objAPIResponse.success :" + this.objAPIResponse.success
          );
        }
      },
      err => {
        // กรณี error
        console.log("Something went wrong!");
      }
    );
  }

  // delete(elm) {
  //   this.dataSource.data = this.dataSource.data
  //     .filter(i => i !== elm)
  //     .map((i, idx) => (i.position = (idx + 1), i));
  // }

}

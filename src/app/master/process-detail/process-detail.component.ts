import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IProcess, IMachineCheckListForProcess } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION, MatTableDataSource } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";
import { DialogService } from "../../services/dialog.service";
import { ColorPickerService, Cmyk } from 'ngx-color-picker';

@Component({
  selector: "app-process-detail",
  templateUrl: "./process-detail.component.html",
  styleUrls: ["./process-detail.component.scss"]
})
export class ProcessDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;
  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  displayedColumns = ['select', 'lineOrder', 'captionCol1', 'stdMinValue1', 'stdMaxValue1', 'captionCol2', 'stdMinValue2', 'stdMaxValue2'];

  arrobjMCL1: any = [];
  arrobjMCL2: any = [];
  arrobjMCL3: any = [];

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Process/Get/";
  private UrlAPI_Update: string = "Process/Update";
  private UrlAPI_Create: string = "Process/Create";

  private Url_Listing: string = "/auth/master/process-listing";
  private UrlAPI_GetAllForProcess: string = "MachineCheckList/GetAllForProcess/3";
  private UrlAPI_GetAllTemplate: string = "MachineCheckList/GetAllTemplate/3";
  private UrlAPI_Standard_GetAllActivet: string = "Standard/GetAllActive";
  private UrlAPI_Machine_GetAllActive: string = "Machine/GetAllActive";
  private UrlAPI_UpdateForProcessList: string = "MachineCheckList/UpdateForProcessList";
  private UrlAPI_CreateForProcessList: string = "MachineCheckList/CreateForProcessList";

  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;
  tabActive: number = 0;
  objarrStandard: any;
  StandardID: any;

  bgcolor: string = null;
  public toggle: boolean;
  public rgbaText: string = '';
  public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private cpService: ColorPickerService
  ) { }

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
    // console.log("bgcolor",this.bgcolor);
    
    this.dialogService.showLoader();

    try {
      let dataActivet = await this.brokerAPIService.getAwait(this.UrlAPI_Standard_GetAllActivet);
      this.objarrStandard = dataActivet;

      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        console.log(params.get("id"));
        this.RowID = params.get("id");
        this.filter = params.get("filter");
        if (this.RowID == "new") {
        } else {
          let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objRow = <IProcess>data;
          this.bgcolor = String(this.objRow.bgColor);
          console.log(this.objRow);
        }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }



  setStandard() {
    this.brokerAPIService
      .get(this.UrlAPI_Standard_GetAllActivet)
      .subscribe(data => {
        this.objarrStandard = data;
        if (data != null) {
          // this.objRow.defaultStandard = this.objarrStandard[0].id;
        }
        console.log("this.objarrStandard", this.objarrStandard);

      });
  }


  private tabChange(tabindex: any) {
    this.tabActive = tabindex;
  }


  private prepareTemplate(element: any) {
    element.checkSelected = false;
    element.captionCol1 = element.captionCol1.replace("<ProcessName>", this.objRow.processName);
  }

  checkallValue(event: boolean, nmgroupOrder: number) {

    switch (nmgroupOrder) {
      case 1:
        this.arrobjMCL1.forEach(element => {
          element.checkSelected = event;
        });
        break;
      case 2:
        this.arrobjMCL2.forEach(element => {
          element.checkSelected = event;
        });
        break;
      case 3:
        this.arrobjMCL3.forEach(element => {
          element.checkSelected = event;
        });
        break;
      default:
        break;
    }
  }

  isAllSelected(nmgroupOrder: number) {

    let arrobjMCLFilteredList = [];
    let numRows;
    switch (nmgroupOrder) {
      case 1:
        arrobjMCLFilteredList = this.arrobjMCL1.filter(x => x.checkSelected === true);
        numRows = this.dataSource1.data.length;
        break;
      case 2:
        arrobjMCLFilteredList = this.arrobjMCL2.filter(x => x.checkSelected === true);
        numRows = this.dataSource2.data.length;
        break;
      case 3:
        arrobjMCLFilteredList = this.arrobjMCL3.filter(x => x.checkSelected === true);
        numRows = this.dataSource3.data.length;
        break;
      default:
        break;
    }

    if (arrobjMCLFilteredList.length != 0) {
      const numSelected = arrobjMCLFilteredList.length;
      return numSelected == numRows;
    }
    else {
      return false
    }
  }

  checkValue(event: any) {
    this.isAllSelected(event.groupOrder);
    console.log("event.groupOrder", event.groupOrder);
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
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IProcess>this.objRow)
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


  getdataMachineCheckList() {
    let objarrdata: any[] = [];

    this.arrobjMCL1.forEach(element => {
      let objdata: any = {};
      this.prepareData(objdata, element);
      objarrdata.push(objdata);
    });

    this.arrobjMCL2.forEach(element => {
      let objdata: any = {};
      this.prepareData(objdata, element);
      objarrdata.push(objdata);
    });

    this.arrobjMCL3.forEach(element => {
      let objdata: any = {};
      this.prepareData(objdata, element);
      objarrdata.push(objdata);
    });

    console.log("getdata()", objarrdata);
    return objarrdata;
  }

  private prepareData(objdata: any, element: any) {

    objdata.processId = this.objRow.id;
    // objdata.machineCheckListTemplateId = element??
    objdata.machineId = element.machineId;
    objdata.groupOrder = element.groupOrder;
    objdata.lineOrder = element.lineOrder;
    objdata.noColumnInLine = element.noColumnInLine;
    objdata.captionCol1 = element.captionCol1;
    objdata.dataTypeCol1 = element.dataTypeCol1;
    objdata.captionCol2 = element.captionCol2;
    objdata.dataTypeCol2 = element.dataTypeCol2;
    objdata.stdMinValue1 = element.stdMinValue1;
    objdata.stdMaxValue1 = element.stdMaxValue1;
    objdata.stdMinValue2 = element.stdMinValue2;
    objdata.stdMaxValue2 = element.stdMaxValue2;
    objdata.checkSelected = element.checkSelected;
    objdata.createBy = "";
    objdata.updateBy = "";

  }

  saveMachineCheckList() {
    // if (this.RowID == "new") {

    this.brokerAPIService.post(this.UrlAPI_CreateForProcessList, this.getdataMachineCheckList()).subscribe(
      data => {
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
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

    // } else {
    //   //Update
    //   console.log("update", this.objRow)
    //   this.brokerAPIService
    //     .post(this.UrlAPI_Update, <IProcess>this.objRow)
    //     .subscribe(
    //       data => {
    //         this.objAPIResponse = <IAPIResponse>data;
    //         if (this.objAPIResponse.success) {
    //           this.showSnackBar("Save Complete");
    //           this.router.navigate([this.Url_Listing]);
    //         } else {
    //           console.log(
    //             "this.objAPIResponse.success :" + this.objAPIResponse.success
    //           );
    //         }
    //       },
    //       err => {
    //         // กรณี error
    //         console.log("Something went wrong!");
    //       }
    //     );
    // }

    // return Observable.of(false);
  }




  //เช็คค่า
  validate() {
    console.log(this.objRow.processCode);
    let strValidate: string = "";

    if (this.objRow.processCode == undefined || this.objRow.processCode == "") {
      strValidate = "Process Code";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.processName == undefined || this.objRow.processName == "") {
      strValidate = "Process Name";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.objRow.processType == undefined || this.objRow.processType == "") {
      strValidate = "Process Type";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.bgcolor == "null" || this.bgcolor == ""  ) {
      strValidate = "Color";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }



    // if (this.objRow.machineRunningSpeed == undefined || this.objRow.machineRunningSpeed == "") {
    //   strValidate = "Machine Running Speed";
    // }

    // if (strValidate != "") {
    //   this.showDialog("error", "Error", strValidate);
    //   return false;
    // }

    // if (this.objRow.processType == "PR") {
    //   if (this.objRow.defaultStandard == undefined || this.objRow.defaultStandard == "") {
    //     strValidate = "Default Standard";
    //   }
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

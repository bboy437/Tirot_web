import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import {
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MatTableDataSource,
  MatSort
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { IProcess } from "../../interfaces/productionrecords";
import { Local } from "protractor/built/driverProviders";
import { log } from "util";
import { DialogService } from "../../services/dialog.service";
import { AppConfig } from "../../app.config";

@Component({
  selector: "app-standard-detail",
  templateUrl: "./standard-detail.component.html",
  styleUrls: ["./standard-detail.component.scss"]
})
export class StandardDetailComponent implements OnInit, AfterViewInit {
  private RowID: string;
  MachineChecklistAllowEdit = AppConfig.settings.MachineChecklistAllowEdit;

  @ViewChild(MatSort) sort: MatSort;

  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  displayedColumns = [
    "select",
    "lineOrder",
    "captionCol1",
    "stdMinValue1",
    "stdMaxValue1",
    "captionCol2",
    "stdMinValue2",
    "stdMaxValue2"
  ];

  arrobjMCL1: any = [];
  arrobjMCL2: any = [];
  arrobjMCL3: any = [];

  objRow: any = {};
  objAPIResponse: any = {};
  private UrlAPI_GetSingleRow: string = "Standard/Get/";
  private UrlAPI_Update: string = "Standard/Update";
  private UrlAPI_Create: string = "Standard/Create";

  private Url_Listing: string = "/auth/master/standard-listing";
  private UrlAPI_GetAllForProcess: string =
    "MachineCheckList/GetAllForProcess/";
  private UrlAPI_GetAllTemplate: string = "MachineCheckList/GetAllTemplate/";

  private UrlAPI_UpdateForProcessList: string =
    "MachineCheckList/UpdateForProcessList";
  private UrlAPI_CreateForProcessList: string =
    "MachineCheckList/CreateForProcessList";
  private UrlAPI_Process_GetAllActive: string = "Process/GetAllActive";
  private UrlAPI_Machine_GetAllActive: string = "Machine/GetAllActive";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;
  tabActive: number = 0;
  arrobjProcess: any[];
  arrobjMachine: any;
  MachineID: any;
  ProcessID: any;
  objProcess: any;
  MCLStatus: any;
  currentUserName: string;

  inWeightMin: number = 0;
  inWeightMax: number = 0;
  inTicknessMin: number = 0;
  inTicknessMax: number = 0;
  inWidthMin: number = 0;
  inWidthMax: number = 0;
  outWeightMin: number = 0;
  outWeightMax: number = 0;
  outTicknessMin: number = 0;
  outTicknessMax: number = 0;
  outWidthMin: number = 0;
  outWidthMax: number = 0;
  runningSpeed: number = 0;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) { }

  params: any;
  async ngOnInit() {

    console.log("MachineChecklistAllowEdit", this.MachineChecklistAllowEdit);

    this.dialogService.showLoader();

    try {
      this.currentUserName = localStorage.getItem("currentUserName");
      this.params = this.route.snapshot.paramMap;

      let data: any = await this.brokerAPIService.getAwait(
        this.UrlAPI_Process_GetAllActive
      );
      this.arrobjProcess = <IProcess[]>data;

      await this.setMachine();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  ngAfterViewInit(): void {
    this.dataSource1.sort = this.sort;
    this.dataSource2.sort = this.sort;
    this.dataSource3.sort = this.sort;
  }

  async getMachineCheckList(isShowDialogError = true) {
    if (isShowDialogError) this.dialogService.showLoader();

    try {
      if (this.ProcessID != undefined && this.MachineID != undefined) {
        this.objProcess = this.arrobjProcess.find(x => x.id === this.ProcessID);
        console.log(this.objProcess);

        console.log(
          "getMachineCheckList",
          this.UrlAPI_GetAllForProcess +
          this.MachineID +
          "," +
          this.ProcessID +
          "," +
          this.RowID
        );

        let data: any = await this.brokerAPIService.getAwait(
          this.UrlAPI_GetAllForProcess +
          this.MachineID +
          "," +
          this.ProcessID +
          "," +
          this.RowID
        );
        console.log("data", data);
        console.log("length", data.length);
        if (data.length > 0) {
          this.MCLStatus = "E"; // Edit
          console.log("aaaaaaaaaaa");

          this.arrobjMCL1 = data.filter(x => x.groupOrder === 1);
          this.arrobjMCL2 = data.filter(x => x.groupOrder === 2);
          this.arrobjMCL3 = data.filter(x => x.groupOrder === 3);

          console.log(this.arrobjMCL1);

          this.dataSource1.data = this.arrobjMCL1;
          this.dataSource2.data = this.arrobjMCL2;
          this.dataSource3.data = this.arrobjMCL3;
          console.log(this.dataSource1.data);
  
        } else {
          console.log("bbbbbbbbbbbbbbb");
          this.MCLStatus = "N"; // New
          this.getAllTemplate();
        }

        console.log("this.MCLStatus", this.MCLStatus);
      }
    } catch (error) {
      if (isShowDialogError) this.dialogService.showErrorDialog(error);
      else throw error;
    }

    if (isShowDialogError) this.dialogService.hideLoader();
  }

  tabChange(tabindex: any) {
    this.tabActive = tabindex;
  }

  private getAllTemplate() {
    console.log(this.UrlAPI_GetAllTemplate + this.MachineID);
    this.brokerAPIService
      .get(this.UrlAPI_GetAllTemplate + this.MachineID)
      .subscribe(data => {
        console.log("UrlAPI_GetAllTemplate", data);
        if (data.length > 0) {
          if (this.dataSource1.data.length == 0) {
            this.arrobjMCL1 = data.filter(x => x.groupOrder === 1);
            this.arrobjMCL1.forEach(element => {
              this.prepareTemplate(element);
            });
            this.dataSource1.data = this.arrobjMCL1;
          }

          if (this.dataSource2.data.length == 0) {
            this.arrobjMCL2.forEach(element => {
              this.prepareTemplate(element);
            });

            this.arrobjMCL2 = data.filter(x => x.groupOrder === 2);
            this.dataSource2.data = this.arrobjMCL2;
          }

          if (this.dataSource3.data.length == 0) {
            this.arrobjMCL3.forEach(element => {
              this.prepareTemplate(element);
            });

            this.arrobjMCL3 = data.filter(x => x.groupOrder === 3);
            this.dataSource3.data = this.arrobjMCL3;
          }
        }
      });
  }

  private prepareTemplate(element: any) {
    
    element.checkSelected = false;
   
     while (element.captionCol1.search("<ProcessName>") != -1) {
      element.captionCol1 = element.captionCol1.replace("<ProcessName>", this.objProcess.processName);
     }
     
     while (element.captionCol2.search("<ProcessName>") != -1) {
      element.captionCol2 = element.captionCol2.replace("<ProcessName>", this.objProcess.processName);
     }
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
        arrobjMCLFilteredList = this.arrobjMCL1.filter(
          x => x.checkSelected === true
        );
        numRows = this.dataSource1.data.length;
        break;
      case 2:
        arrobjMCLFilteredList = this.arrobjMCL2.filter(
          x => x.checkSelected === true
        );
        numRows = this.dataSource2.data.length;
        break;
      case 3:
        arrobjMCLFilteredList = this.arrobjMCL3.filter(
          x => x.checkSelected === true
        );
        numRows = this.dataSource3.data.length;
        break;
      default:
        break;
    }

    if (arrobjMCLFilteredList.length != 0) {
      const numSelected = arrobjMCLFilteredList.length;
      return numSelected == numRows;
    } else {
      return false;
    }
  }

  ddlProcess_SelectIndexChange(data) {
    this.getMachineCheckList();
  }

  ddlMachine_SelectIndexChange(data) {
    // this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === data);
    this.getMachineCheckList();
  }

  async setMachine() {
    this.dialogService.showLoader();

    try {
      this.arrobjMachine = await this.brokerAPIService.getAwait(
        this.UrlAPI_Machine_GetAllActive
      );

      if (this.params.has("id")) {
        this.RowID = this.params.get("id");
        
        this.filter = this.params.get("filter");
        if (this.RowID == "new") {
          this.MCLStatus = "N";

          return;
        }
        this.objRow = await this.brokerAPIService.getAwait(
          this.UrlAPI_GetSingleRow + this.RowID

        );
        console.log("objRow", this.objRow);

        this.MachineID = this.objRow.machineId;
        this.ProcessID = this.objRow.processId;
        this.inWeightMin = this.objRow.inWeightMin;
        this.inWeightMax = this.objRow.inWeightMax;
        this.inTicknessMin = this.objRow.inTicknessMin;
        this.inTicknessMax = this.objRow.inTicknessMax;
        this.inWidthMin = this.objRow.inWidthMin;
        this.inWidthMax = this.objRow.inWidthMax;
        this.outWeightMin = this.objRow.outWeightMin;
        this.outWeightMax = this.objRow.outWeightMax;
        this.outTicknessMin = this.objRow.outTicknessMin;
        this.outTicknessMax = this.objRow.outTicknessMax;
        this.outWidthMin = this.objRow.outWidthMin;
        this.outWidthMax = this.objRow.outWidthMax;
        // this.runningSpeed = (this.objRow.runningSpeed * 1000);
        this.runningSpeed = (this.objRow.runningSpeed / 1000);
        
        await this.getMachineCheckList(false);
      }
    } catch (error) {
      throw error;
    }

    this.dialogService.hideLoader();
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

  save() {
    this.objRow.inWeightMin = this.inWeightMin;
    this.objRow.inWeightMax = this.inWeightMax;
    this.objRow.inTicknessMin = this.inTicknessMin;
    this.objRow.inTicknessMax = this.inTicknessMax;
    this.objRow.inWidthMin = this.inWidthMin;
    this.objRow.inWidthMax = this.inWidthMax;
    this.objRow.outWeightMin = this.outWeightMin;
    this.objRow.outWeightMax = this.outWeightMax;
    this.objRow.outTicknessMin = this.outTicknessMin;
    this.objRow.outTicknessMax = this.outTicknessMax;
    this.objRow.outWidthMin = this.outWidthMin;
    this.objRow.outWidthMax = this.outWidthMax;
    // this.objRow.runningSpeed = (this.runningSpeed / 1000);
     this.objRow.runningSpeed = (this.runningSpeed * 1000);


    if (this.RowID == "new") {
      //Create
      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";
      this.objRow.processId = this.ProcessID;
      this.objRow.machineId = this.MachineID;
      this.objRow.inActivated = false;

      console.log("save", this.objRow);

      this.brokerAPIService.post(this.UrlAPI_Create, this.objRow).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.RowID = this.objAPIResponse.data;
            this.saveMachineCheckList();
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
    } else {
      //Update
      console.log("update", this.objRow);

      this.objRow.processId = this.ProcessID;
      this.objRow.machineId = this.MachineID;
      this.brokerAPIService.post(this.UrlAPI_Update, this.objRow).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            console.log(
              "UrlAPI_Update -- this.objAPIResponse.success :" +
              this.objAPIResponse.success
            );
            this.saveMachineCheckList();
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

    // return Observable.of(false);
  }

  getdataMachineCheckList() {
    let objarrdata: any[] = [];

    console.log("prepareData", this.MCLStatus);

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
    // console.log("prepareData",element);
    console.log("xxxx", this.MCLStatus);

    if (this.MCLStatus == "E") {
      objdata.id = element.id;
      console.log("xxxx", objdata.id);
      objdata.machineCheckListTemplateId = element.machineCheckListTemplateId;
    } else {
      objdata.machineCheckListTemplateId = element.id;
    }

    objdata.standardId = Number(this.RowID);
    objdata.processId = this.ProcessID;
    objdata.machineId = this.MachineID;
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
    objdata.createBy = this.currentUserName;
    objdata.updateBy = this.currentUserName;
  }

  saveMachineCheckList() {
    if (this.MCLStatus == "N") {
      let result: any = this.getdataMachineCheckList();
      this.brokerAPIService
        .post(this.UrlAPI_CreateForProcessList, this.getdataMachineCheckList())
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.dialogService.showSnackBar("Save Complete");
              this.router.navigate([this.Url_Listing]);
            } else {
              console.log("this.objAPIResponse.success :", this.objAPIResponse);
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
          }
        );
    } else {
      //Update
      console.log(this.UrlAPI_UpdateForProcessList);
      this.brokerAPIService
        .post(this.UrlAPI_UpdateForProcessList, this.getdataMachineCheckList())
        .subscribe(
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
    }
  }

  //เช็คค่า
  validate() {
    console.log(this.objRow.processCode);
    let strValidate: string = "";

    if (
      this.objRow.standardName == undefined ||
      this.objRow.standardName == ""
    ) {
      strValidate = "Standard Name";
    }

    if (this.ProcessID == undefined || this.ProcessID == "") {
      if (strValidate != "") {
        strValidate += ",";
      }
      strValidate += "Process";
    }

    if (this.MachineID == undefined || this.MachineID == "") {
      if (strValidate != "") {
        strValidate += ",";
      }
      strValidate += "Machine";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.inWeightMin > this.inWeightMax) {
      strValidate = "ค่า In Weight Min ต้องน้อยกว่า In Weight Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }

    if (this.inTicknessMin > this.inTicknessMax) {
      strValidate = "ค่า In Tickness Min ต้องน้อยกว่า In Tickness Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.inWidthMin > this.inWidthMax) {
      strValidate = "ค่า In Width Min ต้องน้อยกว่า In Width Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.outWeightMin > this.outWeightMax) {
      strValidate = "ค่า Out Weight Min ต้องน้อยกว่า Out Weight Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.outTicknessMin > this.outTicknessMax) {
      strValidate = "ค่า Out Tickness Min ต้องน้อยกว่า Out Tickness Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.outWidthMin > this.outWidthMax) {
      strValidate = "ค่า Out Width Min ต้องน้อยกว่า Out Width Max";
    }
    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;
    }
    if (this.runningSpeed == undefined || this.runningSpeed == null) {
      strValidate = "Machine Running Speed (m/mins)";
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

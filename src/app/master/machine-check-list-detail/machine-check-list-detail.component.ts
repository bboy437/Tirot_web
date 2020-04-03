import { Component, OnInit, VERSION } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProcess, IMachineCheckList } from '../../interfaces/productionrecords';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-machine-check-list-detail',
  templateUrl: './machine-check-list-detail.component.html',
  styleUrls: ['./machine-check-list-detail.component.scss']
})
export class MachineCheckListDetailComponent implements OnInit {
  version = VERSION;
  private RowID: string;
  dataSource = new MatTableDataSource();
  displayedColumns = ['select', 'processCode', 'processName', 'processType', 'inActivated'];
  arrobjMCL: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  MachineID: string = "";
  arrobjMachine: any = [];
  panelOpenState = false;
  GroupOrderName = "";

  private UrlAPI_GetSingleRow: string = "MachineCheckList/GetTemplate/";
  private UrlAPI_Update: string = "MachineCheckList/UpdateTemplate";
  private UrlAPI_Create: string = "MachineCheckList/CreateTemplate";


  private UrlAPI_GetAll_Machine: string = "/Machine/GetAll";
  private Url_Listing: string = "/auth/master/machine-check-list-listing";
  private UrlAPI_GetAll: string = "Process/GetAll";
  private UrlAPI_GetAllTemplate: string = "MachineCheckList/GetAllTemplate/";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  tabActive: number;


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
      let dataMachine = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll_Machine);
      this.arrobjMachine = dataMachine;
      if (this.arrobjMachine.length > 0) {
        this.MachineID = this.arrobjMachine[0].id;
      }

      let params = this.route.snapshot.paramMap;
      if (params.has("id")) {
        console.log(params.get("id"));
        this.RowID = params.get("id");
        this.tabActive = +params.get("tabActive");
        await this.setGroupOrder();
        if (this.RowID == "new") {
          this.objRow.noColumnInLine = "1";
          this.objRow.dataTypeCol1 = "0";
          this.objRow.dataTypeCol2 = "0";
        } else {
          let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetSingleRow + this.RowID);
          this.objRow = <IMachineCheckList>data;
          this.objRow.groupOrder = String(this.objRow.groupOrder);
          this.objRow.noColumnInLine = String(this.objRow.noColumnInLine);
        }
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async setGroupOrder() {
    try {
      switch (this.tabActive) {
        case 0:
          this.GroupOrderName = "เช็คความพร้อมของเครื่องจักร";
          break;
        case 1:
          this.GroupOrderName = "เช็คสภาพการทำงานของ EPC";
          break;
        case 2:
          this.GroupOrderName = "เช็คความสะอาดเครื่องจักรก่อนเดินเครื่อง";
          break;
        default:
          break;
      }
      this.objRow.groupOrder = String(this.tabActive + 1);
    } catch (error) {
      throw error;
    }

  }

  dataTypeCol1Change(value: number) {
    if (value == 2) {
      this.objRow.stdMinValue1 = 0;
      this.objRow.stdMaxValue1 = 0;
    }
  }

  dataTypeCol2Change(value: number) {
    if (value == 2) {
      this.objRow.stdMinValue2 = 0;
      this.objRow.stdMaxValue2 = 0;
    }
  }



  btnSaveClick() {
    // if (this.validate()) {
    this.save();
    //}
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { tabActive: this.tabActive }]);
  }

  getData() {

    let objdata: any = {};

    if (this.RowID == "new") {

      objdata.createBy = "admin";
      objdata.updateBy = "admin";

    }
    else {
      objdata.id = this.RowID;
    }
    objdata.machineId = this.MachineID;
    objdata.groupOrder = +this.objRow.groupOrder;

    objdata.lineOrder = +this.objRow.lineOrder;
    objdata.noColumnInLine = +this.objRow.noColumnInLine;
    objdata.captionCol1 = this.objRow.captionCol1;
    objdata.dataTypeCol1 = +this.objRow.dataTypeCol1;

    if (this.objRow.dataTypeCol2 == undefined) {
      objdata.dataTypeCol2 = 0;
    }
    else {
      objdata.dataTypeCol2 = +this.objRow.dataTypeCol2;
    }

    if (this.objRow.captionCol2 == undefined) {
      objdata.captionCol2 = "";
    }
    else {
      objdata.captionCol2 = this.objRow.captionCol2;
    }


    if (this.objRow.stdMinValue1 == undefined) {
      objdata.stdMinValue1 = 0;
    }
    else {
      objdata.stdMinValue1 = +this.objRow.stdMinValue1;
    }

    if (this.objRow.stdMaxValue1 == undefined) {
      objdata.stdMaxValue1 = 0;
    }
    else {
      objdata.stdMaxValue1 = +this.objRow.stdMaxValue1;
    }

    if (this.objRow.stdMinValue2 == undefined) {
      objdata.stdMinValue2 = 0;
    }
    else {
      objdata.stdMinValue2 = +this.objRow.stdMinValue2;
    }

    if (this.objRow.stdMaxValue2 == undefined) {
      objdata.stdMaxValue2 = 0;
    }
    else {
      objdata.stdMaxValue2 = +this.objRow.stdMaxValue2;
    }

    console.log("getdata()", objdata);
    return objdata;
  }

  // async save1() {
  //   if (this.RowID == "new") {
  //     //Create
  //     await this.brokerAPIService.get(this.UrlAPI_GetAllTemplate + this.MachineID).subscribe(data => {
  //       let arrobjMachineCheckList = data.filter(x => x.groupOrder === this.tabActive + 1);
  //       if (arrobjMachineCheckList.length == 0) {
  //         this.objRow.lineOrder = 1;
  //       }
  //       else {
  //         arrobjMachineCheckList.sort((a, b) => {
  //           return a.lineOrder - b.lineOrder;
  //         });
  //         //  console.log("next lineOrder",arrobjMachineCheckList[arrobjMachineCheckList.length -1].lineOrder + 1);
  //         this.objRow.lineOrder = arrobjMachineCheckList[arrobjMachineCheckList.length - 1].lineOrder + 1;
  //       }

  //       let dataCreate: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, <IMachineCheckList>this.getData());
  //       this.objAPIResponse = <IAPIResponse>dataCreate;
  //       if (this.objAPIResponse.success) {
  //         this.dialogService.showSnackBar("Save Complete");
  //         this.router.navigate([this.Url_Listing, { tabActive: this.tabActive }]);
  //       } else {
  //         this.dialogService.showDialog(
  //           "error",
  //           "Error",
  //           this.objAPIResponse.message
  //         );
  //       }
  //     })
  //   } else {
  //     //Update
  //     this.brokerAPIService
  //       .post(this.UrlAPI_Update, <IMachineCheckList>this.getData())
  //       .subscribe(
  //         data => {
  //           this.objAPIResponse = <IAPIResponse>data;
  //           if (this.objAPIResponse.success) {
  //             this.showSnackBar("Save Complete");
  //             this.router.navigate([this.Url_Listing, { tabActive: this.tabActive }]);
  //           } else {
  //             console.log(
  //               "this.objAPIResponse.success :" + this.objAPIResponse.success
  //             );
  //           }
  //         },
  //         err => {
  //           // กรณี error
  //           console.log("Something went wrong!");
  //         }
  //       );
  //   }

  //   // return Observable.of(false);
  // }

  async save() {
    this.dialogService.showLoader();
    try {
      if (this.RowID == "new") {
        //Create

        let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllTemplate + this.MachineID)
        let arrobjMachineCheckList = data.filter(x => x.groupOrder === this.tabActive + 1);
        if (arrobjMachineCheckList.length == 0) {
          this.objRow.lineOrder = 1;
        }
        else {
          arrobjMachineCheckList.sort((a, b) => {
            return a.lineOrder - b.lineOrder;
          });
          //  console.log("next lineOrder",arrobjMachineCheckList[arrobjMachineCheckList.length -1].lineOrder + 1);
          this.objRow.lineOrder = arrobjMachineCheckList[arrobjMachineCheckList.length - 1].lineOrder + 1;
        }

        let dataCreate: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, <IMachineCheckList>this.getData());
        this.objAPIResponse = <IAPIResponse>dataCreate;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { tabActive: this.tabActive }]);
        } else {
          this.dialogService.showDialog(
            "error",
            "Error",
            this.objAPIResponse.message
          );
        }

      } else {
        //Update
        let dataUpdate: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, <IMachineCheckList>this.getData());
        this.objAPIResponse = <IAPIResponse>dataUpdate;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { tabActive: this.tabActive }]);
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
    } else {
      return true;
    }
  }

  
}

import { Component, OnInit, ViewChild } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MatDialog,
  MatSnackBar,
  MatTableDataSource,
  MatSelect,
  MatDialogRef
} from "@angular/material";
import { IAPIResponse } from "../../interfaces/apiResponse";

import { SensorExpressionDialogComponent } from "./sensor-expression-dialog/sensor-expression-dialog.component";

import { Validate } from "../../librarys/Validate";
import { DialogService } from "../../services/dialog.service";
@Component({
  selector: "app-sensor-detail",
  templateUrl: "./sensor-detail.component.html",
  styleUrls: ["./sensor-detail.component.scss"]
})
export class SensorDetailComponent implements OnInit {
  //View object
  objValidate: Validate;

  //Props
  private props: any;
  RowID: string;
  private filter: string;

  //Data
  objRow: any = {};
  private objAPIResponse: any = {};
  private dataSource = new MatTableDataSource();

  //URL
  private UrlAPI_GetSingleRow: string = "Machine/GetSensor/";
  private UrlAPI_Create: string = "Machine/AddSensor";
  private UrlAPI_Update: string = "Machine/UpdateSensor";
  private UrlAPI_Delete: string = "Machine/DeleteSensor";

  dialogRefSensorExpression: MatDialogRef<SensorExpressionDialogComponent>;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
    this.objValidate = new Validate();
  }

  //############# Life cycle ##################
  item: any = {};

  async ngOnInit() {
    this.dialogService.showLoader();

    try {
      let params = this.route.snapshot.paramMap;

      //Check props
      if (!params.has("props")) {
        console.log("props null");
        this.dialogService.hideLoader();
        return;
      }

      //Process
      this.props = JSON.parse(params.get("props"));
      this.RowID = this.props.sensorId;
      this.filter = this.props.filter;

      if (this.RowID === "new") {
        this.newForm();
      } else {
        //Call api
        let data: any = await this.brokerAPIService.getAwait(
          this.UrlAPI_GetSingleRow + this.RowID
        );

        this.objRow = <any>data;
        this.changePullInterfaceType(this.objRow.pullInterfaceType);
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  ngOnDestroy() {
    this.btnCloseClick();
  }

  ngAfterViewInit() {}

  //############# Default function ##################

  newForm() {
    this.setDefaultObjectRow();
    this.changePullInterfaceType(this.objRow.pullInterfaceType);
  }
  setDefaultObjectRow() {
    this.objRow.machineId = this.props.machineId;

    this.objRow.sensorValueType = "1";
    this.objRow.baudrate = "9600";
    this.objRow.pullInterfaceType = "1";
    this.objRow.parity = "0";
    this.objRow.stopBit = "0";
    this.objRow.dataRetrievalType = "1";
    this.objRow.tirotEdgeId = "0";
    this.objRow.isMachineStatus = false;

    this.objRow.sensorValueUnitName = "";

    this.objRow.commPortName = "";
    this.objRow.connectionString = null;

    this.objRow.deviceIP = null;
    this.objRow.devicePort = 0;
    this.objRow.deviceUnitId = 0;
    this.objRow.inActivated = false;
    this.objRow.invokeCommand = null;
    this.objRow.limitMaxValue = 0;
    this.objRow.limitMinValue = 0;
    this.objRow.macAddress = null;

    this.objRow.remark = null;
    this.objRow.sensorCondition = null;
    this.objRow.sensorExpression = null;
    this.objRow.sensorGroupName = "";
    this.objRow.sensorLocation = "";
    this.objRow.sensorName = "";
    this.objRow.uid = null;
  }

  //############# Request function ##################

  async save() {
    this.dialogService.showLoader();

    try {
      this.objRow.updateBy = localStorage.getItem("currentUserName");

      this.objAPIResponse = await this.brokerAPIService.postAwait(
        this.UrlAPI_Create,
        this.objRow
      );

      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.router.navigate([
          "/auth/master/machine-detail",
          { props: JSON.stringify(this.props) }
        ]);
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

  async update() {
    this.dialogService.showLoader();

    try {
      this.objRow.updateBy = localStorage.getItem("currentUserName");

      //Validate
      let objResultValidate: any = this.objValidate.requireField(this.objRow, [
        "sensorName"
      ]);
      console.log("Validate false = ", objResultValidate);

      //call api
      this.objAPIResponse = await this.brokerAPIService.postAwait(
        this.UrlAPI_Update,
        this.objRow
      );
      this.objAPIResponse = <IAPIResponse>this.objAPIResponse;

      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Update Complete");
        this.router.navigate([
          "/auth/master/machine-detail",
          { props: JSON.stringify(this.props) }
        ]);
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

  async delete() {
    this.dialogService.showLoader();

    try {
      //Set update by
      this.objRow.updateBy = localStorage.getItem("currentUserName");

      this.objAPIResponse = await this.brokerAPIService.postAwait(
        this.UrlAPI_Delete,
        this.objRow
      );

      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Delete Complete");
        this.router.navigate([
          "/auth/master/machine-detail",
          { props: JSON.stringify(this.props) }
        ]);
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

  //############# Handle ##################

  btnSaveClick() {
    if (this.RowID === "new") this.save();
    else this.update();
  }

  btnDeleteClick() {
    this.delete();
  }

  btnCloseClick() {
    this.router.navigate([
      "/auth/master/machine-detail",
      { props: JSON.stringify(this.props) }
    ]);
  }

  btnClickSensorExpression() {
    console.log("btnClickSensorExpression");

    this.showDialog();
  }

  showDialog() {
    console.log("Open dialog");
    if (this.objRow.sensorExpression == null) this.objRow.sensorExpression = "";
    let dialogRef = this.dialog.open(SensorExpressionDialogComponent, {
      data: { formulaText: this.objRow.sensorExpression },
      disableClose: true,
      width: "520px",
      height: "600px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");

      if (result != undefined) {
        this.objRow.sensorExpression = result;
        console.log(result);
      }
    });
  }

  //############# General function ##################

  isShowDeviceIP: boolean = false;
  isShowDevicePort: boolean = false;
  isShowDeviceUnitId: boolean = false;
  isShowCommPortName: boolean = false;
  isShowBaudrate: boolean = false;
  isShowParity: boolean = false;
  isShowStopBit: boolean = false;
  isShowInvokeCommand: boolean = false;
  isShowConnectionString: boolean = false;
  isShowTirotEdgeId: boolean = false;
  //Row 2
  isShowTirotEdgeIdRow2: boolean = false;
  isSensorCondition: boolean = false;
  isSensorExpression: boolean = false;

  changePullInterfaceType(value) {
    switch (value) {
      case "1": //No action
        //Row 1
        this.isShowDeviceIP = false;
        this.isShowDevicePort = false;
        this.isShowDeviceUnitId = false;
        this.isShowCommPortName = false;
        this.isShowBaudrate = false;
        this.isShowParity = false;
        this.isShowStopBit = false;
        this.isShowInvokeCommand = false;
        this.isShowConnectionString = false;
        this.isShowTirotEdgeId = false;

        //Row 2
        this.isShowTirotEdgeIdRow2 = false;
        this.isSensorCondition = false;
        this.isSensorExpression = false;
        break;

      case "2": //Modbus TCP to Agend
        //Row 1
        this.isShowDeviceIP = true;
        this.isShowDevicePort = true;
        this.isShowDeviceUnitId = true;
        this.isShowCommPortName = false;
        this.isShowBaudrate = false;
        this.isShowParity = false;
        this.isShowStopBit = false;
        this.isShowInvokeCommand = false;
        this.isShowConnectionString = false;
        this.isShowTirotEdgeId = false;

        //Row 2
        this.isShowTirotEdgeIdRow2 = true;
        this.isSensorCondition = true;
        this.isSensorExpression = true;

        break;

      case "3": //Modbus RTU to Agend
        //Row 1
        this.isShowDeviceIP = false;
        this.isShowDevicePort = false;
        this.isShowDeviceUnitId = false;
        this.isShowCommPortName = true;
        this.isShowBaudrate = true;
        this.isShowParity = true;
        this.isShowStopBit = true;
        this.isShowInvokeCommand = false;
        this.isShowConnectionString = false;
        this.isShowTirotEdgeId = false;

        //Row 2
        this.isShowTirotEdgeIdRow2 = true;
        this.isSensorCondition = true;
        this.isSensorExpression = true;

        break;

      case "4": //Web service request
        //Row 1
        this.isShowDeviceIP = false;
        this.isShowDevicePort = false;
        this.isShowDeviceUnitId = false;
        this.isShowCommPortName = false;
        this.isShowBaudrate = false;
        this.isShowParity = false;
        this.isShowStopBit = false;
        this.isShowInvokeCommand = false;
        this.isShowConnectionString = false;
        this.isShowTirotEdgeId = false;

        //Row 2
        this.isShowTirotEdgeIdRow2 = false;
        this.isSensorCondition = false;
        this.isSensorExpression = false;

        break;

      case "5": //TCP/IP Socket
        //Row 1
        this.isShowDeviceIP = true;
        this.isShowDevicePort = true;
        this.isShowDeviceUnitId = false;
        this.isShowCommPortName = false;
        this.isShowBaudrate = false;
        this.isShowParity = false;
        this.isShowStopBit = false;
        this.isShowInvokeCommand = true;
        this.isShowConnectionString = false;
        this.isShowTirotEdgeId = true;

        //Row 2
        this.isShowTirotEdgeIdRow2 = false;
        this.isSensorCondition = false;
        this.isSensorExpression = false;

        break;

      case "6": //Direct query from DB
        //Row 1
        this.isShowDeviceIP = false;
        this.isShowDevicePort = false;
        this.isShowDeviceUnitId = false;
        this.isShowCommPortName = false;
        this.isShowBaudrate = false;
        this.isShowParity = false;
        this.isShowStopBit = false;
        this.isShowInvokeCommand = true;
        this.isShowConnectionString = true;
        this.isShowTirotEdgeId = true;

        //Row 2
        this.isShowTirotEdgeIdRow2 = false;
        this.isSensorCondition = false;
        this.isSensorExpression = false;

        break;

      default:
        break;
    }
  }
}

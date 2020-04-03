import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IAccount } from "../../interfaces/productionrecords"
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource, MatDialogRef, VERSION, MatSnackBar,
} from "@angular/material";
import { DialogService } from "../../services/dialog.service";

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  version = VERSION;
  isLoadingResults = true;
  private RowID: string;
  objRow: any = {};
  objAPIResponse: any = {};
  objRowSelected: any = [];
  objSysRole: any = [];
  selected = 'option2'
  objuserRole: any;
  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  disable: boolean=  true;

  states: State[] = [
    {
      name: 'EN',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_the_United_Kingdom.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/archive/a/ae/20051016205939%21Flag_of_the_United_Kingdom.svg'
    },
    {
      name: 'TH',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Thailand.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/archive/a/a9/20090810210859%21Flag_of_Thailand.svg'

    },

  ];


  private UrlAPI_Update: string = "Account/UpdateTirotUser";
  private UrlAPI_Create: string = "Account/Register";
  private UrlAPI_SysRoleGetAll: string = "SysRole/GetAll"
  private Url_Listing: string = "/auth/master/account-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

  constructor(

    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService



  ) {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );
  }
  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  async ngOnInit() {
    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      if (params.has('id')) {
        this.RowID = params.get('id')
        this.filter = params.get("filter");
        this.disable = false;
        console.log("RowID ", this.RowID);
      }
      if (params.has('objRowSelected')) {
        this.objRow = JSON.parse(params.get('objRowSelected'));
        this.disable = true;
        console.log(this.objRow);
      }
      await this.SysRoleGetAll();

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }


  async SysRoleGetAll() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_SysRoleGetAll)
      this.objSysRole = data;
      this.objuserRole = this.objSysRole.filter(x => x.rolesName === this.objRow.userRole)[0];
    } catch (error) {
      throw error
    }
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

        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Create, this.getdata())
        console.log("data", data);

        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
        } else {
          this.dialogService.showDialog(
            "error",
            "Error",
            this.objAPIResponse.message
          );
        }

      } else {
        //Update
        let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Update, this.getdata());
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing]);
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

  getdata() {
    let objdata: any;
    objdata = {};
    console.log(this.objRow.id);

    if (this.objRow.id != undefined) {
      objdata.id = this.objRow.id;
    }

    objdata.userName = this.objRow.userName;
    objdata.prefixName = this.objRow.prefixName;
    objdata.firstName = this.objRow.firstName;
    objdata.lastName = this.objRow.lastName;
    console.log(this.objuserRole);

    if (this.objuserRole != null && this.objuserRole != undefined) {
      objdata.userRole = this.objuserRole.rolesName;
      objdata.userLevel = this.objuserRole.rolesLevel;
    }
    objdata.defaultLangCode = this.objRow.defaultLangCode;
    objdata.isAdmin = this.objRow.isAdmin;
    objdata.inActivated = this.objRow.inActivated;

    if (this.RowID == "new") {
      objdata.createBy = localStorage.getItem("currentUserName");
      objdata.updateBy = localStorage.getItem("currentUserName");
    }
    else {
      objdata.updateBy = localStorage.getItem("currentUserName");
    }

    objdata.email = "soldev@gmail.com";
    objdata.password = "P@ssw0rd";
    console.log("objdata", objdata);

    return objdata;
  }

  validate() {
    console.log(this.objRow.userName);
    let strValidate: string = "";


    if (this.objRow.userName == undefined || this.objRow.userName == "") {
      strValidate = "User Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objRow.prefixName == undefined || this.objRow.prefixName == "") {
      strValidate = "Prefix Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objRow.firstName == undefined || this.objRow.firstName == "") {
      strValidate = "First Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objRow.lastName == undefined || this.objRow.lastName == "") {
      strValidate = "Last Name";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }

    if (this.objuserRole == undefined || this.objuserRole == "") {
      strValidate = "User Role";
    }

    if (strValidate != "") {
      this.dialogService.showDialog("error", "Error", strValidate);
      return false;

    }


    else {
      return true;
    }
  }


  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }
}

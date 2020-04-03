import { DialogService } from "./../../../services/dialog.service";
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatSnackBar
} from "@angular/material";
import { BrokerAPIService } from "../../../services/brokerapi.service";
import { Alert } from "selenium-webdriver";

@Component({
  selector: "app-user-changepassword-dialog",
  templateUrl: "./user-changepassword-dialog.component.html",
  styleUrls: ["./user-changepassword-dialog.component.scss"]
})
export class UserChangepasswordDialogComponent implements OnInit {
  currentUserName: string;
  oldPassword: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
  isNewUser: string;
  isLoadingResults: boolean;

  isShowOldPassword: boolean = true;
  isShowNewPassword: boolean = true;
  isShowConfirmNewPassword: boolean = true;

  //Url
  private UrlAPI_GetCurrentTirotUser: string = "/Account/GetCurrentTirotUser";
  private objRowCurrentTirotUser: any;

  //URL
  private UrlAPI_UpdateTirotUser: string = "/Account/UpdateTirotUser";
  private UrlAPI_IdentityUserChangePassword: string =
    "/Account/IdentityUserChangePassword";

  constructor(
    private brokerAPIService: BrokerAPIService,
    public dialogRef: MatDialogRef<UserChangepasswordDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUserName = localStorage.getItem("currentUserName");
    this.isNewUser = localStorage.getItem("isNewUser");
  }

  ngOnInit() {}

  async updatePassword() {
    this.isLoadingResults = true;

    try {
      let objAPIResponse: any = await this.brokerAPIService.postAwait(
        this.UrlAPI_IdentityUserChangePassword,
        {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }
      );

      if (objAPIResponse.success) {
        if (this.isNewUser == "true") {
          await this.updateIsNewUser(true, false);
        } else {
          this.dialogService.showSnackBar("Save complete");
          this.dialogRef.close();
        }
      } else {
        //ส่งไป แต่ข้อมูลผิดพลาด
        // this.dialogService.showDialog("error", "Error", objAPIResponse.message);
        alert(objAPIResponse.message);
      }
    } catch (error) {
      // this.dialogService.showErrorDialog(error);
      alert(
        "เกิดข้อผิดพลาดในการติดต่อกับ application server กรุณาติดต่อ IT admin เพื่อแก้ไขปัญหา"
      );
    }

    this.isLoadingResults = false;
  }

  async updateIsNewUser(isSave: boolean, isShowAlertWhenCatch: boolean = true) {
    if (!isShowAlertWhenCatch) this.isLoadingResults = true;

    try {
      this.objRowCurrentTirotUser = await this.brokerAPIService.getAwait(
        this.UrlAPI_GetCurrentTirotUser
      );
      //change status
      this.objRowCurrentTirotUser.isNewUser = false;

      //Post
      let objAPIResponse: any = await this.brokerAPIService.postAwait(
        this.UrlAPI_UpdateTirotUser,
        this.objRowCurrentTirotUser
      );

      if (objAPIResponse.success) {
        localStorage.setItem(
          "isNewUser",
          this.objRowCurrentTirotUser.isNewUser
        );
        if (isSave) this.dialogService.showSnackBar("Save complete");
        this.dialogRef.close();
      } else {
        alert(objAPIResponse.message);
      }
    } catch (error) {
      if (isShowAlertWhenCatch) {
        alert(
          "เกิดข้อผิดพลาดในการติดต่อกับ application server กรุณาติดต่อ IT admin เพื่อแก้ไขปัญหา"
        );
      } else throw error;
    }

    if (!isShowAlertWhenCatch) this.isLoadingResults = false;
  }
  showSnackBar(message: string): any {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  onClickSave(): void {
    if (this.newPassword == this.confirmNewPassword) {
      this.updatePassword();
    } else {
      // confirm("Password not match");
      alert("Password not match");
    }
  }

  onCancel(): void {
    console.log("ccccccccccccccc", this.isNewUser);

    if (this.isNewUser == "true") {
      this.updateIsNewUser(false);
    } else {
      this.dialogRef.close();
    }
  }

  //old password
  onMouseDownShowOldPassword(): void {
    this.isShowOldPassword = false;
  }
  onMouseUpShowOldPassword(): void {
    this.isShowOldPassword = true;
  }
  //new password
  onMouseDownShowNewPassword(): void {
    this.isShowNewPassword = false;
  }
  onMouseUpShowNewPassword(): void {
    this.isShowNewPassword = true;
  }
  //confirm new password
  onMouseDownShowConfirmNewPassword(): void {
    this.isShowConfirmNewPassword = false;
  }
  onMouseUpShowConfirmNewPassword(): void {
    this.isShowConfirmNewPassword = true;
  }
}

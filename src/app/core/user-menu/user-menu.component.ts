import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from "@angular/core";
import { AuthService } from "../../auth/service/auth.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatSnackBar,
  MatTableDataSource,
  MatSelect,
  MatDialogRef
} from "@angular/material";
import { UserChangepasswordDialogComponent } from "./user-changepassword-dialog/user-changepassword-dialog.component";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { url } from "inspector";

@Component({
  selector: "cdk-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;

  //currentUser = null;
  Hari;

  currentUserName: string;
  dialogRefChangepassword: MatDialogRef<UserChangepasswordDialogComponent>;

  isNewUser: string;

  @Input()
  currentUser = null;
  @HostListener("document:click", ["$event", "$event.target"])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  constructor(
    private brokerAPIService: BrokerAPIService,
    private elementRef: ElementRef,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isNewUser = localStorage.getItem("isNewUser");
    this.currentUserName = localStorage.getItem("currentUserName");
    if (this.isNewUser == "true") this.showDialog();
  }

  showDialog() {
    console.log("Open dialog");
    let dialogRef = this.dialog.open(UserChangepasswordDialogComponent, {
      data: {},
      disableClose: true,
      width: "350px",
      height: "410px"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result != undefined) {
        // this.objRow.sensorExpression = result;
        // console.log(result);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
    // this.router.navigate(['/']);
  }
  onChangePassword() {
    console.log("onChangePassword");
    this.showDialog();
  }
}

import { Component, OnInit, Input, ChangeDetectorRef, ViewRef } from "@angular/core";
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { BrokerAPIService } from "../services/brokerapi.service";
import { ISysMenu } from "../interfaces/systirot";
import { Router } from "@angular/router";
import { DialogService, LoaderState } from "../services/dialog.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  @Input()
  isVisible: boolean = true;
  visibility = "shown";

  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = "side";
  private UrlAPI_GetCurrentUser: string = "Account/GetCurrentUser";
  private arrResMenu: any = {};
  showLoader:boolean;
  subscription: Subscription;
  
  ngOnChanges() {
    this.visibility = this.isVisible ? "shown" : "hidden";
  }

  constructor(
    private media: ObservableMedia,
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    public dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {
   
    this.subscription = this.dialogService.loaderState
    .subscribe((state: LoaderState) => {
        this.showLoader = state.show;
        if (!(this.cd as ViewRef).destroyed) {
          this.cd.detectChanges()
          // do other tasks
        }
    });
  }

  ngOnInit() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentUser).subscribe(
      data => {
        // console.log("CurrentUser");
        // console.log(data);
       // localStorage.setItem("UserMenu", JSON.stringify(data));
      },
      err => {
        // กรณี error
        // console.log("Something went wrong!");
        // console.log(err);
        if (err.status == 401) {
         
          localStorage.clear();
          this.router.navigate(['/login']);
        //  console.log("token :" + localStorage.getItem("token"));
        }
      }
    );

    console.log("auth ngOnInit");

    this.media.subscribe((mediaChange: MediaChange) => {
      this.toggleView();
    });
  }
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
    //return outlet.isActivated ? outlet.activatedRoute : ''
  }

  toggleView() {
    if (this.media.isActive("gt-md")) {
      this.sideNavMode = "side";
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.media.isActive("gt-xs")) {
      this.sideNavMode = "side";
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.media.isActive("lt-sm")) {
      this.sideNavMode = "over";
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }
}

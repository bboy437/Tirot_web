import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/service/auth.service";
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import "rxjs/add/operator/map";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { request } from "http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private loading = false;
  public userForm: FormGroup;
  private UrlAPI_GetCurrentUser: string = "Account/GetCurrentUser";
  private UrlAPI_GetUserMenu: string = "SysMenu/GetUserMenu";
  private UrlAPI_GetCurrentTirotUser: string = "/Account/GetCurrentTirotUser";

  model: any = {};

  formErrors = {
    username: "",
    password: ""
  };
  validationMessages = {
    username: {
      required: "Please enter your username",
      username: "please enter your vaild username"
    },
    password: {
      required: "please enter your password",
      pattern: "The password must contain numbers and letters",
      minlength: "Please enter more than 4 characters",
      maxlength: "Please enter less than 25 characters"
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private brokerAPIService: BrokerAPIService
  ) {}
  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      username: ["", [Validators.required]],
      password: [
        "",
        [
          // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25)
        ]
      ]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  login() {
    if (this.model.username != "" && this.model.password != "") {
      this.loading = true;
      this.authService
        .login(this.model.username, this.model.password)
        .subscribe(
          datalogin => {
            if (datalogin) {
              this.getCurrentUser();
              console.log("**** Login complete ***********");
            } else {
              console.log("message " + datalogin);
              console.log("message " + this.authService.responseLogin.message);
            }
          },
          error => {
            this.loading = false;
          }
        );
    }
  }

  private getCurrentUser() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentUser).subscribe(data => {
      localStorage.setItem("currentUserName", data.userName);

      this.brokerAPIService.get(this.UrlAPI_GetCurrentTirotUser).subscribe(
        data => {
          localStorage.setItem("isNewUser", data.isNewUser);
          this.getMenu();
        },
        err => {
          console.log("Error get data api ");
        }
      );
    });
  }

  private getMenu() {
    this.brokerAPIService.get(this.UrlAPI_GetUserMenu).subscribe(data => {
      localStorage.setItem("UserMenu", JSON.stringify(data));
      this.router.navigate(["auth/real-time-monitoring/current-machine-status-list"]);
    });
  }
}

import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { DataSource } from "@angular/cdk/collections";
import { ISysRole } from "../../interfaces/productionrecords";
import {
  MatSort,
  MatPaginator,
  MatTableModule,
  MatTableDataSource
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../../app.config";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-sysrole-listing",
  templateUrl: "./sysrole-listing.component.html",
  styleUrls: ["./sysrole-listing.component.scss"]
})
export class SysRoleListingComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ["rolesName", "rolesLevel", "inActivated"];
  sysrole: ISysRole;
  sysroleList: ISysRole[];
  objRowSelected: ISysRole;
  filter: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll: string = "SysRole/GetAll";
  private Url_Detail: string = "/auth/master/sysrole-detail";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    this.dialogService.showLoader();

    try {
      let params = this.route.snapshot.paramMap;

      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll);
      this.dataSource.data = data;
      if (params.get("filter") != null) {
        this.filter = params.get("filter");
      }
      this.dataSource.filter = this.filter.toLowerCase();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

    this.dialogService.hideLoader();
  }

  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <ISysRole>row;
    this.router.navigate([
      this.Url_Detail,
      { id: this.objRowSelected.id, filter: this.filter }
    ]);
  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let url: string =
      AppConfig.settings.ReportServerUrl +
      "SysRole?" +
      "&printby=" +
      printby;
    window.open(
      url,
      "_blank",
      "location=yes,height=660px,width=1350px,scrollbars=yes,status=yes"
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(
      data: ISysRole,
      filter: string
    ): boolean {
      return (
        data.rolesName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.rolesLevel
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.inActivated
          .toString()
          .replace("true", "Inactive")
          .replace("false", "Active")
          .toLowerCase()
          .includes(filter)
      );
    };
  }
}

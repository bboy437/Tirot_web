import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../../app.config";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-standard-listing",
  templateUrl: "./standard-listing.component.html",
  styleUrls: ["./standard-listing.component.scss"]
})
export class StandardListingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = ["machine", "process", "standardName", "inActivated"];

  objRowSelected: any;
  filter: string = "";

  private UrlAPI_GetAll: string = "Standard/GetAll";
  private Url_Detail: string = "/auth/master/standard-detail";

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
      console.log(data);
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
    row.filter = this.filter;
    this.objRowSelected = <any>row;
    this.router.navigate([
      this.Url_Detail,
      { id: this.objRowSelected.id, filter: this.filter }
    ]);
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
      data: any,
      filter: string
    ): boolean {
      return (
        data.machine.machineName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.process.processName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.standardName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        // data.processType.toString().replace("PR","Production Record").replace("NR","None Production").toLowerCase().includes(filter) ||
        data.inActivated
          .toString()
          .replace("true", "Inactive")
          .replace("false", "Active")
          .toLowerCase()
          .includes(filter)
      );
    };
  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");

    let url: string =
      AppConfig.settings.ReportServerUrl +
      "Standard?" +
      "&printby=" +
      printby;
    window.open(
      url,
      "_blank",
      "location=yes,height=660px,width=1350px,scrollbars=yes,status=yes"
    );
  }
}

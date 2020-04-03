import { DialogService } from "./../../services/dialog.service";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { IGrade } from "../../interfaces/productionrecords";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../../app.config";

@Component({
  selector: "app-grade-listing",
  templateUrl: "./grade-listing.component.html",
  styleUrls: ["./grade-listing.component.scss"]
})
export class GradeListingComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = ["gradeName", "inActivated"];
  objRowSelected: IGrade;
  filter: string = "";

  private UrlAPI_GetAll: string = "Grade/GetAll";
  private Url_Detail: string = "/auth/master/grade-detail";

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {}


  async ngOnInit() {
    this.dialogService.showLoader();
    let params = this.route.snapshot.paramMap;
    try {
     let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll)
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
    this.objRowSelected = <IGrade>row;
    this.router.navigate([
      this.Url_Detail,
      { id: this.objRowSelected.id, filter: this.filter }
    ]);
  }

  btnPrintClick() {
    // let Link: string = "http://192.168.0.25:50353/reports/Tirot/GradeMasterReport?";
    // let printby : string = localStorage.getItem("currentUserName");
    // console.log("printby",printby);
    // let url: string;

    // url = Link + "printby="+printby;
    // console.log(url);
    // window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
    // return;
    let printby: string = localStorage.getItem("currentUserName");
    let url: string =
      AppConfig.settings.ReportServerUrl +
      "Grade?" +
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
      data: IGrade,
      filter: string
    ): boolean {
      return (
        data.gradeName
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

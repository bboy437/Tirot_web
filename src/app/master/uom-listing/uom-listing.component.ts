import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { IUom } from "../../interfaces/productionrecords";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../../app.config";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-uom-listing",
  templateUrl: "./uom-listing.component.html",
  styleUrls: ["./uom-listing.component.scss"]
})
export class UomListingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = ["uomName", "inActivated"];
  objRowSelected: IUom;
  filter: string = "";

  private UrlAPI_GetAll: string = "UOM/GetAll";
  private Url_Detail: string = "/auth/master/uom-detail";
  pieChartData: {
    chartType: string;
    dataTable: (string | number)[][];
    options: { title: string };
  };

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    // this.isLoadingResults = true;
    // let params = this.route.snapshot.paramMap;
    // this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(data => {
    //   this.dataSource.data = data;
    //   this.isLoadingResults = false;
    //   if(params.get("filter") != null ){
    //     this.filter = params.get("filter");
    //   }
    //   this.dataSource.filter = this.filter.toLowerCase();
    // });

    this.dialogService.showLoader();

    try {
      let params = this.route.snapshot.paramMap;
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll);

      this.dataSource.data = data;
      if (params.get("filter") != null) {
        this.filter = params.get("filter");
      }
      this.dataSource.filter = this.filter.toLowerCase();
      this.dialogService.hideLoader();
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
    this.objRowSelected = <IUom>row;
    this.router.navigate([
      this.Url_Detail,
      { id: this.objRowSelected.id, filter: this.filter }
    ]);
  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let url: string =
      AppConfig.settings.ReportServerUrl +
      "UOM?" +
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
      data: IUom,
      filter: string
    ): boolean {
      return (
        data.uomName
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

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { IDefect } from "../../interfaces/productionrecords";
import { Observable } from "rxjs/Observable";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "../../app.config";
import { DialogService } from "../../services/dialog.service";
import { reject, ninvoke } from "q";

@Component({
  selector: "app-defect-listing",
  templateUrl: "./defect-listing.component.html",
  styleUrls: ["./defect-listing.component.scss"]
})
export class DefectListingComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "defectCode",
    "defectName",
    "defectNameTH",
    "inActivated"
  ];

  objRowSelected: IDefect;
  filter: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll: string = "Defect/GetAll";
  private Url_Detail: string = "/auth/master/defect-detail";

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
    this.objRowSelected = <IDefect>row;
    this.router.navigate([
      this.Url_Detail,
      { id: this.objRowSelected.id, filter: this.filter }
    ]);
  }

  btnPrintClick() {
    // let Link: string = "http://192.168.0.25:50353/reports/Tirot/DefectMasterReport?";
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
      "Defect?" +
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
      data: IDefect,
      filter: string
    ): boolean {
      return (
        data.defectCode
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.defectName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.defectNameTH
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

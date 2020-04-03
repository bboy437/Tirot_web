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
import { IStation, InStationGroup } from "../../interfaces/productionrecords";
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
  selector: "app-station-listing",
  templateUrl: "./station-listing.component.html",
  styleUrls: ["./station-listing.component.scss"]
})
export class StationListingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns = ["stationName", "inStationGroup", "inActivated"];
  objRowSelected: IStation;
  filter: string = "";

  private UrlAPI_GetAll: string = "Station/GetAll";
  private Url_Detail: string = "/auth/master/station-detail";

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
    this.objRowSelected = <IStation>row;
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
      data: IStation,
      filter: string
    ): boolean {
      return (
        data.stationName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.inStationGroup
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

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");

    let url: string =
      AppConfig.settings.ReportServerUrl +
      "Station?" +
      "&printby=" +
      printby;
    window.open(
      url,
      "_blank",
      "location=yes,height=660px,width=1350px,scrollbars=yes,status=yes"
    );
  }
}

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Observable } from "rxjs/Observable";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/map";
import { IMachine } from "../../interfaces/productionrecords";
import { AppConfig } from "../../app.config";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-machine-listing",
  templateUrl: "./machine-listing.component.html",
  styleUrls: ["./machine-listing.component.scss"]
})
export class MachineListingComponent implements OnInit {
  isLoadingResults = true;

  dataSource = new MatTableDataSource();
  displayedColumns = [
    "machineName",
    "machineModel",
    "machineLocation",
    "inActivated"
  ];
  objRowSelected: any;
   //Props
   private props: any;
   filter: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetAll: string = "Machine/GetAll";
  private Url_Detail: string = "/auth/master/machine-detail";
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
      this.props = JSON.parse(params.get("props"));
      this.filter = this.props.filter;
    } catch (error) {
      this.props = {};
      this.filter = "";
    }
    try {
      //Check before process
      //Process
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll);
      this.dataSource.data = data;
      this.dataSource.filter = this.filter.toLowerCase();
      
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();

  }

  btnNewClick() {

    this.props.machineId = "new";
    this.props.filter = this.filter;
    this.router.navigate([this.Url_Detail, { props: JSON.stringify(this.props) }]);
  }

  rowClicked(row: any): void {
    console.log("rowClickedxxxxxxxxxxx", row);
    this.objRowSelected = <IMachine>row;

    this.props.machineId = this.objRowSelected.id;
    this.props.filter = this.filter;
    this.router.navigate([this.Url_Detail, { props: JSON.stringify(this.props) }]);
  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let url: string = AppConfig.settings.ReportServerUrl + "Machine?" + "&printby=" + printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
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
      data: IMachine,
      filter: string
    ): boolean {
      return (
        data.machineName
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.machineModel
          .toString()
          .toLowerCase()
          .includes(filter) ||
        data.machineLocation
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

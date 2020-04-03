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
import { IArticle, IProductionOrder } from "../../interfaces/productionrecords";
import { Observable } from "rxjs/Observable";
import { ProductionOrderListingDialogComponent } from "../production-order-listing/dialog/production-order-listing-dialog/production-order-listing-dialog.component";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { DataSource } from "@angular/cdk/collections";

@Component({
  selector: "app-production-order-listing",
  templateUrl: "./production-order-listing.component.html",
  styleUrls: ["./production-order-listing.component.scss"]
})
export class ProductionOrderListingComponent implements OnInit {
  // Filterorder = new this.Filterorder(undefined, '', undefined);

  isLoadingResults = true;
  objarrProductionOrderListing: any = {};
  objarrYear: any = [];
  objarrMonth: any = [];

  numYearSelected: number;
  numMonthSelected: number;
  dataSource = new MatTableDataSource();
  resourcesLoaded: boolean = true;
  displayedColumns = ["productName", "orderQty", "fgQty", "deliveryQty"];

  objRowSelected: IProductionOrder;
  filter: string = "";
  month: string = "";
  year: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");
  expandedElement: any;

  private UrlAPI_ProductGetAll: string = "Product/GetAll";
  private UrlAPI_GetProductionOrderList: string =
    "ProductionOrder/GetProductionOrderList/";
  private Url_Detail: string = "/auth/transaction/production-order-detail";
  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log("***** production order listing");
    this.setYear();
    this.setMonth();
    let params = this.route.snapshot.paramMap;

    if (params.get("month") != null) {
      this.numMonthSelected = +params.get("month");
    }

    if (params.get("year") != null) {
      this.numYearSelected = +params.get("year");
    }

    if (params.get("filter") != null) {
      this.filter = params.get("filter");
    }
    this.getProductionOrderList();
  }

  setYear() {
    var year = new Date(new Date().getFullYear() + 1, 0, 1);
    this.numYearSelected = year.getFullYear() - 1;
    for (let index = 0; index < 11; index++) {
      if (index != 0) {
        year.setFullYear(year.getFullYear() - 1);
      }

      this.objarrYear.push({ year: year.getFullYear() });
    }
    //console.log(this.objarrYear);
  }

  setMonth() {
    var month = new Date();
    this.numMonthSelected = month.getMonth() + 1;
    for (let index = 0; index < 12; index++) {
      month.setMonth(index, 15);
      this.objarrMonth.push({ month: month.getMonth() + 1 });
    }
    //console.log(this.objarrMonth);
  }

  MonthChange(monthdata) {
    this.numMonthSelected = monthdata;

    this.getProductionOrderList();
  }

  YearChange(yeardata) {
    this.numYearSelected = yeardata;
    this.getProductionOrderList();
  }

  private getProductionOrderList() {
    this.isLoadingResults = true;

    this.brokerAPIService
      .get(
        this.UrlAPI_GetProductionOrderList +
          this.numMonthSelected +
          "," +
          this.numYearSelected
      )
      .subscribe(data => {
        console.log(data);
        this.dataSource.data = data;
        this.objarrProductionOrderListing = data;

        this.dataSource.filter = this.filter.toLowerCase();
        this.isLoadingResults = false;
      });
  }

  btnNewClick() {
    this.router.navigate([
      this.Url_Detail,
      {
        id: "new",
        filter: this.filter,
        month: this.numMonthSelected,
        year: this.numYearSelected
      }
    ]);
  }

  rowClicked(row: any): void {
    row.filter = this.filter;
    row.month = this.numMonthSelected;
    row.year = this.numYearSelected;
    const dialogRef = this.dialog.open(ProductionOrderListingDialogComponent, {
      data: this.objRowSelected = row

      // disableClose: this.router.navigate9([this.Url_Detail,this.objRowSelected.id])
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
  }

  btnInfoClick(index: number, id: number) {
    let objProductionOrderListing = this.objarrProductionOrderListing.find(
      x => x.id === id
    );
    const dialogRef = this.dialog.open(ProductionOrderListingDialogComponent, {
      data: objProductionOrderListing,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

import {
  Component, OnInit, ViewEncapsulation,
  Input, Output, EventEmitter, ViewChild, AfterViewInit
} from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { DataSource } from '@angular/cdk/collections';
import { ICustomer } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableModule,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss']
})

export class CustomerListingComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource();
  displayedColumns = ['customerCode', 'customerName', 'customerShortName', 'contractPerson', 'phoneNo', 'faxNo', 'emailAddress'];
  objRowSelected: ICustomer;
  filter: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetAll: string = "Customer/GetAll";
  private Url_Detail: string = "/auth/master/customer-detail";

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  async ngOnInit() {

    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll)
      this.dataSource.data = data;
      if (params.get("filter") != null) {
        this.filter = params.get("filter");
      }
      // this.dataSource.filter = this.filter.toLowerCase();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  btnCreateClick() {

    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <ICustomer>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter }]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.filterPredicate = function (data: ICustomer, filter: string): boolean {
    //   return (
    //     data.customerCode.toString().toLowerCase().includes(filter) ||
    //     data.customerName.toString().toLowerCase().includes(filter) ||
    //     data.customerShortName.toString().toLowerCase().includes(filter) ||
    //     data.contractPerson.toString().toLowerCase().includes(filter) ||
    //     data.phoneNo.toString().toLowerCase().includes(filter) ||
    //     data.faxNo.toString().toLowerCase().includes(filter) ||
    //     data.emailAddress.toString().toLowerCase().includes(filter)
    //   );
    // };

  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let url: string = AppConfig.settings.ReportServerUrl + "Customer?" + "&printby=" + printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
  }

}



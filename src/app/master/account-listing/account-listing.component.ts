import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map'
import { IAccount } from '../../interfaces/productionrecords';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-account-listing',
  templateUrl: './account-listing.component.html',
  styleUrls: ['./account-listing.component.scss']
})
export class AccountListingComponent implements OnInit {


  dataSource = new MatTableDataSource();
  displayedColumns = ['userName', 'prefixName', 'firstName', 'lastName', 'userRole', 'inActivated'];
  objRowSelected: any;
  filter: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetCurrentUser: string = "Account/GetListAllTirotUser";
  private Url_Detail: string = "/auth/master/account-detail";
  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  async ngOnInit() {
    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentUser)
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
    //  console.log(row);
    this.objRowSelected = row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.userName, filter: this.filter, objRowSelected: JSON.stringify(this.objRowSelected) }]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function (data: IAccount, filter: string): boolean {
      return (
        data.userName.toString().toLowerCase().includes(filter) ||
        data.prefixName.toString().toLowerCase().includes(filter) ||
        data.firstName.toString().toLowerCase().includes(filter) ||
        data.lastName.toString().toLowerCase().includes(filter) ||
        data.userRole.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true", "Inactive").replace("false", "Active").toLowerCase().includes(filter)
      );
    };
  }

  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let url: string = AppConfig.settings.ReportServerUrl + "Account?" + "&printby=" + printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
  }

}

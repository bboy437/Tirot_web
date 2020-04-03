import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map'
import { ICountry } from '../../interfaces/productionrecords';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-country-listing',
  templateUrl: './country-listing.component.html',
  styleUrls: ['./country-listing.component.scss']
})
export class CountryListingComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns = ['countryCode','countryName','inActivated'];
  objRowSelected: ICountry;
  filter:string="";
   
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll: string = "Country/GetAll";
  private Url_Detail: string = "/auth/master/country-detail";
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
            if(params.get("filter") != null ){
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
        console.log("rowClicked",row);
        this.objRowSelected = <ICountry>row;
        this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter } ]);
         
      }
      
      applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
      }

      ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data: ICountry, filter: string): boolean {
          return (
            data.countryCode.toString().toLowerCase().includes(filter) ||
            data.countryName.toString().toLowerCase().includes(filter) ||
            data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
          );
        };
      }

      btnPrintClick(){
        let printby: string = localStorage.getItem("currentUserName");
        let url: string = AppConfig.settings.ReportServerUrl + "Country?" + "&printby=" + printby;
        window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
      }
  
}

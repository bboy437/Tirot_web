import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IArticle } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.scss']
})

export class ArticleListingComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['articleName', 'inActivated'];
  objRowSelected: IArticle;
  filter: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetAll: string = "Article/GetAll";
  private Url_Detail: string = "/auth/master/article-detail";


  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  async ngOnInit() {

    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll);
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

  imageToShow: any;

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IArticle>row;
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
    this.dataSource.filterPredicate = function (data: IArticle, filter: string): boolean {
      return (
        data.articleName.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true", "Inactive").replace("false", "Active").toLowerCase().includes(filter)
      );
    };
  }

  btnPrintClick() {

    let printby: string = localStorage.getItem("currentUserName");

    let url: string = AppConfig.settings.ReportServerUrl + "Article?" + "&printby=" + printby;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');

  }

}

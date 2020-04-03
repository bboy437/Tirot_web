import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';

@Component({
  selector: 'app-histogram-weigth-analysis-report',
  templateUrl: './histogram-weigth-analysis-report.component.html',
  styleUrls: ['./histogram-weigth-analysis-report.component.scss']
})
export class HistogramWeigthAnalysisReportComponent implements OnInit {
  isLoadingResults = false;
  objarrYear: any = [];
  objarrMonth: any = [];
  arrobjProduct: any = [];
  numYearSelected: number;
  numMonthSelected: number;
  intProductID:number;
  IsFront:string;
  InPosition:string;
  inBWMonth: number;
  private UrlAPI_GetAllProduct: string = "Product/GetAllActive";
  constructor(private brokerAPIService: BrokerAPIService) { }

  ngOnInit() {
    this.setYear();
    this.setMonth();
    this.setSelectProduct();
    this.IsFront = 'true';
    this.InPosition = 'A';
    this.inBWMonth = 1;
  }

  setSelectProduct() {
    this.isLoadingResults = true;

    this.brokerAPIService.get(this.UrlAPI_GetAllProduct).subscribe(
      data => {
        
        if(data != null)
        {
          this.arrobjProduct = data;
          this.intProductID = data[0].id;
          console.log("this.intProductID",this.intProductID);
          
        }
       
        this.isLoadingResults = false;
      }
    );
  }


  setYear() {
    var year = new Date();
    this.numYearSelected = year.getFullYear();
    for (let index = 0; index < 11; index++) {
      if (index != 0) {
        year.setFullYear(year.getFullYear() - 1);
      }

      this.objarrYear.push({ year: year.getFullYear() });
    }
  }

  setMonth() {
    var month = new Date();
    this.numMonthSelected = month.getMonth() + 1;
    for (let index = 0; index < 12; index++) {
      month.setMonth(index, 15);
      this.objarrMonth.push({
        month: month.getMonth() + 1,
        name: month.getMonth() + 1
      });
    }
  }

  MonthChange(monthdata) {
    this.numMonthSelected = monthdata;
    let datemonth: Date = new Date();
    datemonth.setMonth(monthdata - 1, 15);
    console.log(this.numMonthSelected);
  }

  YearChange(yeardata) {
    this.numYearSelected = yeardata;
    let datemonth: Date = new Date();
    datemonth.setFullYear(yeardata, this.numMonthSelected - 1, 15);
    console.log(this.numYearSelected);
    
  }

  IsFrontChange(strIsFront) {
   
  }

  InPositionChange(strInPosition) {
   
  }

  inBWMonthChange(strIInBWMonth) {
   
  }



  ddlProduct_SelectIndexChange(data){
    console.log("data",data)
    this.intProductID = data;
    // this.setSelectProduct();
  }

}

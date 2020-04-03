import { Component, OnInit, SimpleChange, Input } from '@angular/core';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { BrokerAPIService } from '../../../services/brokerapi.service';


@Component({
  selector: 'app-histogram-weigth-analysis',
  templateUrl: './histogram-weigth-analysis.component.html',
  styleUrls: ['./histogram-weigth-analysis.component.scss']
})
export class HistogramWeigthAnalysisComponent implements OnInit {
  @Input() ProductId: string;
  @Input() Year: string;
  @Input() Month: string;
  @Input() IsFront: string;
  @Input() InPosition: string;
  @Input() inBWMonth: string;
  UrlAPI_GetHistogramWeigthAnalysis: string = "Visualization/GetHistogramWeigthAnalysis/";
  dataTable: any = [];
  ChartData: any = {};
  objDataHistogramWeigthAnalysis: any = {};



  constructor(private brokerAPIService: BrokerAPIService, ) { }

  ngOnInit() {
    console.log("inBWMonth",this.inBWMonth);
    
    this.objDataHistogramWeigthAnalysis = {};
    this.getAPIHistogramWeigthAnalysis();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log("changes", changes);
    this.getAPIHistogramWeigthAnalysis();

  }





  private getAPIHistogramWeigthAnalysis() {
    
    this.brokerAPIService.get(this.UrlAPI_GetHistogramWeigthAnalysis + this.ProductId + "," + this.Year + "," + this.Month + "," + this.IsFront + "," + this.InPosition + "," + this.inBWMonth).subscribe(data => {
      console.log("UrlAPI_GetHistogramWeigthAnalysis", data);
      if (data.histogramData == null) {
        this.objDataHistogramWeigthAnalysis = {};
        let strJsonhistogramData = JSON.stringify(data.histogramData).replace(/\"/g, '').replace('{', '').replace('}', '');
        let arrJsonhistogramData: string[] = strJsonhistogramData.split(',');
        let DataTable: any = [];
        DataTable.push(['Element', 'Value', { role: 'style' }]);
        arrJsonhistogramData.sort((one, two) => (one > two ? -1 : 1));
        console.log("arrJsonhistogramData", arrJsonhistogramData);
        arrJsonhistogramData.forEach(element => {
          let objData = element.split(':');
          DataTable.push([Number(objData[0]).toFixed(3), Number(objData[1]), 'color: rgb(142, 164, 226);stroke-color: black; stroke-width: 1']);
        });

        this.ChartData = {
          chartType: 'ColumnChart',
          dataTable: DataTable,

          options: {
            sortColumn: 0,
            sortAscending: false,
            bar: { 'groupWidth': "100%" },
            chartArea: { top: 15, 'width': '90%', 'height': '75%' },
            legend: { 'position': 'none' },
            height: 280,
            hAxis: {
              direction: -1,
              slantedText: true,
              slantedTextAngle: 45 // here you can even use 180
            }

          },
        };
      }
      else {
        // if (data != null && data.histogramData != null) {
        this.objDataHistogramWeigthAnalysis = data;
        let strJsonhistogramData = JSON.stringify(data.histogramData).replace(/\"/g, '').replace('{', '').replace('}', '');
        let arrJsonhistogramData: string[] = strJsonhistogramData.split(',');
        let DataTable: any = [];
        DataTable.push(['Element', 'Value', { role: 'style' }]);
        arrJsonhistogramData.sort((one, two) => (one > two ? -1 : 1));
        console.log("arrJsonhistogramData", arrJsonhistogramData);
        arrJsonhistogramData.forEach(element => {
          let objData = element.split(':');
          DataTable.push([Number(objData[0]).toFixed(3), Number(objData[1]), 'color: rgb(142, 164, 226);stroke-color: black; stroke-width: 1']);
        });

        this.ChartData = {
          chartType: 'ColumnChart',
          dataTable: DataTable,

          options: {
            sortColumn: 0,
            sortAscending: false,
            bar: { 'groupWidth': "100%" },
            chartArea: { top: 15, 'width': '90%', 'height': '75%' },
            legend: { 'position': 'none' },
            height: 280,
            hAxis: {
              direction: -1,
              slantedText: true,
              slantedTextAngle: 45 // here you can even use 180
            }

          },
        };
      }

    });
  }

  public ready(event: ChartReadyEvent) {
    //console.log(event);
    //  this.dataChange();
    // let dataTable = this.linechart.wrapper.getDataTable();
    // console.log("dataTable", dataTable);

  }

  public error(event: ChartErrorEvent) {
    console.log(event);
  }


}

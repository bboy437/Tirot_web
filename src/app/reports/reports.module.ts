import { NgModule } from "@angular/core";
import {
  MatCardModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReportsRouterModule } from "./reports.routes";
import { CoreModule } from "../core/core.module";
import { TextMaskModule } from 'angular2-text-mask';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { HistogramWeigthAnalysisReportComponent } from './histogram-weigth-analysis-report/histogram-weigth-analysis-report.component';
import { HistogramWeigthAnalysisComponent } from '../reports/reports-charts/histogram-weigth-analysis/histogram-weigth-analysis.component';
import { ReportDailyproductionComponent } from './report-dailyproduction/report-dailyproduction.component';
import { ProductionOrderStatusComponent } from './production-order-status/production-order-status.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { ProductionLeadTimeComponent } from './production-lead-time/production-lead-time.component';
import { WipReportComponent } from './wip-report/wip-report.component';
import { ProductionPlanComponent } from './production-plan/production-plan.component';
import { LengthLossReportComponent } from './length-loss-report/length-loss-report.component';
import { DailyPackingListReportComponent } from './daily-packing-list-report/daily-packing-list-report.component';
import { MonthlyPerformanceReportComponent } from './monthly-performance-report/monthly-performance-report.component';
import { ProductionOrderClosuredSummaryReportComponent } from './production-order-closured-summary-report/production-order-closured-summary-report.component';
import { ChecktempandwidthsReportComponent } from './checktempandwidths-report/checktempandwidths-report.component';
import { CheckStandardReportComponent } from './check-standard-report/check-standard-report.component';
@NgModule({
  imports: [
    MatCardModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    CoreModule,
    ReportsRouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TextMaskModule,
    ColorPickerModule,
    Ng2GoogleChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  declarations: [
  HistogramWeigthAnalysisReportComponent,
  HistogramWeigthAnalysisComponent,
  ReportDailyproductionComponent,
  ProductionOrderStatusComponent,
  ProductionLeadTimeComponent,
  WipReportComponent,
  ProductionPlanComponent,
  LengthLossReportComponent,
  DailyPackingListReportComponent,
  MonthlyPerformanceReportComponent,
  ProductionOrderClosuredSummaryReportComponent,
  ChecktempandwidthsReportComponent,
  CheckStandardReportComponent],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  entryComponents: []
})
export class ReportsModule { }

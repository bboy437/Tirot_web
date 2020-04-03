import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistogramWeigthAnalysisReportComponent } from './histogram-weigth-analysis-report/histogram-weigth-analysis-report.component';
import { ReportDailyproductionComponent } from './report-dailyproduction/report-dailyproduction.component';
import { ProductionOrderStatusComponent } from './production-order-status/production-order-status.component';
import { ProductionLeadTimeComponent } from './production-lead-time/production-lead-time.component';
import { WipReportComponent } from './wip-report/wip-report.component';
import { ProductionPlanComponent } from './production-plan/production-plan.component';
import { LengthLossReportComponent } from './length-loss-report/length-loss-report.component';
import { DailyPackingListReportComponent } from './daily-packing-list-report/daily-packing-list-report.component';
import { MonthlyPerformanceReportComponent } from './monthly-performance-report/monthly-performance-report.component';
import { ProductionOrderClosuredSummaryReportComponent } from './production-order-closured-summary-report/production-order-closured-summary-report.component';
import { ChecktempandwidthsReportComponent } from './checktempandwidths-report/checktempandwidths-report.component';
import { CheckStandardReportComponent } from './check-standard-report/check-standard-report.component';

const pagesRoutes: Routes = [
  { path: 'checktempandwidths-report', component: ChecktempandwidthsReportComponent, data: { animation: 'checktempandwidths-report' } },
  { path: 'histogram-weigth-analysis-report', component: HistogramWeigthAnalysisReportComponent, data: { animation: 'histogram-weigth-analysis-report' } },
  { path: 'production-order-status', component: ProductionOrderStatusComponent, data: { animation: 'production-order-status' } },
  { path: 'production-lead-time', component: ProductionLeadTimeComponent, data: { animation: 'production-lead-time' } },
  { path: 'wip-report', component: WipReportComponent, data: { animation: 'wip-report' } },
  { path: 'report-dailyproduction', component: ReportDailyproductionComponent, data: { animation: 'report-dailyproduction' } },
  { path: 'production-plan', component: ProductionPlanComponent, data: { animation: 'production-plan' } },
  { path: 'length-loss-report', component: LengthLossReportComponent, data: { animation: 'length-loss-report' } },
  { path: 'daily-packing-list-report', component: DailyPackingListReportComponent, data: { animation: 'daily-packing-list-report' } },
  { path: 'monthly-performance-report', component: MonthlyPerformanceReportComponent, data: { animation: 'monthly-performance-report' } },
  { path: 'production-order-closured-summary-report', component: ProductionOrderClosuredSummaryReportComponent, data: { animation: 'production-order-closured-summary-report' }},
  { path: 'check-standard-report', component: CheckStandardReportComponent, data: { animation: 'check-standard-report' } },
];

  
@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule,
  ]
})
export class ReportsRouterModule { }
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
import { RealTimeMonitoringRouterModule } from "./real-time-monitoring.routes";
import { CoreModule } from "../core/core.module";
import { TextMaskModule } from 'angular2-text-mask';
import { ColorPickerModule } from 'ngx-color-picker';
import { RealTimeMonitoringComponent } from './real-time-monitoring/real-time-monitoring.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartCurrentPercentAvailabilityComponent } from './charts/chart-current-percent-availability/chart-current-percent-availability.component';
import { NeotexDashboardComponent } from './neotex-dashboard/neotex-dashboard.component';
import { TimelineChartComponent } from './charts/timeline-chart/timeline-chart.component';
import { TimelineCurrentMachineAvailableComponent } from './charts/timeline-current-machine-available/timeline-current-machine-available.component';
import { TableCurrentProductionComponent } from './charts/table-current-production/table-current-production.component';
import { LineChartOvenStatusComponent } from './charts/line-chart-oven-status/line-chart-oven-status.component';
import { TimelineMachineHistoryStatusComponent } from './charts/timeline-machine-history-status/timeline-machine-history-status.component';
import { MachineHistoryStatusComponent } from './machine-history-status/machine-history-status.component';
import { MachineDailyLogComponent } from './machine-daily-log/machine-daily-log.component';
import { MachineSummaryStatusComponent } from './machine-summary-status/machine-summary-status.component';
import { MachineStatusItemComponent } from './charts/machine-status-item/machine-status-item.component';
import { CurrentMachineStatusListComponent, SafePipe } from './current-machine-status-list/current-machine-status-list.component';
//import { HistogramWeigthAnalysisComponent } from './charts/histogram-weigth-analysis/histogram-weigth-analysis.component';
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
    RealTimeMonitoringRouterModule,
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

    MatTooltipModule,
  ],
  declarations: [
    SafePipe,
    RealTimeMonitoringComponent,
    ChartCurrentPercentAvailabilityComponent,
    NeotexDashboardComponent,
    TimelineChartComponent,
    TimelineCurrentMachineAvailableComponent,
    TableCurrentProductionComponent,
    LineChartOvenStatusComponent,
    TimelineMachineHistoryStatusComponent,
    MachineHistoryStatusComponent,
    MachineDailyLogComponent,
    MachineSummaryStatusComponent,
    MachineStatusItemComponent,
    CurrentMachineStatusListComponent,
    // HistogramWeigthAnalysisComponent
  ],
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
    //  HistogramWeigthAnalysisComponent
  ],
  providers: [],
  entryComponents: []
})
export class RealTimeMonitoringModule { }

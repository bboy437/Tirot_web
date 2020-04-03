import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealTimeMonitoringComponent } from './real-time-monitoring/real-time-monitoring.component';
import { NeotexDashboardComponent } from './neotex-dashboard/neotex-dashboard.component';
import { MachineHistoryStatusComponent } from './machine-history-status/machine-history-status.component';
import { MachineDailyLogComponent } from './machine-daily-log/machine-daily-log.component';
import { MachineSummaryStatusComponent } from './machine-summary-status/machine-summary-status.component';
import { CurrentMachineStatusListComponent } from './current-machine-status-list/current-machine-status-list.component';

const pagesRoutes: Routes = [
  { path: '', component: RealTimeMonitoringComponent, data: { animation: 'real-time-monitoring' } },
  { path: 'neotex-dashboard', component: NeotexDashboardComponent, data: { animation: 'neotex-dashboard' } },
  { path: 'machine-summary-status', component: MachineSummaryStatusComponent, data: { animation: 'machine-summary-status' } },
  { path: 'current-machine-status-list', component: CurrentMachineStatusListComponent, data: { animation: 'current-machine-status-list' } },
  { path: 'machine-daily-log', component: MachineDailyLogComponent, data: { animation: 'machine-daily-log' } },
  { path: 'machine-history-status', component: MachineHistoryStatusComponent, data: { animation: 'machine-history-status' } },
];
  
@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule,
  ]
})
export class RealTimeMonitoringRouterModule { }
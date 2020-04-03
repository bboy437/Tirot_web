import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { LazyLoadModule } from "./lazy-load/lazy-load.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { AuthGuardService } from "./auth/service/auth-guard.service";
import { AuthService } from "./auth/service/auth.service";
import { routing } from "./app.routing";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { GlobalsValue } from "../app/globals.value";
import { BrokerAPIService } from "./services/brokerapi.service";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmDeleteDialogComponent } from "./dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "./dialogs/message-dialog/message-dialog.component";
import { HubConnectionService } from "./services/hubconnnection.service";

// import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CalendarModule } from "angular-calendar";
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
//import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { TextMaskModule } from "angular2-text-mask";
import { DatePipe } from "@angular/common";
import { AngularFontAwesomeModule } from "angular-font-awesome";
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
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatRadioModule
} from "@angular/material";
import { MomentUtcDateAdapter } from "./moment-utc-date-adapter";
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { AppConfig } from "./app.config";
import { from } from "rxjs/observable/from";
import { DialogService } from "./services/dialog.service";
import { ErrorDialogComponent } from "./dialogs/error-dialog/error-dialog.component";
import { ConfirmDialogComponent } from "./dialogs/confirm-dialog/confirm-dialog.component";
import { ConfirmCancelorderDialogComponent } from './dialogs/confirm-cancelorder-dialog/confirm-cancelorder-dialog.component';
// import { HistogramWeigthAnalysisReportComponent } from './reports/histogram-weigth-analysis-report/histogram-weigth-analysis-report.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteDialogComponent,
    MessageDialogComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent,
    ConfirmCancelorderDialogComponent
    // HistogramWeigthAnalysisReportComponent,
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    LazyLoadModule,
    CoreModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    // NgbModalModule.forRoot(),
    routing,
    HttpModule,
    HttpClientModule,
    FlexLayoutModule,

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
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TextMaskModule,
    MatRadioModule
  ],
  providers: [
    DatePipe,
    AuthGuardService,
    AuthService,
    GlobalsValue,
    BrokerAPIService,
    DialogService,
    HubConnectionService,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    }
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent,
    MessageDialogComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent,
    ConfirmCancelorderDialogComponent

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

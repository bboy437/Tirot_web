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
  MatExpansionModule
} from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MasterRouterModule } from "./master.routes";
import { CoreModule } from "../core/core.module";
import { ProductsListingComponent } from "./products-listing/products-listing.component";
import { ProductsDetailComponent } from "./products-detail/products-detail.component";
import { RawMaterialListingComponent } from "./raw-material-listing/raw-material-listing.component";
import { RawMaterialDetailComponent } from "./raw-material-detail/raw-material-detail.component";
import { ArticleListingComponent } from "./article-listing/article-listing.component";
import { ArticleDetailComponent } from "./article-detail/article-detail.component";
import { ArticleDialogComponent } from "./article-detail/dialogs/article-dialog/article-dialog.component";
import { ShiftSchduleListingComponent } from "./shift-schdule-listing/shift-schdule-listing.component";
import { ShiftSchduleDetailComponent } from "./shift-schdule-detail/shift-schdule-detail.component";
import { CustomerListingComponent } from "./customer-listing/customer-listing.component";
import { CustomerDetailComponent } from "./customer-detail/customer-detail.component";
import { TeamListingComponent } from "./team-listing/team-listing.component";
import { TeamDetailComponent } from "./team-detail/team-detail.component";
import { ProcessListingComponent } from "./process-listing/process-listing.component";
import { ProcessDetailComponent } from "./process-detail/process-detail.component";
import { StationListingComponent } from "./station-listing/station-listing.component";
import { StationDetailComponent } from "./station-detail/station-detail.component";
import { StationGroupListingComponent } from "./stationgroup-listing/stationgroup-listing.component";
import { StationGroupDetailComponent } from "./stationgroup-detail/stationgroup-detail.component";
import { SysRoleListingComponent } from "./sysrole-listing/sysrole-listing.component";
import { SysRoleDetailComponent } from "./sysrole-detail/sysrole-detail.component";
import { TextMaskModule } from "angular2-text-mask";
import { DefectListingComponent } from "./defect-listing/defect-listing.component";
import { DefectDetailComponent } from "./defect-detail/defect-detail.component";
import { GradeListingComponent } from "./grade-listing/grade-listing.component";
import { GradeDetailComponent } from "./grade-detail/grade-detail.component";
import { UomListingComponent } from "./uom-listing/uom-listing.component";
import { UomDetailComponent } from "./uom-detail/uom-detail.component";
import { ColorPickerModule } from "ngx-color-picker";
import { MachineCheckListListingComponent } from "./machine-check-list-listing/machine-check-list-listing.component";
import { MachineCheckListDetailComponent } from "./machine-check-list-detail/machine-check-list-detail.component";
import { AccountListingComponent } from "./account-listing/account-listing.component";
import { AccountDetailComponent } from "./account-detail/account-detail.component";
import { CountryListingComponent } from "./country-listing/country-listing.component";
import { CountryDetailComponent } from "./country-detail/country-detail.component";
import { TirotedgeListingComponent } from "./tirotedge-listing/tirotedge-listing.component";
import { TirotedgeDetailComponent } from "./tirotedge-detail/tirotedge-detail.component";
import { StandardListingComponent } from "./standard-listing/standard-listing.component";
import { StandardDetailComponent } from "./standard-detail/standard-detail.component";
import { MachineListingComponent } from "./machine-listing/machine-listing.component";
import { MachineDetailComponent } from "./machine-detail/machine-detail.component";
import { MachineDialogComponent } from "./machine-detail/machine-dialog/machine-dialog.component";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { SensorDetailComponent } from "./sensor-detail/sensor-detail.component";
import { SensorExpressionDialogComponent } from "./sensor-detail/sensor-expression-dialog/sensor-expression-dialog.component";

@NgModule({
  imports: [
    Ng2GoogleChartsModule,
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
    MasterRouterModule,
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
    MatExpansionModule
  ],
  declarations: [
    ProductsListingComponent,
    ProductsDetailComponent,
    RawMaterialListingComponent,
    RawMaterialDetailComponent,
    ArticleListingComponent,
    ArticleDetailComponent,
    ArticleDialogComponent,
    ShiftSchduleListingComponent,
    ShiftSchduleDetailComponent,
    CustomerListingComponent,
    CustomerDetailComponent,
    TeamListingComponent,
    TeamDetailComponent,
    ProcessListingComponent,
    ProcessDetailComponent,
    StationListingComponent,
    StationDetailComponent,
    StationGroupListingComponent,
    StationGroupDetailComponent,
    SysRoleListingComponent,
    SysRoleDetailComponent,
    DefectListingComponent,
    DefectDetailComponent,
    GradeListingComponent,
    GradeDetailComponent,
    UomListingComponent,
    UomDetailComponent,
    MachineCheckListListingComponent,
    MachineCheckListDetailComponent,
    AccountListingComponent,
    AccountDetailComponent,
    CountryListingComponent,
    CountryDetailComponent,
    TirotedgeListingComponent,
    TirotedgeDetailComponent,
    StandardListingComponent,
    StandardDetailComponent,
    MachineDetailComponent,
    MachineListingComponent,
    SensorDetailComponent,
    MachineDialogComponent,
    SensorExpressionDialogComponent
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
    MatProgressSpinnerModule
  ],
  providers: [],
  entryComponents: [
    ArticleDialogComponent,
    MachineDialogComponent,
    SensorExpressionDialogComponent
  ]
})
export class MasterModule {}

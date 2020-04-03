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
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MAT_DATE_LOCALE,
  MatFormFieldModule,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatRadioModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatExpansionModule
} from "@angular/material";
import { TextMaskModule } from "angular2-text-mask";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TransactionRouterModule } from "./transaction.routes";
import { CoreModule } from "../core/core.module";
import { ProductionOrderListingComponent } from "./production-order-listing/production-order-listing.component";
import { ProductionOrderDetailComponent } from "./production-order-detail/production-order-detail.component";
import { ProductionOrderDetailDialogComponent } from "./production-order-detail/dialog/production-order-detail-dialog/production-order-detail-dialog.component";
import { ProductionOrderListingDialogComponent } from "./production-order-listing/dialog/production-order-listing-dialog/production-order-listing-dialog.component";
import { ProductionPlaningComponent } from "./production-planing/production-planing.component";
import { CalendarModule } from "angular-calendar";
import { ProductionPlaningEntryComponent } from "./production-planing-entry/production-planing-entry.component";
import { ProductionOrderClosureComponent } from "./production-order-closure/production-order-closure.component";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { MasterRouterModule } from "../master/master.routes";
import { ColorPickerModule } from "ngx-color-picker";
import { ProductionOrderClosureDetailDialogComponent } from "./production-order-closure/production-order-closure-detail-dialog/production-order-closure-detail-dialog.component";
import { ProductionPlaningViewComponent } from './production-planing-entry/dialog/production-planing-view/production-planing-view.component';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CalendarModule.forRoot(),
    // NgbModalModule.forRoot(),
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
    TransactionRouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    TextMaskModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatFormFieldModule

    // Ng2GoogleChartsModule,
    // MasterRouterModule,
    // MatTabsModule,
    // ColorPickerModule,
    // MatExpansionModule
  ],
  declarations: [
    ProductionOrderListingComponent,
    ProductionOrderDetailComponent,
    ProductionOrderListingDialogComponent,
    ProductionOrderDetailDialogComponent,
    ProductionPlaningComponent,
    ProductionPlaningEntryComponent,
    ProductionOrderClosureComponent,
    ProductionOrderClosureDetailDialogComponent,
    ProductionPlaningViewComponent
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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  providers: [],
  entryComponents: [
    ProductionOrderListingDialogComponent,
    ProductionOrderDetailDialogComponent,
    ProductionOrderClosureDetailDialogComponent,
    ProductionPlaningViewComponent
  ]
})
export class TransactionModule {}

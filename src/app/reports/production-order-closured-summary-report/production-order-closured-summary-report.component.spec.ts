import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderClosuredSummaryReportComponent } from './production-order-closured-summary-report.component';

describe('ProductionOrderClosuredSummaryReportComponent', () => {
  let component: ProductionOrderClosuredSummaryReportComponent;
  let fixture: ComponentFixture<ProductionOrderClosuredSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderClosuredSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderClosuredSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

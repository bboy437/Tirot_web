import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPerformanceReportComponent } from './monthly-performance-report.component';

describe('MonthlyPerformanceReportComponent', () => {
  let component: MonthlyPerformanceReportComponent;
  let fixture: ComponentFixture<MonthlyPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

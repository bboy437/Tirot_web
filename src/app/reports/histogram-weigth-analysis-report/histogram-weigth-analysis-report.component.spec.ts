import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramWeigthAnalysisReportComponent } from './histogram-weigth-analysis-report.component';

describe('HistogramWeigthAnalysisReportComponent', () => {
  let component: HistogramWeigthAnalysisReportComponent;
  let fixture: ComponentFixture<HistogramWeigthAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramWeigthAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWeigthAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

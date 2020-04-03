import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramWeigthAnalysisComponent } from './histogram-weigth-analysis.component';

describe('HistogramWeigthAnalysisComponent', () => {
  let component: HistogramWeigthAnalysisComponent;
  let fixture: ComponentFixture<HistogramWeigthAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramWeigthAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWeigthAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

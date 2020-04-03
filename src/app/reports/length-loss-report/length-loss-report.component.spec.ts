import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthLossReportComponent } from './length-loss-report.component';

describe('LengthLossReportComponent', () => {
  let component: LengthLossReportComponent;
  let fixture: ComponentFixture<LengthLossReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LengthLossReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthLossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

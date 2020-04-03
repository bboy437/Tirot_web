import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyproductionComponent } from './report-dailyproduction.component';

describe('ReportDailyproductionComponent', () => {
  let component: ReportDailyproductionComponent;
  let fixture: ComponentFixture<ReportDailyproductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDailyproductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDailyproductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPackingListReportComponent } from './daily-packing-list-report.component';

describe('DailyPackingListReportComponent', () => {
  let component: DailyPackingListReportComponent;
  let fixture: ComponentFixture<DailyPackingListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPackingListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPackingListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartOvenStatusComponent } from './line-chart-oven-status.component';

describe('LineChartOvenStatusComponent', () => {
  let component: LineChartOvenStatusComponent;
  let fixture: ComponentFixture<LineChartOvenStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartOvenStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartOvenStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

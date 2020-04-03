import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCurrentPercentAvailabilityComponent } from './chart-current-percent-availability.component';

describe('ChartCurrentPercentAvailabilityComponent', () => {
  let component: ChartCurrentPercentAvailabilityComponent;
  let fixture: ComponentFixture<ChartCurrentPercentAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartCurrentPercentAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCurrentPercentAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

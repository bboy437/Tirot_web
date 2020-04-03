import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeotexDashboardComponent } from './neotex-dashboard.component';

describe('NeotexDashboardComponent', () => {
  let component: NeotexDashboardComponent;
  let fixture: ComponentFixture<NeotexDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeotexDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeotexDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

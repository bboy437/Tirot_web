import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLeadTimeComponent } from './production-lead-time.component';

describe('ProductionLeadTimeComponent', () => {
  let component: ProductionLeadTimeComponent;
  let fixture: ComponentFixture<ProductionLeadTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionLeadTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLeadTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

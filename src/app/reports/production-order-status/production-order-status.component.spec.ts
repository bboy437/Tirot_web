import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderStatusComponent } from './production-order-status.component';

describe('ProductionOrderStatusComponent', () => {
  let component: ProductionOrderStatusComponent;
  let fixture: ComponentFixture<ProductionOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

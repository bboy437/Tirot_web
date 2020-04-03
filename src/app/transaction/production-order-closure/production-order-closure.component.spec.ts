import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderClosureComponent } from './production-order-closure.component';

describe('ProductionOrderClosureComponent', () => {
  let component: ProductionOrderClosureComponent;
  let fixture: ComponentFixture<ProductionOrderClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

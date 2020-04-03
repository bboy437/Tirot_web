import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderClosureDetailDialogComponent } from './production-order-closure-detail-dialog.component';

describe('ProductionOrderClosureDetailDialogComponent', () => {
  let component: ProductionOrderClosureDetailDialogComponent;
  let fixture: ComponentFixture<ProductionOrderClosureDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderClosureDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderClosureDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

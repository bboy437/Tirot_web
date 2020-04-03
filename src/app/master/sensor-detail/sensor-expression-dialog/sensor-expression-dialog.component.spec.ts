import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SensorExpressionDialogComponent } from "./sensor-expression-dialog.component";

describe("SensorExpressionDialogComponent", () => {
  let component: SensorExpressionDialogComponent;
  let fixture: ComponentFixture<SensorExpressionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SensorExpressionDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorExpressionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";

@Component({
  selector: "app-sensor-expression-dialog",
  templateUrl: "./sensor-expression-dialog.component.html",
  styleUrls: ["./sensor-expression-dialog.component.scss"]
})
export class SensorExpressionDialogComponent implements OnInit {
  @ViewChild("inputTextExpression") inputTextExpression: ElementRef;

  dataArr = [
    {
      text: "1+5*("
    },
    {
      category: "S",
      text: "5"
    },
    {
      text: "+"
    },
    {
      category: "R",
      text: "15"
    },
    {
      text: ")"
    }
  ];
  constructor(
    public dialogRef: MatDialogRef<SensorExpressionDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.formulaText = data.formulaText;
  }

  ngOnInit() {}
  ngAfterViewInit() {}

  onClickOK(): void {
    try {
      eval(this.formulaText);
      this.dialogRef.close(this.formulaText);
    } catch (error) {
      console.log("#### Formula error");
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  private _formulaText = "";
  public get formulaText() {
    return this._formulaText;
  }
  public set formulaText(value) {
    this._formulaText = value;
  }

  formulaTextBackup = "";
  selectionStart: number = 0;
  selectionEnd: number = 0;

  //status
  isCover: boolean = false;
  isMouseUp: boolean = false; //Fix case cover out input

  onClickNumber(number) {
    console.log(number);

    this.formulaText = this.inputTextFormulaByPosition(
      this.formulaText,
      number,
      this.selectionStart
    );

    //Complete
    this.formulaTextBackup = this._formulaText;
    this.selectionEnd = this.selectionStart += number.length;
  }

  onclickOperator(operator) {
    if (!this.isCover) {
      this.inputOperatorNormal(operator);
    } else {
      //is cover
      //check is cover operator
      if (operator === "()") {
        this.inputOperatorCover("( ", " )");
      } else {
        this.inputOperatorNormal(operator);
      }
    }
  }

  onClickSensorValue(value) {
    this.formulaText = this.inputTextFormulaByPosition(
      this.formulaText,
      value,
      this.selectionStart
    );

    //Complete
    this.formulaTextBackup = this._formulaText;
    this.selectionEnd = this.selectionStart += value.length;
  }

  inputOperatorNormal(operator) {
    this.inputTextExpression.nativeElement.focus();
    //is not cover
    this.formulaText = this.inputTextFormulaByPosition(
      this.formulaText,
      operator,
      this.selectionStart
    );

    //Complete
    this.formulaTextBackup = this._formulaText;
    this.selectionEnd = this.selectionStart += operator.length;
  }
  inputOperatorCover(preString, postString) {
    //Start
    this.formulaText = this.inputTextFormulaByPosition(
      this.formulaText,
      preString,
      this.selectionStart
    );
    this.selectionEnd += preString.length;

    //End
    this.formulaText = this.inputTextFormulaByPosition(
      this.formulaText,
      postString,
      this.selectionEnd
    );

    //Complete
    this.formulaTextBackup = this._formulaText;
  }

  private keyCanInput = ["Backspace", "Delete"];
  onkeyupInputFormula(event) {
    if (this.keyCanInput.indexOf(event.key) == -1) {
      this.reseInputTextToBackup();
      return;
    }

    //case text empty support (Ctrt + A)
    if (event.target.value.length === 0) {
      console.log("Empty text clear");
      this.resetInputText();
      return;
    }

    //Fix case cover out input
    if (this.isMouseUp == false) {
      this.reseInputTextToBackup();
      return;
    }

    //Specific case
    if (!this.isCover) {
      //Delete character normal
      if (event.key === "Backspace") {
        this.selectionStart = this.selectionEnd = this.selectionEnd - 1;
        // console.log("Start = " + this.selectionStart);
        // console.log("End   = " + this.selectionEnd);
        // console.log("************************************");
        return; //must return because below selection +1
      } else if (event.key === "Delete") {
        // console.log("Start = " + this.selectionStart);
        // console.log("End   = " + this.selectionEnd);
        // console.log("************************************");
        return; //must return because below selection +1
      }
    } else {
      //Delete character when cover

      if (event.key === "Backspace" || event.key === "Delete") {
        this.isCover = false;
        this.selectionEnd = this.selectionStart;
        // console.log("onkeyupInputFormula");
        // console.log("Start = " + this.selectionStart);
        // console.log("End   = " + this.selectionEnd);
        // console.log("************************************");
        return; //must return because below selection +1
      } else {
        this.isCover = false;
        this.selectionStart = this.selectionEnd = this.selectionStart + 1;
        // console.log("onkeyupInputFormula");
        // console.log("Start = " + this.selectionStart);
        // console.log("End   = " + this.selectionEnd);
        // console.log("************************************");
        return; //must return because below selection +1
      }
    }
    this.selectionStart = this.selectionEnd += 1;
    // console.log("onkeyupInputFormula");
    // console.log("Start = " + this.selectionStart);
    // console.log("End   = " + this.selectionEnd);
    // console.log("************************************");
  }

  onmousedown() {
    this.isMouseUp = false;
  }
  mouseup() {
    this.isMouseUp = true;
  }

  onClickInputFormula(event) {
    console.log(event);

    //Update selection
    this.selectionStart = event.target.selectionStart;
    this.selectionEnd = event.target.selectionEnd;

    //blocked input back R or S
    let charCheck = this.formulaText[this.selectionStart - 1];
    if (charCheck === "R" || charCheck === "S") {
      this.resetCursorToLastIndex();
      setTimeout(() => {
        this.inputTextExpression.nativeElement.blur();
      }, 0);
      return;
    }

    // console.log("######## onClickInputFormula");
    // console.log("Start = " + this.selectionStart);
    // console.log("End   = " + this.selectionEnd);

    // console.log(">>" + this.formulaText[this.selectionStart]);
    // console.log(">>" + this.formulaText[this.selectionEnd]);
    // console.log(">>" + this.formulaText[this.selectionStart - 1]);

    //Check is cover
    if (this.selectionStart !== this.selectionEnd) this.isCover = true;
    else this.isCover = false;

    console.log("Set this.isCover = " + this.isCover);
    console.log("###############");
  }

  inputTextFormulaByPosition(
    mainText: string,
    stringInput: string,
    position: number
  ) {
    return [
      mainText.slice(0, position),
      stringInput,
      mainText.slice(position)
    ].join("");
  }

  resetInputText() {
    this.selectionStart = this.selectionEnd = 0;
    this.isCover = false;
    this.inputTextExpression.nativeElement.focus();
  }
  resetCursorToLastIndex() {
    this.selectionStart = this.selectionEnd = this.formulaText.length;
    this.isCover = false;
    this.inputTextExpression.nativeElement.blur();
  }
  reseInputTextToBackup() {
    this.formulaText = this.formulaTextBackup;
  }
}

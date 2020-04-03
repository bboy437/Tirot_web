import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material';
import { FormControl, Validators,FormBuilder,FormGroup} from '@angular/forms';
import { IOperationInstruction, IProcess, IProduct } from '../../../../interfaces/productionrecords';
import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { MessageDialogComponent } from '../../../../dialogs/message-dialog/message-dialog.component';


@Component({
  selector: 'article-add-dialog',
  templateUrl: './article-dialog.component.html',
  styleUrls: ['./article-dialog.component.scss']
})
export class ArticleDialogComponent implements OnInit {

  private UrlAPI_GetAllProcess: string = "Process/GetAll";
  private UrlAPI_GetRawMaterialAndWIP: string = "RawMaterial/GetRawMaterialAndWIP";
  private UrlAPI_GetAllProduct: string = "Product/GetAllActive";

  
  arrobjProcess: any = [];
  arrobjRawMaterial: any = [];
  arrobjProduct: any = [];
  processSelected: any = {};
  
  articleFormGroup: FormGroup;
  disableBtn = false;

  private intorderNo: number;
  private intOldProcessID : number;
  public intProcessID : number;
  private strOldRawMaterial : string;
  public intProductID : number;
  private intOldProductID : number;
  public strDialogStatus : string;
  
  dialogRef: MatDialogRef<MessageDialogComponent>;
  
  constructor(public dialogRefArticle: MatDialogRef<ArticleDialogComponent>,private dialog: MatDialog,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataOperationInstruction: IOperationInstruction ,
    private brokerAPIService: BrokerAPIService
  ){ }

  ngOnInit() {
    this.setSelectProcess();
    this.setSelectRawMaterial();
    this.setSelectProduct();

    
    console.log(this.dataOperationInstruction);
    if(this.dataOperationInstruction.id == 0)
    {
      this.strDialogStatus = "Add";
      let orderNo = this.dataOperationInstruction.orderNo;
      console.log(orderNo);

      this.dataOperationInstruction = <IOperationInstruction> {};
      this.dataOperationInstruction.createBy="admin";
      this.dataOperationInstruction.rawmaterialName = "";
      this.dataOperationInstruction.updateBy="admin";
      this.dataOperationInstruction.usingStandard=(null);
      this.dataOperationInstruction.id= (null);
      this.dataOperationInstruction.orderNo = orderNo;

      this.dataOperationInstruction.process  = <IProcess> {};
      this.dataOperationInstruction.process.id = (null);
      this.dataOperationInstruction.process.defaultStandard = "";


      this.dataOperationInstruction.product  = <IProduct> {};
      this.dataOperationInstruction.product.id = (null);
   

      console.log("ngOnInit");
      console.log(this.dataOperationInstruction);
    }
    else
    {
      console.log("Edit");
      this.strDialogStatus = "Edit";
      this.intorderNo = this.dataOperationInstruction.orderNo;
      this.intOldProcessID = this.dataOperationInstruction.process.id;
      this.intProcessID = this.dataOperationInstruction.process.id;
      this.strOldRawMaterial = this.dataOperationInstruction.rawmaterialName;
      this.intOldProductID = this.dataOperationInstruction.product.id;
      this.intProductID = this.dataOperationInstruction.product.id;
    }


    this.articleFormGroup = this.formBuilder.group({
      processCtrl: ['', Validators.required],
      rawmaterialCtrl: ['', Validators.required],
      productCtrl: ['', Validators.required],
      // standarCtrl: ['', Validators.required],
    });

    
    this.articleFormGroup.valueChanges 
            .subscribe((changedObj: any) => {
                 this.disableBtn = this.articleFormGroup.valid;
                //  console.log(changedObj);

            });


  }
  
  form = new FormGroup({
    articleFormGroup : new FormControl({
      processCtrl: new FormControl('', Validators.required),
      rawmaterialCtrl: new FormControl('', Validators.required),
      productCtrl: new FormControl('', Validators.required),
      // standarCtrl: new FormControl('', Validators.required),
    })
  });

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    if(this.strDialogStatus == "Edit")
    {
      this.dataOperationInstruction.orderNo = this.intorderNo;
      this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === this.intOldProcessID);
      this.dataOperationInstruction.product = this.arrobjProduct.find(x => x.id === this.intOldProductID);
      this.dataOperationInstruction.rawmaterialName = this.strOldRawMaterial;
    }

    this.dialogRefArticle.close();

  }

  public confirmAdd(): void {

    console.log("confirmAdd");
   
    
    // this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === this.dataOperationInstruction.process.id);
    // console.log(this.dataOperationInstruction);

  }
  validate(){
    
    if(this.strDialogStatus){
      let strValidate: string = "";
      if(this.dataOperationInstruction.process == undefined || this.arrobjProcess == ""){
        strValidate = "Process";
      }
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
      } 
      if (this.dataOperationInstruction.rawmaterialName == undefined || this.dataOperationInstruction.rawmaterialName == "") {
        strValidate = "rawmaterialName";
      }
  
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
        
      } 
      if (this.dataOperationInstruction.product == undefined || this.arrobjProduct == "") {
        strValidate = "Product";
      }
  
      if (strValidate != "") {
        this.showDialog("error", "Error", strValidate);
        return false;
        
      } 
      else {
        return true;
      }

    }
 
  }

  setSelectProcess() {
    this.brokerAPIService.get(this.UrlAPI_GetAllProcess).subscribe(
      data => {
        this.arrobjProcess = <IProcess[]>data;
      
      }
    );
  }

  setSelectRawMaterial() {
    this.brokerAPIService.get(this.UrlAPI_GetRawMaterialAndWIP).subscribe(
      data => {
        this.arrobjRawMaterial = data;
      }
    );
  }

  setSelectProduct() {
    this.brokerAPIService.get(this.UrlAPI_GetAllProduct).subscribe(
      data => {
        this.arrobjProduct = <IProduct[]>data;
      }
    );
  }

  ddlProcess_SelectIndexChange(data){
    this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === data);
  }

  ddlProduct_SelectIndexChange(data){
     this.dataOperationInstruction.product = this.arrobjProduct.find(x => x.id === data);
   }

   showDialog(type: string, title: string, body: string) {
    this.dialogRef=this.dialog.open(MessageDialogComponent, {
      width:'300px',height:'200px',
     data: {
       Messagetype: type,
       Messagetitle: title,
       Messagebody: body
     },
     disableClose: true
   });
 }
}

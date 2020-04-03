import { Component, OnInit, Inject, wtfLeave } from "@angular/core";

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormControl, Validators,FormBuilder,FormGroup } from "@angular/forms";
import { IProduct, IOrderItem } from "../../../../interfaces/productionrecords";
import { BrokerAPIService } from "../../../../services/brokerapi.service";
import { MessageDialogComponent } from "../../../../dialogs/message-dialog/message-dialog.component";

@Component({
  selector: "app-production-order-detail-dialog",
  templateUrl: "./production-order-detail-dialog.component.html",
  styleUrls: ["./production-order-detail-dialog.component.scss"]
})
export class ProductionOrderDetailDialogComponent implements OnInit {
 
  productionGroup: FormGroup;
  disableBtn = false;

  private UrlAPI_GetAllFG: string = "Product/GetAllFG";

  arrobjProduct: any = [];
  arrobjItemNo: any = [];
  arrobjOrderQty: any = [];
  processSelected: any = {};

  private intOlditemNo: number;
  public intProductID : number;
  private intOldProductID : number;
  private intOldOrderQty: number;
 
  public strDialogStatus: string;
  
  dialogRefs: MatDialogRef<MessageDialogComponent>;
  constructor(
    public dialogRef: MatDialogRef<ProductionOrderDetailDialogComponent>,
    private dialog: MatDialog,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataOrderItem: IOrderItem,
    private brokerAPIService: BrokerAPIService
  ) {}

  ngOnInit() {
    this.setSelectProduct();

    console.log(this.dataOrderItem);
    if(this.dataOrderItem.id == 0)
    {
      this.strDialogStatus = "Add";
      let itemNo = this.dataOrderItem.itemNo;
      console.log(itemNo);
      this.dataOrderItem = <IOrderItem> {};
      this.dataOrderItem.createBy = "admin";
      this.dataOrderItem.orderQty=(null);
      this.dataOrderItem.id= (null);
      this.dataOrderItem.itemNo = itemNo;

      this.dataOrderItem.product  = <IProduct> {};
      this.dataOrderItem.product.id = (null);
   
     

      console.log("ngOnInit");
      console.log(this.dataOrderItem);
    } else {
      console.log("Edit");
      this.strDialogStatus = "Edit";
      this.intOlditemNo = this.dataOrderItem.itemNo;
      this.intOldProductID = this.dataOrderItem.product.id;
      this.intProductID = this.dataOrderItem.product.id;
      this.intOldOrderQty = this.dataOrderItem.orderQty;

      
      // console.log("this.dataOrderItem.orderQty");
      // console.log(this.dataOrderItem.orderQty);
    }


    this.productionGroup = this.formBuilder.group({
      productCtrl: ['', Validators.required],
      orderlengthCtrl: ['', Validators.required],
      
    });

    this.productionGroup.valueChanges 
            .subscribe((changedObj: any) => {
                 this.disableBtn = this.productionGroup.valid;
                //  console.log(changedObj);
            });

  }

  form = new FormGroup({
    productionGroup : new FormControl({
      productCtrl: new FormControl('', Validators.required),
      orderlengthCtrl: new FormControl('', Validators.required),
      
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

    if (this.strDialogStatus == "Edit") {
      
      this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === this.intOldProductID);
      this.dataOrderItem.itemNo = this.intOlditemNo;
      this.dataOrderItem.orderQty = this.intOldOrderQty;
    }

    this.dialogRef.close();
  }

  // public confirmAdd(): void {

  //   this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === this.dataOrderItem.product.id);
  //   console.log(this.dataOrderItem);

  // }
  public confirmAdd(): void {
    console.log("confirmAdd");
    this.dataOrderItem
   
  }

  setSelectProduct() {
    this.brokerAPIService.get(this.UrlAPI_GetAllFG).subscribe(
      data => {
        this.arrobjProduct = data;
      }
    );
  }

  ddlProduct_SelectIndexChange(data){
    
    this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === data);
  }

  
  showDialog(type: string, title: string, body: string) {
    this.dialogRefs=this.dialog.open(MessageDialogComponent, {
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

import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material';
import { FormControl, Validators,FormBuilder,FormGroup} from '@angular/forms';
import { Sensor  } from '../../../interfaces/productionrecords';
import { BrokerAPIService } from '../../../services/brokerapi.service';
import { MessageDialogComponent } from '../../../dialogs/message-dialog/message-dialog.component';


@Component({
  selector: 'app-machine-dialog',
  templateUrl: './machine-dialog.component.html',
  styleUrls: ['./machine-dialog.component.scss']
})
export class MachineDialogComponent implements OnInit {



  private UrlAPI_GetAll: string = "Machine/GetAll";
  
  arrobjSensorName: any =[];
  arrobjSensorLocation: any =[];
  arrobjSensorGroupName: any =[];
  arrobjSensorValueUnitName: any =[];

  machineFormGroup: FormGroup;
  disableBtn = false;

  public strDialogStatus: string;

  dialogRef: MatDialogRef<MessageDialogComponent>;

  constructor(public dialogRefArticle: MatDialogRef<MachineDialogComponent>,private dialog: MatDialog,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataSensor: Sensor ,
    private brokerAPIService: BrokerAPIService
  ) { }

  ngOnInit() {


    console.log(this.dataSensor);
    if(this.dataSensor.id == 0)
    {
      this.strDialogStatus = "Add";
      // let itemNo = this.dataSensor.itemNo;
      // console.log(itemNo);
      this.dataSensor = <Sensor> {};
      this.dataSensor.createBy = "admin";
      // this.dataSensor.orderQty=(null);
      this.dataSensor.id= (null);
      // this.dataSensor.itemNo = itemNo;

      // this.dataSensor.product  =  {};
      // this.dataSensor.product.id = (null);

      console.log("ngOnInit");
      console.log(this.dataSensor);
    } else {
      this.strDialogStatus = "Edit";
      // this.intOlditemNo = this.dataSensor.itemNo;
      // this.intOldProductID = this.dataSensor.product.id;
      
      // this.intOldOrderQty = this.dataSensor.orderQty;
      
      // console.log("this.dataOrderItem.orderQty");
      // console.log(this.dataOrderItem.orderQty);
    }
    this.machineFormGroup = this.formBuilder.group({
      productCtrl: ['', Validators.required],
      orderlengthCtrl: ['', Validators.required],
      
    });

    this.machineFormGroup.valueChanges 
            .subscribe((changedObj: any) => {
                 this.disableBtn = this.machineFormGroup.valid;
                //  console.log(changedObj);
            });

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

import { Component, OnInit, Inject } from '@angular/core';
import { AnonymousSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-cancelorder-dialog',
  templateUrl: './confirm-cancelorder-dialog.component.html',
  styleUrls: ['./confirm-cancelorder-dialog.component.scss']
})
export class ConfirmCancelorderDialogComponent implements OnInit {
  constructor(public dialogRefDeleteDialog: MatDialogRef<ConfirmCancelorderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
  }

  
  onNoClick(): void {
    this.dialogRefDeleteDialog.close();
  }

  confirmDelete(): void {
  }

}

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { IProcess, IMachineCheckList } from '../../interfaces/productionrecords';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { AppConfig } from '../../app.config';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-machine-check-list-listing',
  templateUrl: './machine-check-list-listing.component.html',
  styleUrls: ['./machine-check-list-listing.component.scss']
})
export class MachineCheckListListingComponent implements OnInit, AfterViewInit {

  objAPIResponse: any = {};
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  @ViewChild(MatSort) sort: MatSort;
  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  displayedColumns = ['lineOrder', 'captionCol1', 'captionCol2', 'actions'];

  objRowSelected: IProcess;
  filter: string = "";
  MachineID: string = "";
  tabActive: number = 0;

  private UrlAPI_GetAll_Machine: string = "/Machine/GetAll";
  private UrlAPI_Update: string = "MachineCheckList/UpdateTemplate";
  private UrlAPI_UpdateTemplateList: string = "MachineCheckList/UpdateTemplateList";
  private UrlAPI_Delete: string = "MachineCheckList/DeleteTemplate";
  private UrlAPI_GetAll: string = "MachineCheckList/GetAllTemplate/";
  private Url_Detail: string = "/auth/master/machine-check-list-detail";

  arrobjMachine: any = [];
  arrobjMachineCheckListTemplate: any = [];
  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService) {

  }
  async ngOnInit() {
    this.dialogService.showLoader();
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll_Machine)
      this.arrobjMachine = data;
      console.log(this.arrobjMachine);
      if (this.arrobjMachine.length > 0) {
        this.MachineID = this.arrobjMachine[0].id;
      }
      await this.getMachineCheckList();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }


  async getMachineCheckList() {
    this.dialogService.showLoader();
    try {
      let params = this.route.snapshot.paramMap;
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetAll + this.MachineID);
      this.arrobjMachineCheckListTemplate = data;
      this.dataSource1.data = this.arrobjMachineCheckListTemplate.filter(x => x.groupOrder === 1);
      this.dataSource2.data = this.arrobjMachineCheckListTemplate.filter(x => x.groupOrder === 2);
      this.dataSource3.data = this.arrobjMachineCheckListTemplate.filter(x => x.groupOrder === 3);
      if (params.get("tabActive") != null) {
        this.tabActive = +params.get("tabActive");
      }
    } catch (error) {
     throw error;
    }
    this.dialogService.hideLoader();
  }

  tabChange(tabindex: any) {
    this.tabActive = tabindex;
  }



  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", tabActive: this.tabActive }]);
  }


  upLineOrder(id: number, groupOrder: number) {
    let objorderItemsFrom = this.arrobjMachineCheckListTemplate.find(x => x.id === id && x.groupOrder === groupOrder);
    let objorderItemsTo = this.arrobjMachineCheckListTemplate.find(x => x.lineOrder === objorderItemsFrom.lineOrder - 1 && x.groupOrder === groupOrder);

    if (objorderItemsTo != undefined) {
      this.dialogService.showLoader();

      objorderItemsFrom.lineOrder--;
      objorderItemsTo.lineOrder++;
      this.updateLineOrderFrom(objorderItemsFrom, objorderItemsTo);
    }
  }

  dwonLineOrder(id: number, groupOrder: number) {
    let objorderItemsFrom = this.arrobjMachineCheckListTemplate.find(x => x.id === id && x.groupOrder === groupOrder);
    let objorderItemsTo = this.arrobjMachineCheckListTemplate.find(x => x.lineOrder === objorderItemsFrom.lineOrder + 1 && x.groupOrder === groupOrder);

    if (objorderItemsTo != undefined) {
      this.dialogService.showLoader();

      objorderItemsFrom.lineOrder++;
      objorderItemsTo.lineOrder--;
      this.updateLineOrderFrom(objorderItemsFrom, objorderItemsTo);
    }
  }


  private updateLineOrderFrom(objorderItemsFrom: any, objorderItemsTo: any) {
    //Update
    this.brokerAPIService
      .post(this.UrlAPI_Update, <IMachineCheckList>objorderItemsFrom)
      .subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.updateLineOrderTo(objorderItemsTo);
          } else {
            console.log(
              "this.objAPIResponse.success :" + this.objAPIResponse.success
            );
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
  }

  private updateLineOrderTo(objorderItems: any) {
    //Update
    this.brokerAPIService
      .post(this.UrlAPI_Update, <IMachineCheckList>objorderItems)
      .subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            // this.showSnackBar("Save Complete");
            // this.router.navigate([this.Url_Listing]);
            this.getMachineCheckList();
            this.dataSourceSort();
          } else {
            console.log(
              "this.objAPIResponse.success :" + this.objAPIResponse.success
            );
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
  }


  deleteItem(id: number) {
    this.dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
      // data: {id: id, title: title, state: state, url: url}
      disableClose: true
    });

    this.dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {

        let objorderItems = this.arrobjMachineCheckListTemplate.find(x => x.id === id);
        console.log(objorderItems);

        let arrobjUpdatelist = this.arrobjMachineCheckListTemplate.filter(x => x.groupOrder === objorderItems.groupOrder && x.lineOrder > objorderItems.lineOrder);
        console.log(arrobjUpdatelist);


        this.dialogService.showLoader();
        this.brokerAPIService
          .post(this.UrlAPI_Delete, <IMachineCheckList>objorderItems)
          .subscribe(
            data => {
              this.objAPIResponse = <IAPIResponse>data;
              this.dialogService.hideLoader();
              if (this.objAPIResponse.success) {
                if (arrobjUpdatelist != undefined) {
                  if (arrobjUpdatelist.length > 0) {
                    this.reLineOrder(arrobjUpdatelist);
                    this.dialogService.hideLoader();
                  }
                  else {
                    this.getMachineCheckList();
                    this.dataSourceSort();
                  }
                }
              } else {
                console.log(
                  "this.objAPIResponse.success :" + this.objAPIResponse.success
                );
              }
            },
            err => {
              // กรณี error
              console.log("Something went wrong!");
            }
          );
      }
    });
    this.dialogService.hideLoader();
  }

  private reLineOrder(arrobjUpdatelist: any) {
    if (arrobjUpdatelist != undefined) {
      if (arrobjUpdatelist.length > 0) {

        arrobjUpdatelist.forEach(element => {
          element.lineOrder--;
        });

        this.brokerAPIService
          .post(this.UrlAPI_UpdateTemplateList, <IMachineCheckList>arrobjUpdatelist)
          .subscribe(
            data => {
              this.objAPIResponse = <IAPIResponse>data;
              if (this.objAPIResponse.success) {
                this.getMachineCheckList();
                this.dataSourceSort();
              } else {
                console.log(
                  "this.objAPIResponse.success :" + this.objAPIResponse.success
                );
              }
            },
            err => {
              // กรณี error
              console.log("Something went wrong!");
            }
          );
      }
    }

  }

  startEdit(id: number) {
    console.log(id);
  }


  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IProcess>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, tabActive: this.tabActive }]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource1.filter = filterValue;

  }


  ngAfterViewInit() {

    this.dataSourceSort();

    // this.dataSource1.filterPredicate = function (data: IProcess, filter: string): boolean {
    //   return (
    //     data.processCode.toString().toLowerCase().includes(filter) ||
    //     data.processName.toString().toLowerCase().includes(filter) ||
    //     data.processType.toString().replace("PR", "Production Record").replace("NR", "None Production").toLowerCase().includes(filter) ||
    //     data.inActivated.toString().replace("true", "Inactive").replace("false", "Active").toLowerCase().includes(filter)
    //   );
    // };
  }


  private dataSourceSort() {
    this.dataSource1.sort = this.sort;
    this.dataSource2.sort = this.sort;
    this.dataSource3.sort = this.sort;
  }



  btnPrintClick() {
    let printby: string = localStorage.getItem("currentUserName");
    let machine: string = this.arrobjMachine[0].machineName;
    console.log(this.arrobjMachine[0].machineName);

    let url: string = AppConfig.settings.ReportServerUrl + "MachineCheckListTemplate?" + "&printby=" + printby + "&machine=" + machine;
    window.open(url, '_blank', 'location=yes,height=660px,width=1350px,scrollbars=yes,status=yes');
  }


}
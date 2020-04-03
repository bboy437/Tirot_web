import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-neotex-dashboard',
  templateUrl: './neotex-dashboard.component.html',
  styleUrls: ['./neotex-dashboard.component.scss']
})
export class NeotexDashboardComponent implements OnInit {
  private UrlAPI_Machine_GetAllActive: string = "Machine/GetAllActive";
  arrobjMachine: any;
  MachineID: any;
  isLoadingResults: boolean;

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute) { }

 
  ngOnInit() {
    this.isLoadingResults = true;
    this.getAPIMachineGetAllActive()
  }

  getAPIMachineGetAllActive() {
    this.brokerAPIService.get(this.UrlAPI_Machine_GetAllActive).subscribe(data => {
      if (data != null) {
        this.arrobjMachine = data;
        this.MachineID = this.arrobjMachine[0].id;
        let params = this.route.snapshot.paramMap;
        if (params.has("MachineID")) {
          this.MachineID = Number(params.get("MachineID"));
        }

        this.isLoadingResults = false;
      }
    });
  }

  ddlMachine_SelectIndexChange(data) {
    console.log("ddlMachine_SelectIndexChange");
    
  }



}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdk-sidemenu-item',
  templateUrl: './sidemenu-item.component.html',
  styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent implements OnInit {

    @Input() menu;
    @Input() iconOnly:boolean;
    @Input() secondaryMenu:boolean = false;

    constructor() { }

    ngOnInit() {

        if(this.menu.name.length > 20)
        {
            this.menu.warpingname = this.menu.name.substring(0, 20) + "...";
        }
        else
        {
            this.menu.warpingname = this.menu.name;
        }

    }

    openLink() {
        this.menu.open = this.menu.open
    }
    getHeight() {

        if(this.menu.open == false) return '48px';
        else {
            if(this.menu && this.menu.sub){
              let height =   (this.menu.sub.length*56)+56+"px"; 
              return height;
           }
        }
    }
    
    chechForChildMenu() {
        return (this.menu && this.menu.sub) ?true:false ;
    }

}

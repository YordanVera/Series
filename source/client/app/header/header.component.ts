import { Component, OnInit, ViewContainerRef }    from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {newDialogComponent} from './newDialog.component'
import { CoverService }         from '../body/cover/cover.service';
@Component({
    moduleId    : module.id,
    selector    : 'headerETV',
    templateUrl : './header.component.html',
    providers   : [CoverService]
})
export class HeaderComponent implements OnInit {
    dialogRef: MdDialogRef<newDialogComponent>;
    lastCloseResult: string;

    constructor(
        public dialog: MdDialog,
        public viewContainerRef: ViewContainerRef,
        public coverService: CoverService){}
    ngOnInit(){

    }
     open() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(newDialogComponent, config);

    this.dialogRef.afterClosed().subscribe(result => {
      this.lastCloseResult = result;
      if(this.lastCloseResult){
        this.coverService.newTV_Show(this.lastCloseResult);
      }
      this.dialogRef = null;
    });
  }
}
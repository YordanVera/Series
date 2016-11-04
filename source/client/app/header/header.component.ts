import { Component, OnInit, ViewContainerRef, Input }   from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef }        from '@angular/material';
import { newDialogComponent }                           from './newDialog.component';
import { deleteDialogComponent }                        from './deleteDialog.component';
import { EmitterService }                               from '../emitter/emitter.service';
import { Event }                                        from '../emitter/event';

@Component({
    moduleId    : module.id,
    selector    : 'headerETV',
    templateUrl : './header.component.html'
})
export class HeaderComponent implements OnInit {
    dialogRef: MdDialogRef<newDialogComponent>;
    dialogRefDel: MdDialogRef<deleteDialogComponent>;
    lastCloseResult: string;

    constructor(
        public dialog: MdDialog,
        public viewContainerRef: ViewContainerRef,
        private emitter:EmitterService
        ){

        }
    ngOnInit(){ }
    openNewDialog() {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this.dialogRef = this.dialog.open(newDialogComponent, config);

        this.dialogRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            if(this.lastCloseResult){
                let event = new Event();
                event.type="new";
                event.data={title:this.lastCloseResult};
                this.emitter.emit(event);
            }
            this.dialogRef = null;
      });
    }
    openDeleteDialog(){
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        
        this.dialogRefDel = this.dialog.open(deleteDialogComponent, config);
        this.dialogRefDel.afterClosed().subscribe(
            result => {
                //console.log(result);
            }
        );

    }
    openUpdateDialog(){

    }
}
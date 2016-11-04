import { Component, ViewContainerRef, Input, NgModule  }    from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef, MdInput }   from '@angular/material';
@Component({
    moduleId    : module.id,
    templateUrl : './deleteDialog.component.html'
})
export class deleteDialogComponent {
    @Input() list_tvshows;
    constructor(public dialogRef: MdDialogRef<deleteDialogComponent>){}
    close(){
        console.log('cancelar');
    }
    acept(){
        console.log('aceptar');
    }
}
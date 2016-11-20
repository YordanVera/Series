import { Component }    from '@angular/core';
import { MdDialogRef }  from '@angular/material';
@Component({
    moduleId    : module.id,
    templateUrl : './newDialog.component.html'
})
export class newDialogComponent {
    TVSHow_name: string;
    constructor(public dialogRef: MdDialogRef<newDialogComponent>) { }
    close(){
        this.dialogRef.close();
    }
    acept(name){
        this.dialogRef.close(name);
    }
}
import { Component, ViewContainerRef, Input, NgModule  }    from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef, MdInput} from '@angular/material';

@Component({
    moduleId    : module.id,
    templateUrl : './newDialog.component.html'
})
export class newDialogComponent {
    TVSHow_name: string;
  constructor(public dialogRef: MdDialogRef<newDialogComponent>
  ) { }
  close(name){
      this.dialogRef.close();
  }
  acept(name){
      this.dialogRef.close(name);
  }
}
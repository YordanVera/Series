import { Component, OnInit, ViewContainerRef }    from '@angular/core';
import { EmitterService }       from './emitter/emitter.service';
@Component({
    moduleId    : module.id, 
    selector    : 'app',
    templateUrl : './app.component.html',
    providers:[EmitterService]
})
export class AppComponent{
    private viewContainerRef: ViewContainerRef;

    constructor(private emitter:EmitterService,
    viewContainerRef:ViewContainerRef){ 
        this.viewContainerRef = viewContainerRef;
     }
}
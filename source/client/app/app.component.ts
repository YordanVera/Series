import { Component, OnInit }    from '@angular/core';
import { EmitterService }       from './emitter/emitter.service';
@Component({
    moduleId    : module.id, 
    selector    : 'app',
    templateUrl : './app.component.html',
    providers:[EmitterService]
})
export class AppComponent{
    constructor(private emitter:EmitterService){  }
}
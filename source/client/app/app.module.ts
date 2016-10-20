import { NgModule }                 from '@angular/core';
import { enableProdMode }           from '@angular/core';
import { HttpModule, JsonpModule }  from '@angular/http';
import { BrowserModule }            from '@angular/platform-browser';
import { MaterialModule }           from '@angular/material';
import { CoverComponent }           from './cover/cover.component';
import { TVShow }                   from './cover/tvshow';

enableProdMode();

@NgModule({
    imports     : [ 
        BrowserModule, 
        HttpModule,
        JsonpModule,
        MaterialModule.forRoot() ],
    declarations: [ 
        CoverComponent],
    bootstrap   : [ CoverComponent ]
})
export class AppModule { }

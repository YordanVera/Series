import { NgModule }         from '@angular/core';
import { enableProdMode }   from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { AppComponent }     from './app.component';
import { MaterialModule }   from '@angular/material';
enableProdMode();

@NgModule({
    imports     : [ BrowserModule, MaterialModule ],
    declarations: [ AppComponent ],
    bootstrap   : [ AppComponent ]
})
export class AppModule { }

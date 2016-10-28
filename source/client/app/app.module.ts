import { NgModule }                 from '@angular/core';
import { enableProdMode }           from '@angular/core';
import { HttpModule, JsonpModule }  from '@angular/http';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule }              from '@angular/forms';
import { MaterialModule }           from '@angular/material';
import { AppComponent }             from './app.component';
import { HeaderComponent }          from './header/header.component';
import { BodyComponent }            from './body/body.component';
import { CoverComponent }           from './body/cover/cover.component';

enableProdMode();

@NgModule({
    imports     : [ 
        BrowserModule, 
        HttpModule,
        JsonpModule,
        MaterialModule.forRoot() ],
    declarations: [ 
        AppComponent,
        HeaderComponent,
        BodyComponent,
        CoverComponent
        ],
    bootstrap   : [ AppComponent ]
})
export class AppModule { }

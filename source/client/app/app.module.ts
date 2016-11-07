import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule, JsonpModule }  from '@angular/http';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule }              from '@angular/forms';
import { MaterialModule }           from '@angular/material';
import { AppRoutingModule }         from './app-routing.module';
import { AppComponent }             from './app.component';
import { HeaderComponent }          from './header/header.component';
import { BodyComponent }            from './body/body.component';
import { CoverComponent }           from './body/cover/cover.component';
import { DetailComponent }          from './body/detail/detail.component';
import { newDialogComponent }       from './header/newDialog.component';

enableProdMode();
@NgModule({
    imports     : [ 
        BrowserModule, 
        HttpModule,
        JsonpModule,
        FormsModule,
        AppRoutingModule,
        MaterialModule.forRoot() ],
    declarations: [ 
        AppComponent,
        HeaderComponent,
        BodyComponent,
        newDialogComponent,
        CoverComponent,
        DetailComponent
        ],
        entryComponents: [
            newDialogComponent
        ],
    bootstrap   : [ AppComponent ]
})
export class AppModule { }

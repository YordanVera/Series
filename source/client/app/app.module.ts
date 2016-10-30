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
import { newDialogComponent }       from './header/newDialog.component';
enableProdMode();

@NgModule({
    imports     : [ 
        BrowserModule, 
        HttpModule,
        JsonpModule,
        FormsModule,
        MaterialModule.forRoot() ],
    declarations: [ 
        AppComponent,
        HeaderComponent,
        BodyComponent,
        newDialogComponent,
        CoverComponent
        ],
        entryComponents: [
            newDialogComponent
        ],
    bootstrap   : [ AppComponent ]
})
export class AppModule { }

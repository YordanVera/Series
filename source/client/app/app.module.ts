import { NgModule, enableProdMode }     from '@angular/core';
import { HttpModule, JsonpModule }      from '@angular/http';
import { BrowserModule }                from '@angular/platform-browser';
import { FormsModule }                  from '@angular/forms';
import { MaterialModule }               from '@angular/material';
import { AppRoutingModule }             from './app-routing.module';
import { AppComponent }                 from './app.component';
import { HeaderComponent }              from './header/header.component';
import { BodyComponent }                from './body/body.component';
import { CoverComponent }               from './body/cover/cover.component';
import { DetailComponent }              from './body/detail/detail.component';
import { newDialogComponent }           from './header/newDialog.component';
import { episodeDetailDialogComponent } from './body/detail/episodeDetailDialogComponent.component';
import { Ng2BootstrapModule }           from 'ng2-bootstrap/ng2-bootstrap';
enableProdMode();
@NgModule({
    imports     : [ 
        BrowserModule, 
        HttpModule,
        JsonpModule,
        FormsModule,
        AppRoutingModule,
        MaterialModule.forRoot(),
        Ng2BootstrapModule ],
    declarations: [ 
        AppComponent,
        HeaderComponent,
        BodyComponent,
        newDialogComponent,
        episodeDetailDialogComponent,
        CoverComponent,
        DetailComponent
        ],
        entryComponents: [
            newDialogComponent,
            episodeDetailDialogComponent
        ],
    bootstrap   : [ AppComponent ]
})
export class AppModule { }

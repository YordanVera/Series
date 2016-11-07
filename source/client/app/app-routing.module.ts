import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoverComponent }       from './body/cover/cover.component';
import { DetailComponent }      from './body/detail/detail.component';

const routes: Routes = [
    { path: ''                      , component: CoverComponent     },
    { path: 'TVShow/:TVShow_name'   , component: DetailComponent    }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
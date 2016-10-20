import { Component, OnInit }    from '@angular/core';
import { CoverService }         from './cover.service';
import { TVShow }               from './tvshow';

@Component({
    moduleId    : module.id, 
    selector    : 'etv',
    templateUrl : './cover.component.html',
    providers   : [CoverService]
})
export class CoverComponent implements OnInit {
    erroMessage : string;
    mode = 'Observable';
    list_tvshows : TVShow[];

    constructor(private coverService: CoverService) { }

    ngOnInit(){
        this.getTVShows();
    }

    getTVShows(){
        this.coverService.getTV_Shows().subscribe(
            list_tvshows => this.list_tvshows = list_tvshows,
            error       => this.erroMessage = <any>error
        );
    }
}
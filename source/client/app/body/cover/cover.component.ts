import { Component, OnInit }    from '@angular/core';
import { CoverService }         from './cover.service';
import { TVShow }               from './tvshow';
import { EmitterService }       from '../../emitter/emitter.service';
import { Event }                from '../../emitter/event';
@Component({
    moduleId    : module.id, 
    selector    : 'cover',
    templateUrl : './cover.component.html',
    providers   : [CoverService]
})
export class CoverComponent implements OnInit {
    erroMessage : string;
    list_tvshows : TVShow[];
    constructor(private coverService: CoverService,
                private emitter: EmitterService) { 
                    this.list_tvshows = new Array;
                 }
    ngOnInit(){
        this.getTVShows();
        this.listenEmitterService();
    }
    getTVShows(){
        this.coverService.getAll_TVShows().subscribe(
            list_tvshows    => {
                this.list_tvshows = list_tvshows;
                if(typeof this.list_tvshows.length === 'undefined'){
                    this.list_tvshows = new Array;
                }
            },
            error           => this.erroMessage = <any>error
        );
    }
    private listenEmitterService(){
        this.emitter.eventListen$.subscribe(
            event => {
                if(event.type === 'new'){
                    this.newTVShow(event.data.name);
                }
                else if (event.type==='delete'){
                    this.deleteTVShow();
                }
                else if(event.type==='update'){
                    this.updateTVShow();
                }
            }
        );
    }
    private newTVShow(TVShow_name){
        this.coverService.new_TVShow(TVShow_name).subscribe(
            result => { 
                if(result.success){             
                    this.coverService.get_TVShow_Detail(TVShow_name).subscribe(
                        data => {
                            let newTV_Show = new TVShow();
                            newTV_Show.id_tvshow= result.id_tvshow;
                            newTV_Show.name=TVShow_name;
                            newTV_Show.data=data.result;
                            this.list_tvshows.push(newTV_Show);
                        }
                    );
                }
            }
        );
    }
    private deleteTVShow(){

    }
    private updateTVShow(){

    }
}
import { Component, OnInit  }       from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { CoverService }             from '../cover/cover.service';
import { TVShow }                   from '../cover/tvshow';

@Component({
    moduleId    : module.id, 
    selector    : 'detail',
    templateUrl : './detail.component.html',
    providers   : [CoverService]
})
export class DetailComponent {
    private TVShow  : TVShow;
    private season_selected;

    private _isLoading : boolean;
    private _isLoadingDetail : boolean;
    private _isSeasonSelected : boolean;
    constructor(private route           : ActivatedRoute,
                private location        : Location,
                private coverService    : CoverService){
                    this.TVShow = new TVShow;
                    this._isLoading = this._isLoadingDetail = true;
                    this._isSeasonSelected = false; 
                 }
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let _data : any = params;
            this.TVShow.title = _data.TVShow_name;
            this.TVShow.id_serie = _data.id;
        });
        this.getDetail();
    }
    getDetail(){
        this.coverService.get_TVShow_Detail(this.TVShow.title).subscribe(
            data => {
                this.TVShow.data = data.result;
                this._isLoading = false;
                this.getFullDetail(this.TVShow.data.id);
            }
        );
    }
    getFullDetail(id: number){
        this.coverService.get_TVShow_Full_Detail(id).subscribe(
            data => {
                this.TVShow.data.full = data.result;
                this._isLoadingDetail = false;
            }
        );
    }
    selectSeason(id:number, season_number:number){
        this.coverService.get_Season_Detail(id,season_number).subscribe(
            data => {
                this.season_selected=data.result;
                this._isSeasonSelected=true;
            }
        );
    }
}
import { Component }                from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { CoverService }             from '../cover/cover.service';
import { StatusService }            from './status.service';
import { TVShow }                   from '../cover/tvshow';
import * as _                       from 'lodash';

@Component({
    moduleId    : module.id, 
    selector    : 'detail',
    templateUrl : './detail.component.html',
    providers   : [CoverService, StatusService]
})
export class DetailComponent {
    private TVShow  : TVShow;
    private season_selected;
    private _isLoading : boolean;
    private _isLoadingDetail : boolean;
    private _isSeasonSelected : boolean;
    constructor(private route           : ActivatedRoute,
                private location        : Location,
                private coverService    : CoverService,
                private statusService   : StatusService){
                    this.TVShow = new TVShow;
                    this._isLoading = this._isLoadingDetail = true;
                    this._isSeasonSelected = false; 
                 }
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let _data : any = params;
            this.TVShow.name = _data.TVShow_name;
            this.TVShow.id_tvshow = _data.id;
        });
        this.getDetail();
    }
    getDetail(){
        this.coverService.get_TVShow_Detail(this.TVShow.name).subscribe(
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
                this.statusService.get_status(this.TVShow.id_tvshow, this.season_selected.season_number).subscribe(
                    _result => {
                        if(_result.success && _result.result.length>0){
                            let check = _result.result;
                            _.forEach(check, (element, index)=>{
                                let idx = _.findIndex(this.season_selected.episodes, {episode_number:element.episode});
                                if(idx>-1){
                                    this.season_selected.episodes[idx]['id_status'] = element.id_status;
                                    element.downloaded === 1 ? this.season_selected.episodes[idx]['downloaded'] = true : this.season_selected.episodes[idx]['downloaded'] = false;
                                    element.viewed === 1 ? this.season_selected.episodes[idx]['viewed'] = true : this.season_selected.episodes[idx]['viewed'] = false;
                                }
                            });
                        }
                    }
                );
            }
        );
    }
    changeStatus(op, event, cap, id_tvshow){
        op === 1 ? cap.downloaded = event.checked: cap.downloaded=cap.downloaded;
        op === 2 ? cap.viewed = event.checked: cap.viewed=cap.viewed;
        if(cap.id_status>=0){
            this.statusService.update_status({
                downloaded  :cap.downloaded, 
                viewed      :cap.viewed,
                id_status   :cap.id_status
            }).subscribe(
                data => {
                }
            );
        }else{
            this.statusService.add_status({
                id_tvshow   :id_tvshow,
                downloaded  :cap.downloaded, 
                viewed      :cap.viewed,
                season      :cap.season_number,
                episode     :cap.episode_number
            }).subscribe(
                data =>{
                    if(data.success){
                        cap.id_status = data.id_status;
                    }
                }
            );
        }
    }
}
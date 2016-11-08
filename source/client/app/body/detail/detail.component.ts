import { Component, OnInit }        from '@angular/core';
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
    private TVShow : TVShow;
    private loading: boolean;
    constructor(private route           : ActivatedRoute,
                private location        : Location,
                private coverService    : CoverService){
                    this.TVShow = new TVShow;
                    this.loading = true;
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
                this.loading = false;
            }
        );
    }
}
import { Component, OnInit }    from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

@Component({
    moduleId    : module.id, 
    selector    : 'detail',
    templateUrl : './detail.component.html'
})
export class DetailComponent {
    private title : string;
    constructor(private route: ActivatedRoute,
                private location: Location){}
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let data : any = params;
            this.title = data.TVShow_name;
        });
    }

}
import { Component, ViewChild, Input }  from '@angular/core';
import { LinksService }                 from './links.service';
import * as _                           from 'lodash';
@Component({
    moduleId    : module.id, 
  selector: 'episode-modal',
  templateUrl: './episodeDetailDialogComponent.component.html',
  exportAs: 'child',
  providers:[LinksService]
})
export class episodeDetailDialogComponent {
  @ViewChild('lgModal') lgModal;
  @Input() episode;
  @Input() season;
  @Input() TVShow;
  private links;
  private error: boolean;
  private _isLoading: boolean;
  constructor(private linksService: LinksService){
    this.error=false;
    this._isLoading=true;
  }
  show(){
    this.lgModal.config.backdrop = false;
    this.lgModal.show();
    this.linksService.get_Links(this.TVShow,this.season.season_number, this.episode.episode_number).subscribe(
        data => {
            if(data.success){
                this.links=data.result;
                this.error=false;
                this._isLoading=false;
            }else{
              this.error=true;
              this._isLoading=false;
            }
        }
    );
  }
}
import { Component, ViewChild, Input }  from '@angular/core';
import { TorrentService }               from './torrent.service';
import * as _                           from 'lodash';
@Component({
    moduleId    : module.id, 
  selector: 'episode-modal',
  templateUrl: './episodeDetailDialogComponent.component.html',
  exportAs: 'child',
  providers:[TorrentService]
})
export class episodeDetailDialogComponent {
  @ViewChild('lgModal') lgModal;
  @Input() episode;
  @Input() season;
  @Input() TVShow;
  private links;
  private error: boolean;
  private _isLoading: boolean;
  constructor(private torrentService: TorrentService){
    this.error=false;
    this._isLoading=true;
  }
  show(){
    this.lgModal.show();
    this.torrentService.get_Torrents(this.TVShow,this.season.season_number, this.episode.episode_number).subscribe(
        data => {
            let links = [];
            if(data.success){
                _.forEachRight(data.result, (element, index)=>{
                    if(links.length===0){
                      links.push({
                        group:element.group,
                        data:[
                          {
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          torrent:element.torrent
                          }
                        ]
                      });
                    }else{
                      let pos = _.findIndex(links, {'group':element.group});
                      if(pos>-1){
                        links[pos].data.push({
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          torrent:element.torrent
                        });
                      }else{
                        links.push({
                        group:element.group,
                        data:[
                          {
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          torrent:element.torrent
                          }
                        ]
                      });
                      }
                    }
                });
                this.error=false;
                this._isLoading=false;
            }else{
              this.error=true;
              this._isLoading=false;
            }
            this.links=links;
        }
    );
  }
}
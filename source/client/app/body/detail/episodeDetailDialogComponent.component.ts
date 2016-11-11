import { Component, ViewChild, Input }  from '@angular/core';
import { TorrentService }               from './torrent.service';
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
  constructor(private torrentService: TorrentService){

  }
  show(){
    this.lgModal.show();
    this.torrentService.get_Torrents(this.TVShow,this.season.season_number, this.episode.episode_number).subscribe(
        data => {
            console.log(data);
        }
    );
  }
}
import { Component, ViewChild, Input } from '@angular/core';
@Component({
    moduleId    : module.id, 
  selector: 'episode-modal',
  templateUrl: './episodeDetailDialogComponent.component.html',
  exportAs: 'child'
})
export class episodeDetailDialogComponent {
  @ViewChild('lgModal') lgModal;
  @Input() episode;
  @Input() season;
  show(){
    this.lgModal.show();
  }
}
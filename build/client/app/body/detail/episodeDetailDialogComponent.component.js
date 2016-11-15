"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var torrent_service_1 = require('./torrent.service');
var _ = require('lodash');
var episodeDetailDialogComponent = (function () {
    function episodeDetailDialogComponent(torrentService) {
        this.torrentService = torrentService;
        this.error = false;
        this._isLoading = true;
    }
    episodeDetailDialogComponent.prototype.show = function () {
        var _this = this;
        this.lgModal.show();
        this.torrentService.get_Torrents(this.TVShow, this.season.season_number, this.episode.episode_number).subscribe(function (data) {
            var links = [];
            if (data.success) {
                _.forEachRight(data.result, function (element, index) {
                    if (links.length === 0) {
                        links.push({
                            group: element.group,
                            data: [
                                {
                                    title: element.title,
                                    description: element.description,
                                    href: element.href,
                                    group: element.group,
                                    info_torrent: element.info_torrent,
                                    link: element.link,
                                    torrent: element.torrent
                                }
                            ]
                        });
                    }
                    else {
                        var pos = _.findIndex(links, { 'group': element.group });
                        if (pos > -1) {
                            links[pos].data.push({
                                title: element.title,
                                description: element.description,
                                href: element.href,
                                group: element.group,
                                info_torrent: element.info_torrent,
                                link: element.link,
                                torrent: element.torrent
                            });
                        }
                        else {
                            links.push({
                                group: element.group,
                                data: [
                                    {
                                        title: element.title,
                                        description: element.description,
                                        href: element.href,
                                        group: element.group,
                                        info_torrent: element.info_torrent,
                                        link: element.link,
                                        torrent: element.torrent
                                    }
                                ]
                            });
                        }
                    }
                });
                _this.error = false;
                _this._isLoading = false;
            }
            else {
                _this.error = true;
                _this._isLoading = false;
            }
            _this.links = links;
        });
    };
    __decorate([
        core_1.ViewChild('lgModal'), 
        __metadata('design:type', Object)
    ], episodeDetailDialogComponent.prototype, "lgModal", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], episodeDetailDialogComponent.prototype, "episode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], episodeDetailDialogComponent.prototype, "season", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], episodeDetailDialogComponent.prototype, "TVShow", void 0);
    episodeDetailDialogComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'episode-modal',
            templateUrl: './episodeDetailDialogComponent.component.html',
            exportAs: 'child',
            providers: [torrent_service_1.TorrentService]
        }), 
        __metadata('design:paramtypes', [torrent_service_1.TorrentService])
    ], episodeDetailDialogComponent);
    return episodeDetailDialogComponent;
}());
exports.episodeDetailDialogComponent = episodeDetailDialogComponent;

//# sourceMappingURL=episodeDetailDialogComponent.component.js.map

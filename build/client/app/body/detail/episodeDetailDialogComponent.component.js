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
var links_service_1 = require('./links.service');
var episodeDetailDialogComponent = (function () {
    function episodeDetailDialogComponent(linksService) {
        this.linksService = linksService;
        this.error = false;
        this._isLoading = true;
    }
    episodeDetailDialogComponent.prototype.show = function () {
        var _this = this;
        this.lgModal.config.backdrop = false;
        this.lgModal.show();
        this.linksService.get_Links(this.TVShow, this.season.season_number, this.episode.episode_number).subscribe(function (data) {
            if (data.success) {
                _this.links = data.result;
                _this.error = false;
                _this._isLoading = false;
            }
            else {
                _this.error = true;
                _this._isLoading = false;
            }
        });
    };
    episodeDetailDialogComponent.prototype._isImageAvailable = function (image) {
        return typeof image === 'string' ? true : false;
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
            providers: [links_service_1.LinksService]
        }), 
        __metadata('design:paramtypes', [links_service_1.LinksService])
    ], episodeDetailDialogComponent);
    return episodeDetailDialogComponent;
}());
exports.episodeDetailDialogComponent = episodeDetailDialogComponent;

//# sourceMappingURL=episodeDetailDialogComponent.component.js.map

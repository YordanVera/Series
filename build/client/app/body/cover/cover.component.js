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
var cover_service_1 = require('./cover.service');
var tvshow_1 = require('./tvshow');
var emitter_service_1 = require('../../emitter/emitter.service');
var CoverComponent = (function () {
    function CoverComponent(coverService, emitter) {
        this.coverService = coverService;
        this.emitter = emitter;
        this.list_tvshows = new Array;
    }
    CoverComponent.prototype.ngOnInit = function () {
        this.getTVShows();
        this.listenEmitterService();
    };
    CoverComponent.prototype.getTVShows = function () {
        var _this = this;
        this.coverService.getAll_TVShows().subscribe(function (list_tvshows) {
            _this.list_tvshows = list_tvshows;
            if (typeof _this.list_tvshows.length === 'undefined') {
                _this.list_tvshows = new Array;
            }
        }, function (error) { return _this.erroMessage = error; });
    };
    CoverComponent.prototype.listenEmitterService = function () {
        var _this = this;
        this.emitter.eventListen$.subscribe(function (event) {
            if (event.type === 'new') {
                _this.newTVShow(event.data.name);
            }
            else if (event.type === 'delete') {
                _this.deleteTVShow();
            }
            else if (event.type === 'update') {
                _this.updateTVShow();
            }
        });
    };
    CoverComponent.prototype.newTVShow = function (TVShow_name) {
        var _this = this;
        this.coverService.new_TVShow(TVShow_name).subscribe(function (result) {
            if (result.success) {
                _this.coverService.get_TVShow_Detail(TVShow_name).subscribe(function (data) {
                    var newTV_Show = new tvshow_1.TVShow();
                    newTV_Show.id_tvshow = result.id_tvshow;
                    newTV_Show.name = TVShow_name;
                    newTV_Show.data = data.result;
                    _this.list_tvshows.push(newTV_Show);
                });
            }
        });
    };
    CoverComponent.prototype.deleteTVShow = function () {
    };
    CoverComponent.prototype.updateTVShow = function () {
    };
    CoverComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cover',
            templateUrl: './cover.component.html',
            providers: [cover_service_1.CoverService]
        }), 
        __metadata('design:paramtypes', [cover_service_1.CoverService, emitter_service_1.EmitterService])
    ], CoverComponent);
    return CoverComponent;
}());
exports.CoverComponent = CoverComponent;

//# sourceMappingURL=cover.component.js.map

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
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var cover_service_1 = require('../cover/cover.service');
var status_service_1 = require('./status.service');
var tvshow_1 = require('../cover/tvshow');
var _ = require('lodash');
var DetailComponent = (function () {
    function DetailComponent(route, location, coverService, statusService) {
        this.route = route;
        this.location = location;
        this.coverService = coverService;
        this.statusService = statusService;
        this.TVShow = new tvshow_1.TVShow;
        this._isLoading = this._isLoadingDetail = true;
        this._isSeasonSelected = false;
    }
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var _data = params;
            _this.TVShow.name = _data.TVShow_name;
            _this.TVShow.id_tvshow = _data.id;
        });
        this.getDetail();
    };
    DetailComponent.prototype.getDetail = function () {
        var _this = this;
        this.coverService.get_TVShow_Detail(this.TVShow.name).subscribe(function (data) {
            _this.TVShow.data = data.result;
            _this._isLoading = false;
            _this.getFullDetail(_this.TVShow.data.id);
        });
    };
    DetailComponent.prototype.getFullDetail = function (id) {
        var _this = this;
        this.coverService.get_TVShow_Full_Detail(id).subscribe(function (data) {
            _this.TVShow.data.full = data.result;
            _this._isLoadingDetail = false;
        });
    };
    DetailComponent.prototype.selectSeason = function (id, season_number) {
        var _this = this;
        this.coverService.get_Season_Detail(id, season_number).subscribe(function (data) {
            _this.season_selected = data.result;
            _this._isSeasonSelected = true;
            _this.statusService.get_status(_this.TVShow.id_tvshow, _this.season_selected.season_number).subscribe(function (_result) {
                if (_result.success && _result.result.length > 0) {
                    var check = _result.result;
                    _.forEach(check, function (element, index) {
                        var idx = _.findIndex(_this.season_selected.episodes, { episode_number: element.episode });
                        if (idx > -1) {
                            _this.season_selected.episodes[idx]['id_status'] = element.id_status;
                            element.downloaded === 1 ? _this.season_selected.episodes[idx]['downloaded'] = true : _this.season_selected.episodes[idx]['downloaded'] = false;
                            element.viewed === 1 ? _this.season_selected.episodes[idx]['viewed'] = true : _this.season_selected.episodes[idx]['viewed'] = false;
                        }
                    });
                }
            });
        });
    };
    DetailComponent.prototype.changeStatus = function (op, event, cap, id_tvshow) {
        op === 1 ? cap.downloaded = event.checked : cap.downloaded = cap.downloaded;
        op === 2 ? cap.viewed = event.checked : cap.viewed = cap.viewed;
        if (cap.id_status >= 0) {
            this.statusService.update_status({
                downloaded: cap.downloaded,
                viewed: cap.viewed,
                id_status: cap.id_status
            }).subscribe(function (data) {
            });
        }
        else {
            this.statusService.add_status({
                id_tvshow: id_tvshow,
                downloaded: cap.downloaded,
                viewed: cap.viewed,
                season: cap.season_number,
                episode: cap.episode_number
            }).subscribe(function (data) {
                if (data.success) {
                    cap.id_status = data.id_status;
                }
            });
        }
    };
    DetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'detail',
            templateUrl: './detail.component.html',
            providers: [cover_service_1.CoverService, status_service_1.StatusService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, common_1.Location, cover_service_1.CoverService, status_service_1.StatusService])
    ], DetailComponent);
    return DetailComponent;
}());
exports.DetailComponent = DetailComponent;

//# sourceMappingURL=detail.component.js.map

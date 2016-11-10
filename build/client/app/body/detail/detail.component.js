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
var tvshow_1 = require('../cover/tvshow');
var DetailComponent = (function () {
    function DetailComponent(route, location, coverService) {
        this.route = route;
        this.location = location;
        this.coverService = coverService;
        this.TVShow = new tvshow_1.TVShow;
        this._isLoading = this._isLoadingDetail = true;
        this._isSeasonSelected = false;
    }
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var _data = params;
            _this.TVShow.title = _data.TVShow_name;
            _this.TVShow.id_serie = _data.id;
        });
        this.getDetail();
    };
    DetailComponent.prototype.getDetail = function () {
        var _this = this;
        this.coverService.get_TVShow_Detail(this.TVShow.title).subscribe(function (data) {
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
            console.log(data.result);
            _this.season_selected = data.result;
            _this._isSeasonSelected = true;
        });
    };
    DetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'detail',
            templateUrl: './detail.component.html',
            providers: [cover_service_1.CoverService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, common_1.Location, cover_service_1.CoverService])
    ], DetailComponent);
    return DetailComponent;
}());
exports.DetailComponent = DetailComponent;

//# sourceMappingURL=detail.component.js.map

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
var CoverComponent = (function () {
    function CoverComponent(coverService) {
        this.coverService = coverService;
        this.mode = 'Observable';
    }
    CoverComponent.prototype.ngOnInit = function () {
        this.getTVShows();
    };
    CoverComponent.prototype.getTVShows = function () {
        var _this = this;
        this.coverService.getTV_Shows().subscribe(function (list_tvshows) { return _this.list_tvshows = list_tvshows; }, function (error) { return _this.erroMessage = error; });
    };
    CoverComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'etv',
            templateUrl: './cover.component.html',
            providers: [cover_service_1.CoverService]
        }), 
        __metadata('design:paramtypes', [cover_service_1.CoverService])
    ], CoverComponent);
    return CoverComponent;
}());
exports.CoverComponent = CoverComponent;

//# sourceMappingURL=cover.component.js.map

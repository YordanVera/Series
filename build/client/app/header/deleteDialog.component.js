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
var material_1 = require('@angular/material');
var cover_service_1 = require('../body/cover/cover.service');
var deleteDialogComponent = (function () {
    function deleteDialogComponent(dialogRef, coverService) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.coverService = coverService;
        this.coverService.getAll_TVShows().subscribe(function (list_tvshows) {
            _this.list_tvshows = list_tvshows;
        });
    }
    deleteDialogComponent.prototype.close = function () {
        console.log('cancelar');
    };
    deleteDialogComponent.prototype.acept = function () {
        console.log('aceptar');
    };
    deleteDialogComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './deleteDialog.component.html',
            providers: [cover_service_1.CoverService]
        }), 
        __metadata('design:paramtypes', [material_1.MdDialogRef, cover_service_1.CoverService])
    ], deleteDialogComponent);
    return deleteDialogComponent;
}());
exports.deleteDialogComponent = deleteDialogComponent;

//# sourceMappingURL=deleteDialog.component.js.map

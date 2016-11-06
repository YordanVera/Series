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
var newDialog_component_1 = require('./newDialog.component');
var emitter_service_1 = require('../emitter/emitter.service');
var event_1 = require('../emitter/event');
var HeaderComponent = (function () {
    function HeaderComponent(dialog, viewContainerRef, emitter) {
        this.dialog = dialog;
        this.viewContainerRef = viewContainerRef;
        this.emitter = emitter;
    }
    HeaderComponent.prototype.ngOnInit = function () { };
    HeaderComponent.prototype.openNewDialog = function () {
        var _this = this;
        var config = new material_1.MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        this.dialogRef = this.dialog.open(newDialog_component_1.newDialogComponent, config);
        this.dialogRef.afterClosed().subscribe(function (result) {
            _this.lastCloseResult = result;
            if (_this.lastCloseResult) {
                var event_2 = new event_1.Event();
                event_2.type = "new";
                event_2.data = { title: _this.lastCloseResult };
                _this.emitter.emit(event_2);
            }
            _this.dialogRef = null;
        });
    };
    HeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'headerETV',
            templateUrl: './header.component.html'
        }), 
        __metadata('design:paramtypes', [material_1.MdDialog, core_1.ViewContainerRef, emitter_service_1.EmitterService])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;

//# sourceMappingURL=header.component.js.map

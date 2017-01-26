

(function () {
    "use strict";
    app.service('ITRiskService', function($rootScope, APIHandler, Utils){

        this.GetUsers = function(){
            return APIHandler.Get('users');
        };

        this.GetRim = function(){
            return APIHandler.Get('itrisk/itrim');
        };

        this.GetRimById = function(id){
            return APIHandler.Get('itrisk/itrim/' + id);
        };

        this.AddRim = function(params){
            return APIHandler.Post('itrisk/itrim', params);
        };

        this.GetRimPeriod = function(){
            return APIHandler.Get('itrisk/itrim/period');
        };

        this.GetRimRiskCategory = function(){
            return APIHandler.Get('itrisk/itrim/riskCategory');
        };

        this.GetRimStatus = function(){
            return APIHandler.Get('itrisk/itrim/status');
        };

        this.DeleteRim = function(id){
            return APIHandler.Delete('itrisk/itrim/'+id);
        };

        this.UpdateRim = function(id, params){
            return APIHandler.Put('itrisk/itrim/'+id, params);
        };

        this.LoadAPIRoutes = function(){
            return APIHandler.Get('');
        };

        this.GetRam = function(){
            return APIHandler.Get('itrisk/itram');
        };

        this.GetRamById = function(id){
            return APIHandler.Get('itrisk/itram/'+id);
        };

        this.AddRam = function(params){
            return APIHandler.Post('itrisk/itram', params);
        };

        this.DeleteRam = function(id){
            return APIHandler.Delete('itrisk/itram/'+id);
        };

        this.UpdateRam = function(id, params){
            return APIHandler.Put('itrisk/itram/'+id, params);
        };

        this.GetRamDept = function(){
            return APIHandler.Get('itrisk/itram/dept');
        };

        this.GetRamPeriod = function(){
            return APIHandler.Get('itrisk/itram/period');
        };

        this.GetRamRegion = function(){
            return APIHandler.Get('itrisk/itram/region');
        };

        this.GetRamStatus = function(){
            return APIHandler.Get('itrisk/itram/status');
        };

        this.GetRamTemplates = function(){
            return APIHandler.Get('itrisk/itram/templates');
        };
    });
})();

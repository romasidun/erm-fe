
app.service('MitigateService', function(APIHandler){

    this.GetRemediations = function(){
        return APIHandler.Get('remediations');
    };

    this.GetStatus = function(){
        return APIHandler.Get('remediations/status');
    };

    this.GetPeriod = function(){
        return APIHandler.Get('remediations/period');
    };

    this.GetRiskCategory = function(){
        return APIHandler.Get('remediations/riskCategory');
    };

    this.GetSeverity = function(){
        return APIHandler.Get('remediations/severity');
    };

});

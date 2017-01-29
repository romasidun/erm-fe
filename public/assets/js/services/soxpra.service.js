
app.service('SoxPraService', function($rootScope, APIHandler, Utils){

    this.LoadOpRiskList = function(){
      return APIHandler.Get('oprisk/ori');
    };

    this.GetRiskIncident = function(id){
        return APIHandler.Get('oprisk/ori/' + id);
    };

    this.GetRiskPeriod= function(){
      return APIHandler.Get('compliance/soxpra/period');
    };

    this.GetRiskCategories = function(){
      return APIHandler.Get('oprisk/ori/riskCategory');
    };

    this.GetRiskStatus = function(){
      return APIHandler.Get('compliance/soxpra/status');
    };

    this.PostRisk = function(params){
      return APIHandler.Post('oprisk/ori', params);
    };

    this.DeleteRisk = function(id){
      return APIHandler.Delete('oprisk/ori/'+ id);
    };

    this.UpdateIncident = function(id, params){
      return APIHandler.Put('oprisk/ori/'+ id, params);
    };

    this.GetAssessments = function(){
        return APIHandler.Get('compliance/soxpra');
    };

    this.GetAssessment = function(id){
        return APIHandler.Get('compliance/soxpra/' + id);
    };

    this.PostAssessment = function(params){
        return APIHandler.Post('compliance/soxpra', params);
    };

    this.DeleteAssessment = function(id){
        return APIHandler.Delete('compliance/soxpra/'+ id);
    };

    this.UpdateAssessment = function(id, params){
        return APIHandler.Put('compliance/soxpra/'+id, params);
    };

    this.GetRSADept = function(){
        return APIHandler.Get('compliance/soxpra/dept');
    };

    this.GetRSATemplates = function(){
        return APIHandler.Get('compliance/soxpra/templates');
    };

    this.GetRSAPeriod = function(){
        return APIHandler.Get('compliance/soxpra/period');
    };

    this.GetRSARegion = function(){
        return APIHandler.Get('compliance/soxpra/region');
    };

    this.GetRSAStatus = function(){
        return APIHandler.Get('compliance/soxpra/status');
    };

    this.GetControlData = function(){
        return APIHandler.Get('crtldata');
    };

    this.GetPolicyDocs = function(size, page){
        return APIHandler.Get('policies?pagesize=' + size + '&page=' + page);
    };

    this.ExcelDownload = function(params){
        return APIHandler.Excel('/xlsx', params);
    }

});
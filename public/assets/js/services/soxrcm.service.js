
app.service('SoxRcmService', function($rootScope, APIHandler, Utils){

    this.LoadOpRiskList = function(){
      return APIHandler.Get('oprisk/ori');
    };

    this.GetRiskIncident = function(id){
        return APIHandler.Get('oprisk/ori/' + id);
    };

    this.GetRiskPeriod= function(){
      return APIHandler.Get('compliance/soxrcm/period');
    };

    this.GetRiskCategories = function(){
      return APIHandler.Get('oprisk/ori/riskCategory');
    };

    this.GetRiskStatus = function(){
      return APIHandler.Get('compliance/soxrcm/status');
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
        return APIHandler.Get('compliance/soxrcm');
    };

    this.GetAssessment = function(id){
        return APIHandler.Get('compliance/soxrcm/' + id);
    };

    this.PostAssessment = function(params){
        return APIHandler.Post('compliance/soxrcm', params);
    };

    this.DeleteAssessment = function(id){
        return APIHandler.Delete('compliance/soxrcm/'+ id);
    };

    this.UpdateAssessment = function(id, params){
        return APIHandler.Put('compliance/soxrcm/'+id, params);
    };

    this.GetRSADept = function(){
        return APIHandler.Get('compliance/soxrcm/dept');
    };

    this.GetRSATemplates = function(){
        return APIHandler.Get('compliance/soxrcm/templates');
    };

    this.GetRSAPeriod = function(){
        return APIHandler.Get('compliance/soxrcm/period');
    };

    this.GetRSARegion = function(){
        return APIHandler.Get('compliance/soxrcm/region');
    };

    this.GetRSAStatus = function(){
        return APIHandler.Get('compliance/soxrcm/status');
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

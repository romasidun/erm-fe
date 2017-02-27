
app.service('OPRiskService', function($rootScope, APIHandler, Utils){

    this.LoadOpRiskList = function(){
      return APIHandler.Get('oprisk/ori');
    };

    this.GetRiskIncident = function(id){
        return APIHandler.Get('oprisk/ori/' + id);
    };

    this.GetRiskPeriod= function(){
      return APIHandler.Get('oprisk/ori/period');
    };

    this.GetRiskCategories = function(){
      return APIHandler.Get('oprisk/ori/riskCategory');
    };

    this.GetRiskStatus = function(){
      return APIHandler.Get('oprisk/ori/status');
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

    this.PostAction = function(params){
        return APIHandler.Post('oprisk/ori/actions', params);
    };

    this.PutAction = function(id, params){
        return APIHandler.Put('oprisk/ori/actions/' + id, params);
    };

    this.GetOneAction = function(id){
        return APIHandler.Get('oprisk/ori/actions/' + id);
    };

    this.DeleteAction = function(id){
        return APIHandler.Delete('oprisk/ori/actions/' + id);
    };

    this.GetActionsByRiskId = function(id){
        return APIHandler.Get('oprisk/ori/actionsbyriskid/' + id);
    };


    this.GetAssessments = function(){
        return APIHandler.Get('rcsa');
    };

    this.GetAssessment = function(id){
        return APIHandler.Get('rcsa/' + id);
    };

    this.PostAssessment = function(params){
        return APIHandler.Post('rcsa', params);
    };

    this.DeleteAssessment = function(id){
        return APIHandler.Delete('rcsa/'+ id);
    };

    this.UpdateAssessment = function(id, params){
        return APIHandler.Put('rcsa/'+id, params);
    };

    this.GetRSADept = function(){
        return APIHandler.Get('rcsa/dept');
    };

    this.GetRSATemplates = function(){
        return APIHandler.Get('rcsa/templates');
    };

    this.GetRSAPeriod = function(){
        return APIHandler.Get('rcsa/period');
    };
    // this.GetRSATemplates = function(){
    //     return APIHandler.Get('itram/templates');
    // };


    this.GetRSARegion = function(){
        return APIHandler.Get('rcsa/region');
    };

    this.GetRSAStatus = function(){
        return APIHandler.Get('rcsa/status');
    };

    this.GetControlData = function(){
        return APIHandler.Get('crtldata');
    };


    this.GetPolicyDocs = function(size, page){
        return APIHandler.Get('policies?pagesize=' + size + '&page=' + page);
    };

    this.FileUpload = function (idd, fileModel) {
        if(fileModel.length < 1){
            return APIHandler.NullPromise();
        }
        var formdata = new FormData();
        for (var i in fileModel) {
            if(fileModel[i].id != 'newfile'){
                return APIHandler.NullPromise();
            }
            fileModel[i].id = idd + '_' + i;
            formdata.append("file", fileModel[i]._file);
        }
        var url = 'oprisk/' + idd + '/upload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.FileDownload = function(idd){
        var url = 'oprisk/download/' + idd;
        return APIHandler.Get(url);
    };
});

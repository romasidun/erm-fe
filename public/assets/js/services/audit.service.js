/**
 * Created by Precision on 03/01/2017.
 */

app.service('AuditService', function(APIHandler){

    this.GetAudits = function(page, size){
        return APIHandler.Get('audits?size='+size+'&page='+page);
    };

    this.GetAudit = function(id){
        return APIHandler.Get('audits/'+id);
    };

    this.GetTopics = function(size, page){
        return APIHandler.Get('audittopic?size='+size+'&page='+page);
    };

    this.GetTopic = function(id){
        return APIHandler.Get('audittopic/'+id);
    };

    this.GetFindings = function(size, page){
        return APIHandler.Get('auditfindings?size='+size+'&page='+page);
    };

    this.GetFinding = function(id){
        return APIHandler.Get('auditfindings/'+id);
    };

    this.GetActions = function(size, page){
        return APIHandler.Get('auditactions?size='+size+'&page='+page);
    };

    this.GetAction = function(id){
        return APIHandler.Get('auditactions/'+id);
    };

    this.ReviewAction = function(id, params){
        return APIHandler.Put('auditactions/'+id, params);
    };

    this.GetManageDept = function(){
        return APIHandler.Get('auditmgmt/dept');
    };

    this.GetFindingOpen = function(){
        return APIHandler.Get('auditfindings/openfindings');
    };

    this.GetManageStatus = function(){
        return APIHandler.Get('auditmgmt/status');
    };

    this.GetManageRegion =  function() {
        return APIHandler.Get('auditmgmt/region');
    };

    this.GetManagePeriod = function() {
        return APIHandler.Get('auditmgmt/period');
    };

    this.GetActionStatus = function() {
        return APIHandler.Get('auditactions/status');
    }

});

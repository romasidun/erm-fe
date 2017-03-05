/**
 * Created by Precision on 03/01/2017.
 */

app.service('AuditService', function(APIHandler){

    // begin audit
    this.GetAudits = function(){
        return APIHandler.Get('auditmgmt');
    };

    this.GetEachAudit = function(id){
        return APIHandler.Get('auditmgmt/'+id);
    };

    this.AddAudits = function(param){
        return APIHandler.Post('auditmgmt', param);
    };

    this.DeleteAudit = function (id) {
        return APIHandler.Delete('auditmgmt/' + id);
    };
    // end topic

    // begin topic
    this.GetTopics = function(){
        return APIHandler.Get('audittopic');
    };

    this.GetEachTopic =  function(id){
        return APIHandler.Post('audittopic/' + id);
    };

    this.AddTopic = function(param){
        return APIHandler.Post('audittopic', param);
    };

    this.DeleteTopic = function (id) {
        return APIHandler.Delete('audittopic/' + id);
    };
    // end topic

    this.GetFindings = function(){
        return APIHandler.Get('auditfindings');
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

    this.GetPolicyDocs = function(size, page){
        return APIHandler.Get('policies?pagesize=' + size + '&page=' + page);
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
    };

    this.GetControlData = function() {
        return APIHandler.Get('crtldata');
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
        var url = 'auditmgmt/' + idd + '/upload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.FileDownload = function(idd){
        var url = 'auditmgmt/download/' + idd;
        return APIHandler.Get(url);
    };

});

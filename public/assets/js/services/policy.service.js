/**
 * Created by Precision on 03/01/2017.
 */

app.service('PolicyService', function(APIHandler){

    this.GetPolicies = function(size, page){
        return APIHandler.Get('policies?pagesize=' + size + '&page=' + page);
    };

    this.GetPolicy = function(id){
        return APIHandler.Get('policies/' + id);
    };

    this.AddPolicy = function(params){
        return APIHandler.Post('policies', params);
    };

    this.DeletePolicy = function(id){
        return APIHandler.Delete('policies/'+id);
    };

    this.UpdatePolicy = function(id, params){
        return APIHandler.Put('policies/'+id, params);
    };

    this.GetAssessTypes = function(){
        return APIHandler.Get('assessmenttypes');
    };

    this.FileUpload = function (idd, fileModel) {
        if(fileModel.length < 1){
            return APIHandler.NullPromise();
        }
        var formdata = new FormData();
        for (var i in fileModel) {
            formdata.append("uploadFile", fileModel[i]._file);
        }
        var url = 'policies/' + idd + '/multiUpload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.multiFileUpload = function (params) {

        var fileModel = params.fileModel;
        if(fileModel.length < 1){
            return APIHandler.NullPromise();
        }
        var formdatas = new FormData();
        formdatas.append("policies", angular.toJson(params));

        for (var i in fileModel) {
            formdatas.append("uploadFile", fileModel[i]._file);
        }

        var url = 'policies/multiUpload';
        return APIHandler.UploadFileAndData(url, formdatas, params);
    };
});

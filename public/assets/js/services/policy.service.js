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
        return APIHandler.Post('policies/', params);
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
            fileModel[i].id = idd + '_' + i;
            formdata.append("file", fileModel[i]._file);
        }
        var url = 'policies/' + idd + '/upload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.FileDownload = function(idd, path){
        var url = 'policies/download/stream/' + idd ;
        //var param = {fileId: idd, filePath: path};
        return APIHandler.Get(url);
    };
});

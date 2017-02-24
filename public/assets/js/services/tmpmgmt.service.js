/**
 * Created by Precision on 03/01/2017.
 */

app.service('TmpmgmtService', function(APIHandler){

    this.GetTemplate = function(){
        return APIHandler.Get('template');
    };

    this.DeleteTemplate = function(id){
        return APIHandler.Delete('template/' + id);
    };

    this.AddTemplate = function(params){
        return APIHandler.Post('template/', params);
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
        var url = 'template/upload/' + idd;
        return APIHandler.UploadFile(url, formdata);
    };
});

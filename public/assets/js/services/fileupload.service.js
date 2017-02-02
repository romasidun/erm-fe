app.service('FileUploadService', function ($rootScope, APIHandler) {

    this.FileUpload = function (idd, fileModel) {
        var formdata = new FormData();
        for (var i in fileModel) {
            formdata.append("uploadFile", fileModel[i]._file);
        }
        return APIHandler.UploadFile(idd, formdata);
    };

});

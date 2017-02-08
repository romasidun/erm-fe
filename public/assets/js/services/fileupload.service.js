app.service('FileUploadService', function ($rootScope, APIHandler, $http) {

    this.FileUpload = function (idd, fileModel) {
        var formdata = new FormData();
        for (var i in fileModel) {
            formdata.append("uploadFile", fileModel[i]._file);
        }
        var url = baseUrl + 'policies/' + idd + '/multiUpload';
        return APIHandler.UploadFile(url, formdata);
    };

});

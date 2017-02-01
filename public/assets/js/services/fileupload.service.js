
app.service('FileUploadService', function($rootScope, APIHandler){

    this.FileUpload = function(idd, formdata){
      return APIHandler.FileUpload(idd, formdata);
    };

});

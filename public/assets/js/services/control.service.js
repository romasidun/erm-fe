app.service('ControlService', function ($rootScope, APIHandler, Utils) {

    this.GetRepos = function (size, page) {
        size = size || 10;
        page = page || 1;
        return APIHandler.Get('crtls/repository?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetRepo = function (id) {
        return APIHandler.Get('crtls/repository/' + id);
    };

    this.AddRepo = function (params) {
        return APIHandler.Post('crtls/repository/', params);
    };

    this.DeleteRepo = function (id) {
        return APIHandler.Delete('crtls/repository/' + id);
    };

    this.UpdateRepo = function (id, params) {
        return APIHandler.Put('crtls/repository/' + id, params);
    };

    this.GetTestPlans = function (size, page) {
        return APIHandler.Get('crtls/testPlans?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetTestPlan = function (id) {
        return APIHandler.Get('crtls/testPlans/' + id);
    };

    this.AddTestPlans = function (params) {
        return APIHandler.Post('crtls/testPlans', params);
    };

    this.DeleteTestPlans = function (id) {
        return APIHandler.Delete('crtls/testPlans/' + id);
    };

    this.UpdateTestPlans = function (id, params) {
        return APIHandler.Put('crtls/testPlans/' + id, params);
    };

    this.GetTestResults = function (size, page) {
        return APIHandler.Get('crtls/testResults?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetTestResult = function (id) {
        return APIHandler.Get('crtls/testResults/' + id);
    };

    this.AddTestResults = function (params) {
        return APIHandler.Post('crtls/testResults', params);
    };

    this.DeleteTestResults = function (id) {
        return APIHandler.Delete('crtls/testResults/' + id);
    };

    this.UpdateTestResults = function (id, params) {
        console.log('paramsparams',params);
        return APIHandler.Put('crtls/testResults/' + id, params);
    };

    this.GetUsers = function () {
        return APIHandler.Get('users');
    };

    this.GetByCategory = function () {
        return APIHandler.Get('crtls/repository/category');
    };

    this.GetByCtrlDefn = function () {
        return APIHandler.Get('crtls/repository/definition');
    };

    this.GetRiskType = function () {
        return APIHandler.Get('crtls/repository/risktype');
    };

    this.GetBySoure = function () {
        return APIHandler.Get('crtls/repository/source');
    };

    this.GetByTePeriod = function () {
        return APIHandler.Get('crtls/testPlans/period');
    };

    this.GetByTeCategory = function () {
        return APIHandler.Get('crtls/testPlans/category');
    };

    this.GetTeRiskType = function () {
        return APIHandler.Get('crtls/testPlans/risktype');
    };

    this.GetTeBySoure = function () {
        return APIHandler.Get('crtls/testPlans/source');
    };

    this.DTExcelDownload = function (param) {
        return APIHandler.Excel('/control_xlsx', param);
    };

    this.FileUpload = function (idd, fileModel) {
        if(fileModel == null || fileModel.length < 1){
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
        var url = 'crtls/' + idd + '/upload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.FileDownload = function(idd){
        var url = 'crtls/download/' + idd;
        return APIHandler.Get(url);
    };
});

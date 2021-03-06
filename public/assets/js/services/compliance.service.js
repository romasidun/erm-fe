app.service('ComplianceService', function (APIHandler) {

    this.GetSOXTPs = function (size, page) {
        size = size || 10;
        page = page || 1;
        return APIHandler.Get('compliance/soxtp?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetSOXTP = function (id) {
        return APIHandler.Get('compliance/soxtp/' + id);
    };

    this.AddSOXTP = function () {
        return APIHandler.Post('compliance/soxtp/');
    };

    this.DeleteSOXTP = function (id) {
        return APIHandler.Delete('compliance/soxtp/' + id);
    };

    this.UpdateSOXTP = function (id, params) {
        return APIHandler.Put('compliance/soxtp/' + id, params);
    };
    
    this.GetSOXTPTemplate = function(){
        return APIHandler.Get('compliance/soxtp/templates');
    };

    this.GetSOXRCMs = function (size, page) {
        return APIHandler.Get('compliance/soxrcm?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetSOXRCM = function (id) {
        return APIHandler.Get('compliance/soxrcm/' + id);
    };

    this.AddSOXRCM = function (params) {
        return APIHandler.Post('compliance/soxrcm/' + params);
    };

    this.DeleteSOXRCM = function (id) {
        return APIHandler.Delete('compliance/soxrcm/' + id);
    };

    this.UpdateSOXRCM = function (id, params) {
        return APIHandler.Put('compliance/soxrcm/' + id, params);
    };
    
    this.GetSOXRCMTemplate = function(){
        return APIHandler.Get('compliance/soxrcm/templates');
    };

    this.GetSOXPRAs = function (size, page) {
        return APIHandler.Get('compliance/soxpra?pagesize=' + size + '&pageNumber=' + page);
    };

    this.GetSOXPRA = function (id) {
        return APIHandler.Get('compliance/soxpra/' + id);
    };

    this.AddSOXPRA = function (params) {
        return APIHandler.Post('compliance/soxpra/' + params);
    };

    this.DeleteSOXPRA = function (id) {
        return APIHandler.Delete('compliance/soxpra/' + id);
    };

    this.UpdateSOXPRA = function (id, params) {
        return APIHandler.Put('compliance/soxpra/' + id, params);
    };
    
    this.GetSOXPRATemplate = function(){
        return APIHandler.Get('compliance/soxpra/templates');
    };

    this.GetUsers = function () {
        return APIHandler.Get('users');
    };

    this.GetSOXPRADept = function () {
        return APIHandler.Get('compliance/soxpra/dept');
    };

    this.GetSOXPRAPeriod = function () {
        return APIHandler.Get('compliance/soxpra/period');
    };

    this.GetSOXPRARegion = function () {
        return APIHandler.Get('compliance/soxpra/region');
    };

    this.GetSOXPRAStatus = function () {
        return APIHandler.Get('compliance/soxpra/status');
    };

    this.GetSOXRCMDept = function () {
        return APIHandler.Get('compliance/soxrcm/dept');
    };

    this.GetSOXRCMPeriod = function () {
        return APIHandler.Get('compliance/soxrcm/period');
    };

    this.GetSOXRCMRegion = function () {
        return APIHandler.Get('compliance/soxrcm/region');
    };

    this.GetSOXRCMStatus = function () {
        return APIHandler.Get('compliance/soxrcm/status');
    };

    this.GetSOXTPDept = function () {
        return APIHandler.Get('compliance/soxtp/dept');
    };

    this.GetSOXTPPeriod = function () {
        return APIHandler.Get('compliance/soxtp/period');
    };

    this.GetSOXTPRegion = function () {
        return APIHandler.Get('compliance/soxtp/region');
    };

    this.GetSOXTPStatus = function () {
        return APIHandler.Get('/compliance/soxtp/status');
    };

    this.DownloadExcel = function (params) {
        return APIHandler.Excel('/createExcel', params);
    };
    this.ExcelDownload = function (params) {
        return APIHandler.Excel('/xlsx', params);
    };

    this.DTExcelDownload = function (param) {
        return APIHandler.Excel('/control_xlsx', param);
    };

    this.GetSOXPRAAssessments = function () {
        return APIHandler.Get('compliance/soxpra');
    };

    this.GetSOXPRAAssessment = function (id) {
        return APIHandler.Get('compliance/soxpra/' + id);
    };

    this.PostSOXPRAAssessment = function (params) {
        return APIHandler.Post('compliance/soxpra', params);
    };

    this.DeleteSOXPRAAssessment = function (id) {
        return APIHandler.Delete('compliance/soxpra/' + id);
    };

    this.UpdateSOXPRAAssessment = function (id, params) {
        return APIHandler.Put('compliance/soxpra/' + id, params);
    };

    this.GetSOXRCMAssessments = function () {
        return APIHandler.Get('compliance/soxrcm');
    };

    this.GetSOXRCMAssessment = function (id) {
        return APIHandler.Get('compliance/soxrcm/' + id);
    };

    this.PostSOXRCMAssessment = function (params) {
        return APIHandler.Post('compliance/soxrcm', params);
    };

    this.DeleteSOXRCMAssessment = function (id) {
        return APIHandler.Delete('compliance/soxrcm/' + id);
    };

    this.UpdateSOXRCMAssessment = function (id, params) {
        return APIHandler.Put('compliance/soxrcm/' + id, params);
    };
    this.GetSOXTPAssessments = function () {
        return APIHandler.Get('compliance/soxtp');
    };

    this.GetSOXTPAssessment = function (id) {
        return APIHandler.Get('compliance/soxtp/' + id);
    };

    this.PostSOXTPAssessment = function (params) {
        return APIHandler.Post('compliance/soxtp', params);
    };

    this.DeleteSOXTPAssessment = function (id) {
        return APIHandler.Delete('compliance/soxtp/' + id);
    };

    this.UpdateSOXTPAssessment = function (id, params) {
        return APIHandler.Put('compliance/soxtp/' + id, params);
    };
    this.GetControlData = function () {
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
        var url = 'compliance/' + idd + '/upload';
        return APIHandler.UploadFile(url, formdata);
    };

    this.FileDownload = function(idd){
        var url = 'compliance/download/' + idd;
        return APIHandler.Get(url);
    };
});


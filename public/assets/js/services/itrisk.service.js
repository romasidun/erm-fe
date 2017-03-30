(function () {
    "use strict";
    app.service('ITRiskService', function ($rootScope, APIHandler, Utils) {

        this.GetUsers = function () {
            return APIHandler.Get('users');
        };

        this.GetRim = function () {
            return APIHandler.Get('itrisk/itrim');
        };

        this.GetRimById = function (id) {
            return APIHandler.Get('itrisk/itrim/' + id);
        };

        this.PostAction = function (params) {
            return APIHandler.Post('itrisk/itrim/actions', params);
        };

        this.PutAction = function (id, params) {
            return APIHandler.Put('itrisk/itrim/actions/' + id, params);
        };

        this.GetOneAction = function (id) {
            return APIHandler.Get('itrisk/itrim/actions/' + id);
        };

        this.DeleteAction = function (id) {
            return APIHandler.Delete('itrisk/itrim/actions/' + id);
        };

        this.GetActionsByRiskId = function (id) {
            return APIHandler.Get('itrisk/itrim/actionsbyriskid/' + id);
        };

        this.GetTemplate = function () {
            return APIHandler.Get('itram/templates');
        };

        this.TemplateDownload = function (id) {
            return APIHandler.Get('itram/templates/download/' + id);
        };

        this.AddRim = function (params) {
            return APIHandler.Post('itrisk/itrim', params);
        };

        this.GetRimPeriod = function () {
            return APIHandler.Get('itrisk/itrim/period');
        };

        this.GetRimRiskCategory = function () {
            return APIHandler.Get('itrisk/itrim/riskCategory');
        };

        this.GetRimStatus = function () {
            return APIHandler.Get('itrisk/itrim/status');
        };

        this.DeleteRim = function (id) {
            return APIHandler.Delete('itrisk/itrim/' + id);
        };

        this.UpdateRim = function (id, params) {
            return APIHandler.Put('itrisk/itrim/' + id, params);
        };

        this.LoadAPIRoutes = function () {
            return APIHandler.Get('');
        };

        this.GetRam = function () {
            return APIHandler.Get('itram');
        };

        this.GetRamById = function (id) {
            return APIHandler.Get('itram/' + id);
        };

        this.AddRam = function (params) {
            return APIHandler.Post('itram', params);
        };

        this.DeleteRam = function (id) {
            return APIHandler.Delete('itram/' + id);
        };

        this.UpdateRam = function (id, params) {
            return APIHandler.Put('itram/' + id, params);
        };

        this.GetRamDept = function () {
            return APIHandler.Get('itram/dept');
        };

        this.GetRamPeriod = function () {
            return APIHandler.Get('itram/period');
        };

        this.GetRamRegion = function () {
            return APIHandler.Get('itram/region');
        };

        this.GetRamStatus = function () {
            return APIHandler.Get('itram/status');
        };

        this.GetRamTemplates = function () {
            return APIHandler.Get('itram/templates');
        };


        this.FileUpload = function (idd, fileModel) {
            if (fileModel.length < 1) {
                return APIHandler.NullPromise();
            }
            var formdata = new FormData();
            for (var i in fileModel) {
                if (fileModel[i].id != 'newfile') {
                    return APIHandler.NullPromise();
                }
                fileModel[i].id = idd + '_' + i;
                formdata.append("file", fileModel[i]._file);
            }
            var url = 'itrisk/' + idd + '/upload';
            return APIHandler.UploadFile(url, formdata);
        };

        this.FileDownload = function (idd) {
            var url = 'itrisk/download/' + idd;
            return APIHandler.Get(url);
        };
    });
})();

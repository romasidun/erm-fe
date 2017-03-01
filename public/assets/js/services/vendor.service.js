'use strict';
/**
 * Created by Star on 1/24/2017.
 */
app.service('VendorService', ['APIHandler', '$localStorage', function (APIHandler, $localStorage) {
    this.GetRim = function () {
        return APIHandler.Get('vendorassessmentlist');
    };

    this.GetRimById = function (id) {
        return APIHandler.Get('vendorassessmentlist/' + id);
    };

    this.GetRimAM = function () {
        return APIHandler.Get('vendorriskassessment');
    };

    this.AddRim = function (data) {
        return APIHandler.Post('vendorassessmentlist', data);
    };
    this.PutAseessmentList = function (id, data) {
        return APIHandler.Put('vendorassessmentlist/' + id, data);
    };

    this.GetRimStatus = function () {
        return APIHandler.Get('vendorassessmentlist/status');
    };

    this.GetRimPeriod = function () {
        return APIHandler.Get('vendorassessmentlist/period');
    };

    this.DeleteRim = function (id) {
        return APIHandler.Delete('vendorassessmentlist/' + id);
    };

    this.GetRimVendor = function () {
        return APIHandler.Get('vendorassessmentlist/vendor');
    };

    this.GetRimRiskScore = function () {
        return APIHandler.Get('vendorassessmentlist/riskScore');
    };

    this.GetRimDocType = function () {
        return APIHandler.Get('vendorassessmentlist/docType');
    };

    this.GetRimRiskType = function () {
        return APIHandler.Get('vendorassessmentlist/riskType');
    };

    this.UpdateRam = function (id, params) {
        return APIHandler.Put('vendorassessmentlist/' + id, params);
    };


    this.GetVendor = function () {
        return APIHandler.Get('vendor');
    };
    this.GetVendorById = function (id) {
        return APIHandler.Get('vendor/' + id);
    };

    this.GerUserList = function () {
        return APIHandler.Get('users');
    };

    this.GetRiskType = function () {
        return APIHandler.Get('vendorriskassessmenttype');
    };
    this.SendMail = function (params) {
        return APIHandler.Post('vendorriskassessment/sendEmail', params);
    };

    this.calcMetrics = function (asId, vrName) {
        return APIHandler.Post('vendorriskassessment/computeRiskDataMetrics/' + vrName + '/' + asId);
    };

    //vendor risk collection data
    this.GetVRCollectByVendor = function (asId, vrName) {
        return APIHandler.Get('vendorriskcollectiondata/' + vrName + '/' + asId);
    };

    /*
     Desc: Get Control Data by vendor risk type
     param1: vendor risk type - i.g : 3rd Party Outsourcing Information, SIG, VRAQ
     author: Roma
     */
    this.GetVRCollectionFromControl = function (sourceName) {
        return APIHandler.Get('crtldata/vr/questions?sourcename=' + sourceName);
    };

    /*
     Desc: Post Vendor Assessment Data
     param1: Post Data - i.g : 2d array
     author: Roma
     */
    this.PostVRCollection = function (data) {
        return APIHandler.Post('vendorriskcollectiondata', data);
    };

    /*
     Desc: Update Vendor Assessment Data
     param1: id - i.g : string
     param2: Post Data - i.g : 2d array
     author: Roma
     */
    this.PutVRCollection = function (id, data) {
        return APIHandler.Put('vendorriskcollectiondata/' + id, data);
    };
    /////////////////////////////////////////////////////////////

    this.SetAssessmentData = function (set_data) {
        $localStorage.Vendor_data_selected = set_data.Vendor_data_selected;
        $localStorage.RiskAssessmentType_selected = set_data.RiskAssessmentType_selected;
        $localStorage.AssessmentData_by_vendorName = set_data.AssessmentData_by_vendorName;
        $localStorage.Enter_title = set_data.Enter_title;
    };

    this.GetAssessmentData = function () {
        return {
            Vendor_data_selected: $localStorage.Vendor_data_selected,
            RiskAssessmentType_selected: $localStorage.RiskAssessmentType_selected,
            AssessmentData_by_vendorName: $localStorage.AssessmentData_by_vendorName,
            Enter_title: $localStorage.Enter_title
        }
    };

    this.DownloadExcel = function (params) {
        return APIHandler.Excel('/createExcel', params);
    };
}]);

/**
 * Created by Hafeez on 27/01/2017.
 */

app.service('RiskDataService', function (APIHandler) {

    this.GetRiskMetrics = function () {
        return APIHandler.Get('riskdatametrics');
    };

});
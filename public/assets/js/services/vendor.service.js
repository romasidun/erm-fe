'use strict';
/**
 * Created by Star on 1/24/2017.
 */
app.service('VendorService', ['APIHandler','$localStorage', function (APIHandler, $localStorage) {
    this.GetVendorAssessment = function (sourceName) {
        return APIHandler.Get('crtldata/vr/questions?sourcename=' + sourceName);
    };

    this.GetVendorNameList = function () {
        return APIHandler.Get('vendor');
    };

    this.GetRiskAssessmentTypeList = function () {
        return APIHandler.Get('vendorriskassessmenttype');
    };

    this.GetVendorAssessmentList = function () {
        return APIHandler.Get('vendorassessmentlist');
    };

    this.SetAssessmentData = function(set_data) {
        $localStorage.VendorData = set_data.VendorData;
        $localStorage.RiskAssessmentType = set_data.RiskAssessmentType;
    };

    this.GetAssessmentData = function () {
        return {
            VendorData: $localStorage.VendorData,
            riskTypeData: $localStorage.RiskAssessmentType
        }
    };

    this.PostVendorData = function(data){
        return APIHandler.Post('vendorriskassessment', data);
    }

}]);
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

    this.GetRimById = function(id){
        return APIHandler.Get('itrisk/itrim/' + id);
    };


    this.SetAssessmentData = function(set_data) {
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

    this.PostVendorData = function(data){
        return APIHandler.Post('vendorriskassessment', data);
    }

}]);

/**
 * Created by Hafeez on 27/01/2017.
 */

app.service('RiskDataService', function(APIHandler){

    this.GetRiskMetrics = function(){
        return APIHandler.Get('riskdatametrics');
    };

});
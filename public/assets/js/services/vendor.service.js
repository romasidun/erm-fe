'use strict';
/**
 * Created by Star on 1/24/2017.
 */
app.service('VendorService', ['APIHandler','$localStorage', function (APIHandler, $localStorage) {
    this.GetRim = function(){
        return APIHandler.Get('vendorassessmentlist');
    };

    this.GetRimById = function(id){
        return APIHandler.Get('vendorassessmentlist/' + id);
    };

    this.UpdateRam = function(id, params){
        return APIHandler.Put('vendorassessmentlist/'+id, params);
    };

    this.GetVendorAssessment = function (sourceName) {
        return APIHandler.Get('crtldata/vr/questions?sourcename=' + sourceName);
    };

    this.GetVendor = function () {
        return APIHandler.Get('vendor');
    };

    this.GerUserList = function () {
        return APIHandler.Get('users');
    };

    this.GetRiskType = function () {
        return APIHandler.Get('vendorriskassessmenttype');
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

    this.AddRim = function(data){
        return APIHandler.Post('vendorassessmentlist', data);
    };

    this.GetRimStatus = function(){
        return APIHandler.Get('vendorassessmentlist/status');
    };

    this.GetRimPeriod = function(){
        return APIHandler.Get('vendorassessmentlist/period');
    };

    this.GetRimRiskCategory = function(){
        return APIHandler.Get('itrisk/itrim/riskCategory');
    };


}]);

/**
 * Created by Hafeez on 27/01/2017.
 */

app.service('RiskDataService', function(APIHandler){

    this.GetRiskMetrics = function(){
        return APIHandler.Get('riskdatametrics');
    };

});
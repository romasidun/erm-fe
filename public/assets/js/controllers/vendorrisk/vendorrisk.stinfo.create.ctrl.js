(function () {
    'use strict';
    VendorriskStinfoCTController.$inject = ['$rootScope', '$state', 'VendorService'];
    app.controller('VendorriskStinfoCTCtrl', VendorriskStinfoCTController);
    function VendorriskStinfoCTController($rootScope, $state, VendorService) {
        var vm = this;
        vm.saveVendorData = saveVendorData;
        vm.mainTitle = "Vendor Risk Assessment";
        vm.vendorResponseVal = vendorResponseVal;
        function vendorResponseVal(para, ele, event){
            if($(event.target).prop('checked') == true){
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        }

        function getAssessment() {
            var AssessmentData = VendorService.GetAssessmentData();
            console.log('AssessmentData',AssessmentData);
            vm.Vendor_data_selected = angular.fromJson(AssessmentData.Vendor_data_selected);
            vm.Vendor_data_title = AssessmentData.Enter_title;
            vm.AssessmentData_by_vendorName = angular.fromJson(AssessmentData.AssessmentData_by_vendorName);
            vm.amdata_by_filter = angular.fromJson(AssessmentData.AssessmentData_by_vendorName);
            vm.vendorrisk = [];
            VendorService.GetVendorAssessment(AssessmentData.RiskAssessmentType_selected.riskType).then(function (response) {
                vm.vendorrisk = angular.fromJson(response);
                $rootScope.app.Mask = false;
            });
        }

        function saveVendorData() {
            var date = new Date();
            var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var current_user = $('.dropdown.current-user .username').text();
            var vendor_docType = vm.amdata_by_filter.docType;
            var vendor_riskScore = vm.amdata_by_filter.riskScore;
            var vendor_riskType = vm.amdata_by_filter.vendorRiskType;
            var vendor_contact = vm.amdata_by_filter.vendorContact;
            var vendor_id = vm.amdata_by_filter.id;
            var vendor_name = vm.amdata_by_filter.vendorName;
            for(var i in vm.vendorrisk){
                var vendor_response = "NA";
                if(vm.vendorrisk[i].responseN == false && vm.vendorrisk[i].responseY == false){
                    vendor_response = "NA";
                }
                if(vm.vendorrisk[i].responseN == true){
                    vm.vendorrisk[i].responseY = false;
                    vendor_response = "N";
                }
                if(vm.vendorrisk[i].responseY == true){
                    vm.vendorrisk[i].responseN = false;
                    vendor_response = "Y";
                }
                var vendor_comment = angular.isDefined(vm.vendorrisk[i].comments) ? vm.vendorrisk[i].comments : "";
                var vendor_Findings = angular.isDefined(vm.vendorrisk[i].findings) ? vm.vendorrisk[i].findings : 0;
                var vendor_Category = angular.isDefined(vm.vendorrisk[i].category) ? vm.vendorrisk[i].category : "";

                $rootScope.app.Mask = false;
                var post_data = {
                    "approvedDate": current_date,
                    "approver": current_user,
                    "comments": vendor_comment,
                    "control_Category": vendor_Category,
                    "docType": vendor_docType,
                    "findings": vendor_Findings,
                    "response": vendor_response,
                    "riskScore": vendor_riskScore,
                    "riskTypes": vendor_riskType,
                    "vendorContact": vendor_contact,
                    "vendorId": vendor_id,
                    "vendorName": vendor_name
                };
                    // title
                    // Period
                    // Approval Status
                    // Approved Ddate
                    // Version
                    // Assessments date
                    // Assessment By
                    // Email/Link
                    // Aggregated Risk Score
                    // Overall Risk Score
                VendorService.PostVendorData(post_data).then(function () {
                    $rootScope.app.Mask = false;
                })
            }
        }

        function initFunc() {
            getAssessment();
        }

        initFunc();
    }

})();
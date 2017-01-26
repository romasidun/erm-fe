(function () {
    'use strict';
    VendorriskStinfoCTController.$inject = ['$rootScope', '$state', 'VendorService'];
    app.controller('VendorriskStinfoCTCtrl', VendorriskStinfoCTController);
    function VendorriskStinfoCTController($rootScope, $state, VendorService) {
        var vm = this;
        $rootScope.app.Mask = false;

        vm.vendorData = {};

        function getAssessment() {
            var AssessmentData = VendorService.GetAssessmentData();
            vm.vendorData = angular.fromJson(AssessmentData.VendorData);
            vm.vendorrisk = [];
            VendorService.GetVendorAssessment(AssessmentData.riskTypeData.riskType).then(function (response) {
                vm.vendorrisk = angular.fromJson(response);
                console.log('asdfasd',vm.vendorrisk);
            });
        }

        function saveVendorData() {
            var date = new Date();
            vm.current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            vm.current_user = $('.dropdown.current-user .username').text();
            vm.vendor_comments = "";
            vm.vendor_control_catetory = "";
            vm.docType = "";
            // var postData = {};
            // postData = {
            //     "approvedDate": current_date,
            //     "approver": current user,
            //     "comments": "string",
            //     "control_Category": "vendor risk category",
            //     "docType": from screen1 selection
            //     "findings": 0,
            //     "response": true,
            //     "riskScore": 0,
            //     "riskTypes": "string",
            //     "vendorContact": "string",
            //     "vendorId": "string",
            //     "vendorName": "string"
            // }
            // VendorService.PostVendorData().then(function(response){
            //     console.log(response);
            // });
        }

        function initFunc() {
            getAssessment();
            vm.saveVendorData = saveVendorData;
        }

        initFunc();
    }

})();
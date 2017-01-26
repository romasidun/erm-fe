(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$rootScope', '$state', 'VendorService'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($rootScope, $state, VendorService) {
        var vm = this;
        var vendordata_score = "";
        initFunc();
        function initFunc() {
            getVendorNameList();
            getRiskAssessmentTypeList();
            getVendorAssessmentList();
        }

        function getVendorNameList() {
            vm.vendornamelist = [{id: '', vendorName: 'Pick Vendor dropdown of vendors'}];
            VendorService.GetVendorNameList().then(function (response) {
                var re = angular.fromJson(response);
                for (var r in re) {
                    vm.vendornamelist[vm.vendornamelist.length] = re[r];
                }
                vm.selectVendorNameOption = vm.vendornamelist[0];
            });

        }

        function getRiskAssessmentTypeList() {
            vm.riskassementtype = [{id: '', riskType: 'Show a list of Risk Assessments/Surveys/Questionaires'}];
            VendorService.GetRiskAssessmentTypeList().then(function (response) {
                var re = angular.fromJson(response);
                for (var r in re) {
                    vm.riskassementtype[vm.riskassementtype.length] = re[r];
                }
                vm.selectRiskAssessmentTypeList = vm.riskassementtype[0];
            });
        }

        function getVendorAssessmentList() {
            vm.vendorAMdata = [];
            VendorService.GetVendorAssessmentList().then(function (response1) {
                $rootScope.app.Mask = false;
                vm.vendorAMdata = angular.fromJson(response1);
            });
        }

        vm.createAssessment = createAssessment;
        function createAssessment() {
            vm.EmptyVendor = false;
            vm.EmptyVendorMessage = '';
            if (vm.selectVendorNameOption.id == '') {
                vm.EmptyVendor = true;
                vm.EmptyVendorMessage = 'Please pick a vendor.';
                return false;
            }
            vm.EmptyRiskAssessment = false;
            vm.EmptyRiskAssessmentMessage = '';
            if (vm.selectRiskAssessmentTypeList.id == '') {
                vm.EmptyRiskAssessment = true;
                vm.EmptyRiskAssessmentMessage = 'Please Select a Risk Assessment Type.';
                return false;
            }

            //get assessment data by filter

            var vendorNameList_dataobj = vm.selectVendorNameOption;
            var selected_vendorName = vendorNameList_dataobj.vendorName;

            var riskASData_by_vendorName = vm.vendorAMdata.filter(function(a){
                return a.vendorName == selected_vendorName;
            });

            // end filter
            console.log('asdf', vm.selectRiskAssessmentTypeLis);

            var set_data = {
                VendorData: riskASData_by_vendorName[0],
                RiskAssessmentType: vm.selectRiskAssessmentTypeList,

            };

            VendorService.SetAssessmentData(set_data);
            $state.go('app.vendorrisk.stinfo.create');
        }
    }
})();
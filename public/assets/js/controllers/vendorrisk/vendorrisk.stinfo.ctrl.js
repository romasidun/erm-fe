(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$rootScope', '$state', 'VendorService'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($rootScope, $state, VendorService) {
        var vm = this;
        vm.mainTitle = "Risk Assessment ";
        var vendordata_score = "";

        function getVendorNameList() {
            $(".vendornamelist").select2({
                placeholder: "Pick Vendor dropdown of vendors"
            });
            vm.vendornamelist = [{id: '', vendorName: ''}];
            VendorService.GetVendorNameList().then(function (response) {
                var re = angular.fromJson(response);
                console.log('getVendorNameList',re);
                for (var r in re) {
                    vm.vendornamelist[vm.vendornamelist.length] = re[r];
                }
                vm.selectVendorNameOption = vm.vendornamelist[0];
            });

        }

        function getRiskAssessmentTypeList() {
            $(".riskassementtype").select2({
                placeholder: "Show a list of Risk Assessments/Surveys/Questionaires"
            });
            vm.riskassementtype = [{id: '', riskType: ''}];
            VendorService.GetRiskAssessmentTypeList().then(function (response) {
                var re = angular.fromJson(response);
                for (var r in re) {
                    vm.riskassementtype[vm.riskassementtype.length] = re[r];
                }
                vm.selectRiskAssessmentTypeList = vm.riskassementtype[0];
                console.log('vm.selectRiskAssessmentTypeList',vm.riskassementtype);
            });
        }

        function getVendorAssessmentList() {
            $(".vendorTitleList").select2({
                placeholder: "Pick Vendor Title List"
            });
            $(".vendorPeriodList").select2({
                placeholder: "Pick Vendor Period List"
            });
            var vendorTitle = [''];
            var vendorPeriod = [''];
            vm.vendorAMdata = [];
            VendorService.GetVendorAssessmentList().then(function (response1) {
                vm.vendorAMdata = angular.fromJson(response1);
                // start get assessment title
                for(var i in vm.vendorAMdata){
                    vendorTitle[vendorTitle.length] = vm.vendorAMdata[i]['title'];
                    // vendorTitle.push(vm.vendorAMdata[i]['title']);
                }

                vm.vendorTitleList = vendorTitle.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });
                vm.selectVendorTitleList = vm.vendorTitleList[0];
                // end

                // start get assessment period
                for(var i in vm.vendorAMdata){
                    vendorPeriod[vendorPeriod.length] = vm.vendorAMdata[i]['period'];
                }
                vm.vendorPeriodList = vendorPeriod.filter(function(elem, index, self){
                    return index == self.indexOf(elem);
                });
                console.log('vendorPeriodList',vm.vendorPeriodList);
                vm.selectVendorPeriodList = vm.vendorPeriodList[0];
                // end
                $rootScope.app.Mask = false;
            });

        }

        vm.createAssessment = createAssessment;
        function createAssessment() {
            //validation Risk assessment
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
            //end validation

            //get assessment data by filter
            var selected_vendorName = vm.selectVendorNameOption.vendorName;

            var riskASData_by_vendorNameObje = vm.vendorAMdata.filter(function(a){
                return a.vendorName == selected_vendorName;
            });
            vm.riskASData_by_vendorName = riskASData_by_vendorNameObje[0];
            // end filter
            console.log('vm.selectVendorNameOption',vm.riskASData_by_vendorName);
            var set_data = {
                Vendor_data_selected: vm.selectVendorNameOption,
                RiskAssessmentType_selected: vm.selectRiskAssessmentTypeList,
                AssessmentData_by_vendorName: vm.riskASData_by_vendorName
            };

            VendorService.SetAssessmentData(set_data);
            $state.go('app.vendorrisk.stinfo.create');
        }

        initFunc();
        function initFunc() {
            getVendorNameList();
            getRiskAssessmentTypeList();
            getVendorAssessmentList();
        }
    }
})();
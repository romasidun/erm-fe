(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$rootScope', '$state', 'ExcelFactory', 'VendorService', '$timeout'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($rootScope, $state, ExcelFactory, VendorService, $timeout) {
        var vm = this;
        vm.mainTitle = 'Risk Assessment ';
        vm.enterVendorTtileList = '';

        function getVendorAssessmentList() {
            $(".vendorNameList").select2({
                placeholder: "Pick Vendor dropdown of vendors"
            });
            $(".vendorRiskTypeList").select2({
                placeholder: "Show a list of Risk Assessments/Surveys/Questionaires"
            });
            $(".vendorPeriodList").select2({
                placeholder: "Pick Vendor Period List"
            });
            var vendorName = [''];
            var vendorRiskType = [''];
            var vendorPeriod = [''];

            vm.vendorAMdata = [];

            VendorService.GetVendorAssessmentList().then(function (response) {
                vm.vendorAMdata = angular.fromJson(response);
                for(var i in vm.vendorAMdata){
                    vendorName[vendorName.length] = vm.vendorAMdata[i]['vendorName'];
                    vendorRiskType[vendorRiskType.length] = vm.vendorAMdata[i]['vendorRiskType'];
                    vendorPeriod[vendorPeriod.length] = vm.vendorAMdata[i]['period'];
                }
                vm.vendorNameList = vendorName.filter(function(elem, index, self) {
                   return index == self.indexOf(elem);
                });
                vm.vendorRiskTypeList = vendorRiskType.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });

                vm.vendorPeriodList = vendorPeriod.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });
                vm.selectVendorNameList = vm.vendorNameList[0];
                vm.selectvendorRiskTypeList = vm.vendorRiskTypeList[0];
                vm.selectVendorPeriodList = vm.vendorPeriodList[0];
                $rootScope.app.Mask = false;
            });
        }

        vm.createAssessment = createAssessment;
        function createAssessment() {
            vm.NameList_select = false;
            vm.Alert_namelist = '';
            if (vm.selectVendorNameList === '' || angular.isUndefined(vm.selectVendorNameList)) {
                vm.NameList_select = true;
                vm.Alert_namelist = 'Please Select a vendor Name.';
                return false;
            }

            vm.TypeList_select = false;
            vm.Alert_typelist = '';
            if (vm.selectvendorRiskTypeList === '' || angular.isUndefined(vm.selectvendorRiskTypeList)) {
                vm.TypeList_select = true;
                vm.Alert_typelist = 'Please Select a Risk Assessment Type.';
                return false;
            }

            vm.TitleList_enter = false;
            vm.Alert_titlelist = '';
            if(vm.enterVendorTtileList === '' || angular.isUndefined(vm.enterVendorTtileList)) {
                vm.TitleList_enter = true;
                vm.Alert_titlelist = 'Please Enter a Risk Assessment Title.';
                return false;
            }

            vm.PeriodList_select = false;
            vm.Alert_periodlist = '';

            if (vm.selectVendorPeriodList === '' || angular.isUndefined(vm.selectVendorPeriodList)) {
                vm.PeriodList_select = true;
                vm.Alert_periodlist = 'Please Select a Risk Assessment Period.';
                return false;
            }
            //end validation
            var new_data = {
                name : vm.selectVendorNameList,
                risktype : vm.selectvendorRiskTypeList,
                title : vm.enterVendorTtileList,
                period : vm.selectVendorPeriodList
            };
            console.log(new_data);
            //get assessment data
            //
            // var selected_vendorName = vm.selectVendorNameOption.vendorName;
            //
            // var riskASData_by_vendorNameObje = vm.vendorAMdata.filter(function(a){
            //     return a.vendorName == selected_vendorName;
            // });
            // vm.riskASData_by_vendorName = riskASData_by_vendorNameObje[0];
            // // end filter
            // var set_data = {
            //     Vendor_data_selected: vm.selectVendorNameOption,
            //     RiskAssessmentType_selected: vm.selectRiskAssessmentTypeList,
            //     AssessmentData_by_vendorName: vm.riskASData_by_vendorName,
            //     Enter_title: vm.enterVendorTtileList
            // };

            // VendorService.SetAssessmentData(set_data);
            // $state.go('app.vendorrisk.stinfo.create');
        }

        vm.downloadAssessment = downloadAssessment;
        function downloadAssessment() {
            var head_row = $('table.riskassessment_data_table thead tr');
            var body_row = $('table.riskassessment_data_table tbody tr');
            var checkedRow = $('table tr');
            var head_row_col = head_row.children('th');
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            head_row_col.slice(0, head_row_col.length-1).each(function (i) {
                console.log($(this).html());
                tableHtml += '<td>' + $(this).html() + '</td>';
            });
            tableHtml += '</tr>';

            checkedRow.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
                    tableHtml += '<td>' + $(this).html() + '</td>';
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';

            var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
            /*window.open('data:application/vnd.ms-excel,'+tableHtml);
             e.preventDefault();*/
        }

        initFunc();
        function initFunc() {
            // getVendorNameList();
            // getRiskAssessmentTypeList();
            getVendorAssessmentList();
        }
    }
})();


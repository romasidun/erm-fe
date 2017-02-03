(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$rootScope', '$state', 'ExcelFactory', 'VendorService', '$timeout'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($rootScope, $state, ExcelFactory, VendorService, $timeout) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = 'Risk Assessment';
        vm.enterVendorTileList = '';

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
                }
                console.log('vm.vendorAMdata',vm.vendorAMdata);
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
            vm.NameList_select = false;
            vm.Alert_namelist = '';
            if (vm.selectVendorNameOption.id === '' || angular.isUndefined(vm.selectVendorNameOption.id)) {
                vm.NameList_select = true;
                vm.Alert_namelist = 'Please Select a vendor Name.';
                return false;
            }

            vm.TypeList_select = false;
            vm.Alert_typelist = '';
            if (vm.selectRiskAssessmentTypeList.id === '' || angular.isUndefined(vm.selectRiskAssessmentTypeList.id)) {
                vm.TypeList_select = true;
                vm.Alert_typelist = 'Please Select a Risk Assessment Type.';
                return false;
            }

            vm.TitleList_enter = false;
            vm.Alert_titlelist = '';
            if(vm.enterVendorTileList === '' || angular.isUndefined(vm.enterVendorTileList)) {
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

            //get assessment data by filter
            var selected_vendorName = vm.selectVendorNameOption.vendorName;

            var riskASData_by_vendorNameObje = vm.vendorAMdata.filter(function(a){
                return a.vendorName == selected_vendorName;
            });
            vm.riskASData_by_vendorName = riskASData_by_vendorNameObje[0];
            // end filter
            var set_data = {
                Vendor_data_selected: vm.selectVendorNameOption,
                RiskAssessmentType_selected: vm.selectRiskAssessmentTypeList,
                AssessmentData_by_vendorName: vm.riskASData_by_vendorName,
                Enter_title: vm.enterVendorTileList
            };

            VendorService.SetAssessmentData(set_data);
            $state.go('app.vendorrisk.stinfo.create');
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
            getVendorNameList();
            getRiskAssessmentTypeList();
            getVendorAssessmentList();
        }
    }
})();
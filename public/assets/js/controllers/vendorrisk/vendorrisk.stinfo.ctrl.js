(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$scope','$rootScope', '$state', 'ExcelFactory', 'VendorService', '$timeout', 'Utils', 'ChartFactory'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($scope,$rootScope, $state, ExcelFactory, VendorService, $timeout, Utils, ChartFactory) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = 'Risk Assessment';

        // start sort
        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.sortMe = function (col) {
            if ($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function (col) {
            if ($scope.CurrCol === col) {
                return $scope.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };
        // end sort

        VendorService.GetRimStatus()
            .then(function (data) {
                var ristInc = [];
                Object.keys(data).forEach(function (k) {
                    ristInc.push({key: Utils.camelizeString(k), val: data[k]});
                });
                setupPieChart(ristInc);
                return VendorService.GetRimPeriod()
            })
            // .then(function (data) {
            //     setupPeriodChart(data);
            //     return VendorService.GetRimRiskCategory()
            // })
            .then(function (data) {
                setupPeriodChart(data);
                $scope.$watch('PerPage', function (n, o) {
                    $rootScope.app.Mask = true;
                    loadRim();
                });
            });

        function setupPieChart(data) {
            var dataList = [];
            data.forEach(function (o) {
                dataList.push([o.key, o.val]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('VendorRisk by Status', 'VendorRisk by Status', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('statusChart', chartObj);
        }

        function setupPeriodChart(data) {
            var month, opts = {
                Title: "Vendor By Period",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "Low", data: []},
                    {name: "Medium", data: []},
                    {name: "High", data: []}
                ],
                Colors: ['#DFC600', '#2E8AE5', '#ED0C00']
            };
            Object.keys(data).forEach(function (k) {
                if (k.indexOf('Low') > -1) {
                    month = Utils.camelizeString(k.split('Low')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    month = Utils.camelizeString(k.split('Med')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('High') > -1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(month) === -1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function loadRim() {
            VendorService.GetRim().then(function (data) {
                data.forEach(function (r) {
                    r.assessdate = Utils.createDate(r.due_date);
                    r.approvdate = Utils.createDate(r.approvedDate);
                });

                $scope.vendorAMdata = data;
                $rootScope.app.Mask = false;
            });
        }

        $scope.downloadExcel = function(){
            var head_row = $('table.VendorTable thead tr');
            var body_row = $('table.VendorTable tbody tr');
            var head_row_col = head_row.children('th');
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            head_row_col.slice(1, head_row_col.length-1).each(function (i) {
                tableHtml += '<td>' + $(this).children('a').text() + '</td>';
            });
            tableHtml += '</tr>';

            body_row.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
                    console.log(tdObj.length);
                    console.log(i);
                    if(i == 0 || i == tdObj.length-1){
                        return;
                    }
                    tableHtml += '<td>' + $(this).html() + '</td>';
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
            $timeout(function () {
                location.href = exportHref;
            }, 100);
        };
        // loadRim();
        // function loadRim() {
        //     VendorService.GetRim().then(function (data) {
        //         vm.vendorAMdata = angular.fromJson(data);
        //         data.forEach(function (r) {
        //             r.IDate = Utils.createDate(r.due_date);
        //         });
        //         console.log('data',data);
        //         vm.vendorData = data;
        //         $rootScope.app.Mask = false;
        //     });
        // }
        //
        // $scope.CurrCol = 'period';
        // $scope.IsAsc = true;
        //
        // $scope.OpList = [10, 25, 50, 100];
        // $scope.PerPage = 10;
        //
        // $scope.sortMe = function (col) {
        //     if ($scope.CurrCol === col)
        //         $scope.IsAsc = !$scope.IsAsc;
        //     else
        //         $scope.CurrCol = col;
        // };
        //
        // $scope.resSort = function (col) {
        //     if ($scope.CurrCol === col) {
        //         return $scope.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
        //     } else {
        //         return 'fa-unsorted';
        //     }
        // };




        // vm.enterVendorTileList = '';
        //
        // function getVendorNameList() {
        //     $(".vendornamelist").select2({
        //         placeholder: "Pick Vendor dropdown of vendors"
        //     });
        //     vm.vendornamelist = [{id: '', vendorName: ''}];
        //     VendorService.GetVendorNameList().then(function (response) {
        //         var re = angular.fromJson(response);
        //         console.log('getVendorNameList',re);
        //         for (var r in re) {
        //             vm.vendornamelist[vm.vendornamelist.length] = re[r];
        //         }
        //         vm.selectVendorNameOption = vm.vendornamelist[0];
        //     });
        //
        // }
        //
        // function getRiskAssessmentTypeList() {
        //     $(".riskassementtype").select2({
        //         placeholder: "Show a list of Risk Assessments/Surveys/Questionaires"
        //     });
        //     vm.riskassementtype = [{id: '', riskType: ''}];
        //     VendorService.GetRiskAssessmentTypeList().then(function (response) {
        //         var re = angular.fromJson(response);
        //         for (var r in re) {
        //             vm.riskassementtype[vm.riskassementtype.length] = re[r];
        //         }
        //         vm.selectRiskAssessmentTypeList = vm.riskassementtype[0];
        //         console.log('vm.selectRiskAssessmentTypeList',vm.riskassementtype);
        //     });
        // }
        //
        // function getVendorAssessmentList() {
        //     $(".vendorTitleList").select2({
        //         placeholder: "Pick Vendor Title List"
        //     });
        //     $(".vendorPeriodList").select2({
        //         placeholder: "Pick Vendor Period List"
        //     });
        //     var vendorTitle = [''];
        //     var vendorPeriod = [''];
        //     vm.vendorAMdata = [];
        //     VendorService.GetVendorAssessmentList().then(function (response1) {
        //         vm.vendorAMdata = angular.fromJson(response1);
        //         // start get assessment title
        //         for(var i in vm.vendorAMdata){
        //             vendorTitle[vendorTitle.length] = vm.vendorAMdata[i]['title'];
        //         }
        //         console.log('vm.vendorAMdata',vm.vendorAMdata);
        //         vm.vendorTitleList = vendorTitle.filter(function(elem, index, self) {
        //             return index == self.indexOf(elem);
        //         });
        //         vm.selectVendorTitleList = vm.vendorTitleList[0];
        //         // end
        //
        //         // start get assessment period
        //         for(var i in vm.vendorAMdata){
        //             vendorPeriod[vendorPeriod.length] = vm.vendorAMdata[i]['period'];
        //         }
        //         vm.vendorPeriodList = vendorPeriod.filter(function(elem, index, self){
        //             return index == self.indexOf(elem);
        //         });
        //         console.log('vendorPeriodList',vm.vendorPeriodList);
        //         vm.selectVendorPeriodList = vm.vendorPeriodList[0];
        //         // end
        //         $rootScope.app.Mask = false;
        //     });
        //
        // }
        //
        // vm.createAssessment = createAssessment;
        // function createAssessment() {
        //
        //     //validation Risk assessment
        //     vm.NameList_select = false;
        //     vm.Alert_namelist = '';
        //     if (vm.selectVendorNameOption.id === '' || angular.isUndefined(vm.selectVendorNameOption.id)) {
        //         vm.NameList_select = true;
        //         vm.Alert_namelist = 'Please Select a vendor Name.';
        //         return false;
        //     }
        //
        //     vm.TypeList_select = false;
        //     vm.Alert_typelist = '';
        //     if (vm.selectRiskAssessmentTypeList.id === '' || angular.isUndefined(vm.selectRiskAssessmentTypeList.id)) {
        //         vm.TypeList_select = true;
        //         vm.Alert_typelist = 'Please Select a Risk Assessment Type.';
        //         return false;
        //     }
        //
        //     vm.TitleList_enter = false;
        //     vm.Alert_titlelist = '';
        //     if(vm.enterVendorTileList === '' || angular.isUndefined(vm.enterVendorTileList)) {
        //         vm.TitleList_enter = true;
        //         vm.Alert_titlelist = 'Please Enter a Risk Assessment Title.';
        //         return false;
        //     }
        //
        //     vm.PeriodList_select = false;
        //     vm.Alert_periodlist = '';
        //
        //     if (vm.selectVendorPeriodList === '' || angular.isUndefined(vm.selectVendorPeriodList)) {
        //         vm.PeriodList_select = true;
        //         vm.Alert_periodlist = 'Please Select a Risk Assessment Period.';
        //         return false;
        //     }
        //     //end validation
        //
        //     //get assessment data by filter
        //     var selected_vendorName = vm.selectVendorNameOption.vendorName;
        //
        //     var riskASData_by_vendorNameObje = vm.vendorAMdata.filter(function(a){
        //         return a.vendorName == selected_vendorName;
        //     });
        //     vm.riskASData_by_vendorName = riskASData_by_vendorNameObje[0];
        //     // end filter
        //     var set_data = {
        //         Vendor_data_selected: vm.selectVendorNameOption,
        //         RiskAssessmentType_selected: vm.selectRiskAssessmentTypeList,
        //         AssessmentData_by_vendorName: vm.riskASData_by_vendorName,
        //         Enter_title: vm.enterVendorTileList
        //     };
        //
        //     VendorService.SetAssessmentData(set_data);
        //     $state.go('app.vendorrisk.stinfo.create');
        // }
        //
        // vm.downloadAssessment = downloadAssessment;
        // function downloadAssessment() {
        //     var head_row = $('table.riskassessment_data_table thead tr');
        //     var body_row = $('table.riskassessment_data_table tbody tr');
        //     var checkedRow = $('table tr');
        //     var head_row_col = head_row.children('th');
        //     var tableHtml = '<table>';
        //     tableHtml += '<tr>';
        //     head_row_col.slice(0, head_row_col.length-1).each(function (i) {
        //         console.log($(this).html());
        //         tableHtml += '<td>' + $(this).html() + '</td>';
        //     });
        //     tableHtml += '</tr>';
        //
        //     checkedRow.each(function (i) {
        //         tableHtml += '<tr>';
        //         var tdObj = $(this).closest('tr').find('td');
        //         tdObj.each(function (i) {
        //             tableHtml += '<td>' + $(this).html() + '</td>';
        //         });
        //         tableHtml += '</tr>';
        //     });
        //     tableHtml += '</table>';
        //
        //     var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
        //     $timeout(function () {
        //         location.href = exportHref;
        //     }, 100); // trigger download
        //     /*window.open('data:application/vnd.ms-excel,'+tableHtml);
        //      e.preventDefault();*/
        // }
        //
        // initFunc();
        // function initFunc() {
        //     getVendorNameList();
        //     getRiskAssessmentTypeList();
        //     getVendorAssessmentList();
        // }
    }
})();
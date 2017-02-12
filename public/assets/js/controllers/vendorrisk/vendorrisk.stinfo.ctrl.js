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
                ChartFactory.CreatePieChart('VendorRisk by Status', 'VendorRisk by Status', dataList, 'statusChart');
                // var ristInc = [];
                // Object.keys(data).forEach(function (k) {
                //     ristInc.push({key: Utils.camelizeString(k), val: data[k]});
                // });
                // setupStatusChart(ristInc);
                return VendorService.GetRimPeriod();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('Vendor By Period','Period', '', '', '', data, 'periodChart')
                // setupPeriodChart(data);
                return VendorService.GetRimDocType();
            })
            .then(function (data){
                setupDocTypeChart(data);
                return VendorService.GetRimVendor();
            })
            .then(function (data) {
                setupVendorChart(data);
                return VendorService.GetRimRiskType();
            })
            .then(function (data){
                setupRiskTypeChart(data);
                return VendorService.GetRimRiskScore();
            })
            .then(function(data){
                setupRiskScoreChart(data);
                $scope.$watch('PerPage', function (n, o) {
                    $rootScope.app.Mask = true;
                    loadRim();
                });
            });

        // function setupStatusChart(data) {
        //     var dataList = [];
        //     data.forEach(function (o) {
        //         dataList.push([o.key, o.val]);
        //     });
        //     console.log('dataListdataListdataList',dataList);
        //     var chartObj = ChartFactory.CreatePieChartTemplate(, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
        //     Highcharts.chart('statusChart', chartObj);
        // }

        // function setupPeriodChart(data) {
        //     var month, opts = {
        //         Title: "Vendor By Period",
        //         YText: "Values",
        //         Categories: [],
        //         Series: [
        //             {name: "Low", data: []},
        //             {name: "Medium", data: []},
        //             {name: "High", data: []}
        //         ],
        //         Colors: ['#DFC600', '#2E8AE5', '#ED0C00']
        //     };
        //     Object.keys(data).forEach(function (k) {
        //         if (k.indexOf('Low') > -1) {
        //             month = Utils.camelizeString(k.split('Low')[0]);
        //             opts.Series[0].data.push(data[k]);
        //         }
        //         if (k.indexOf('Med') > -1) {
        //             month = Utils.camelizeString(k.split('Med')[0]);
        //             opts.Series[1].data.push(data[k]);
        //         }
        //         if (k.indexOf('High') > -1) {
        //             month = Utils.camelizeString(k.split('High')[0]);
        //             opts.Series[2].data.push(data[k]);
        //         }
        //         if (opts.Categories.indexOf(month) === -1)
        //             opts.Categories.push(month);
        //     });
        //
        //     ChartFactory.SetupMultiColChart('periodChart', opts);
        // }

        function setupDocTypeChart(data){
            var dataList = [];
            angular.forEach(data,function(value, key){
                dataList.push([key, value]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('VendorRisk by DocType', 'VendorRisk by DocType', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('docTypeChart', chartObj);
        }

        function setupVendorChart(data){
            var datalist = [];
            angular.forEach(data, function(val, key){
                datalist.push([key, val]);
            });
            var cht = ChartFactory.CreatePieChartTemplate('VendorRisk by Vendor', 'VendorRisk by Vendor', datalist,  ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('vendorChart', cht);
        }

        function setupRiskTypeChart(data){
            var datalist = [];
            angular.forEach(data, function(val, key){
                datalist.push([key, val]);
            });
            var cht = ChartFactory.CreatePieChartTemplate('VendorRisk by RiskType', 'VendorRisk by RiskType', datalist,  ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('riskTypeChart', cht);
        }

        function setupRiskScoreChart(data){
            var datalist = [];
            angular.forEach(data, function(val, key){
                datalist.push([key, val]);
            });
            var cht = ChartFactory.CreatePieChartTemplate('VendorRisk by RiskStore', 'VendorRisk by RiskStore', datalist,  ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('riskScoreChart', cht);
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

        // $scope.downloadExcel = function(){
        //     var head_row = $('table.VendorTable thead tr');
        //     var body_row = $('table.VendorTable tbody tr');
        //     var head_row_col = head_row.children('th');
        //     var tableHtml = '<table>';
        //     tableHtml += '<tr>';
        //     head_row_col.slice(1, head_row_col.length-1).each(function (i) {
        //         tableHtml += '<td>' + $(this).children('a').text() + '</td>';
        //     });
        //     tableHtml += '</tr>';
        //
        //     body_row.each(function (i) {
        //         tableHtml += '<tr>';
        //         var tdObj = $(this).closest('tr').find('td');
        //         tdObj.each(function (i) {
        //
        //             if(i == 0 || i == tdObj.length){
        //                 return;
        //             }
        //             tableHtml += '<td>' + $(this).html() + '</td>';
        //         });
        //         tableHtml += '</tr>';
        //     });
        //     tableHtml += '</table>';
        //     console.log('tableHtmltableHtmltableHtml',tableHtml);
        //     // return;
        //     var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
        //     $timeout(function () {
        //         location.href = exportHref;
        //     }, 100);
        // };

        $scope.deleteAction = function (name) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                VendorService.DeleteRim(name.id).then(function (data) {
                    if (data.status === 200) loadRim();
                });
            });
        };
    }
})();
(function () {
    'use strict';
    VendorriskStinfoController.$inject = ['$scope', '$rootScope', '$state', 'ExcelFactory', 'VendorService', '$timeout', 'Utils', 'ChartFactory', '$filter'];
    app.controller('VendorriskStinfoCtrl', VendorriskStinfoController);
    function VendorriskStinfoController($scope, $rootScope, $state, ExcelFactory, VendorService, $timeout, Utils, ChartFactory, $filter) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = 'Risk Assessment';

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'title',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function (col) {
                if ($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function (col) {
                if ($scope.Grid1.Column === col) {
                    return $scope.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });

        VendorService.GetRimStatus()
            .then(function (data) {
                ChartFactory.CreatePieChart('VendorRisk by Status', 'VendorRisk by Status', data, 'statusChart');
                return VendorService.GetRimPeriod();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('Vendor By Period', 'Vendor By Period', '', '', '', data, 'periodChart')
                return VendorService.GetRimDocType();
            })
            .then(function (data) {
                var dataList = [];
                Object.keys(data).forEach(function (k) {
                    dataList.push([k, data[k]]);
                });
                var chartObj = ChartFactory.CreatePieChartTemplate('Vendor By DocType', 'VendorRisk by DocType', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
                Highcharts.chart('docTypeChart', chartObj);
                return VendorService.GetRimVendor();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('VendorRisk by VendorName', 'VendorRisk by VendorName', '', '', '', data, 'vendorChart');
                return VendorService.GetRimRiskType();
            })
            .then(function (data) {
                // ChartFactory.CreateLabelChart('VendorRisk by RiskType', 'VendorRisk by RiskType', '', '', '',  data, 'riskTypeChart');
                var dataList = [];
                Object.keys(data).forEach(function (k) {
                    dataList.push([k, data[k]]);
                });
                // console.log('dataListdataListdataList',dataList);
                var chartObj = ChartFactory.CreatePieChartTemplate('Vendor By RiskType', 'VendorRisk By RiskType', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
                Highcharts.chart('riskTypeChart', chartObj);
                return VendorService.GetRimRiskScore();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('VendorRisk by RiskScore', 'VendorRisk by RiskScore', '', '', '', data, 'riskScoreChart');
                $scope.$watch('PerPage', function (n, o) {
                    loadData();
                });
            });

        function loadData() {
            VendorService.GetRim().then(function (data) {
                data.forEach(function (r) {
                    r.assessdate = Utils.createDate(r.assessmentsDate);
                    r.approvdate = Utils.createDate(r.approvedDate);
                });

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }


        $scope.deleteAction = function (name) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                VendorService.DeleteRim(name.id).then(function (data) {
                    if (data.status === 200) loadData();
                });
            });
        };
    }
})();
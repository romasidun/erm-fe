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
                console.log('datadatadata',data);
                ChartFactory.CreatePieChart('VendorRisk by Status', 'VendorRisk by Status', data, 'statusChart');
                return VendorService.GetRimPeriod();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('Vendor By Period','Period', '', '', '', data, 'periodChart')

                return VendorService.GetRimDocType();
            })
            .then(function (data){
                // ChartFactory.CreateLabelChart('VendorRisk by DocType', 'VendorRisk by DocType', '', '', '',  data, 'docTypeChart');
                var dataList = [];
                Object.keys(data).forEach(function (k) {
                    dataList.push([k, data[k]]);
                });
                console.log('dataListdataListdataList',dataList);
                var chartObj = ChartFactory.CreatePieChartTemplate('Vendor By Period', 'VendorRisk by DocType', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
                Highcharts.chart('docTypeChart', chartObj);
                return VendorService.GetRimVendor();
            })
            .then(function (data) {
                ChartFactory.CreateLabelChart('VendorRisk by Vendor', 'VendorRisk by Vendor', '', '', '',  data, 'vendorChart');
                return VendorService.GetRimRiskType();
            })
            .then(function (data){
                // ChartFactory.CreateLabelChart('VendorRisk by RiskType', 'VendorRisk by RiskType', '', '', '',  data, 'riskTypeChart');
                var dataList = [];
                Object.keys(data).forEach(function (k) {
                    dataList.push([k, data[k]]);
                });
                // console.log('dataListdataListdataList',dataList);
                var chartObj = ChartFactory.CreatePieChartTemplate('Vendor By Period', 'VendorRisk by DocType', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
                Highcharts.chart('riskTypeChart', chartObj);
                return VendorService.GetRimRiskScore();
            })
            .then(function(data){
                ChartFactory.CreateLabelChart('VendorRisk by RiskScore', 'VendorRisk by RiskScore', '', '', '',  data, 'riskScoreChart');
                $scope.$watch('PerPage', function (n, o) {
                    loadRim();
                });
            });

        function loadRim() {
            VendorService.GetRim().then(function (data) {
                data.forEach(function (r) {
                    r.assessdate = Utils.createDate(r.due_date);
                    r.approvdate = Utils.createDate(r.approvedDate);
                });

                $scope.vendorAMdata = data;
                console.log('$scope.vendorAMdata$scope.vendorAMdata',$scope.vendorAMdata);
                $rootScope.app.Mask = false;
            });
        }


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
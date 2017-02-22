(function () {
    'use strict';
    VendorAssessmentController.$inject = ['$rootScope','$scope', '$state', 'VendorService', 'Utils', 'ExcelFactory', '$timeout', '$filter'];
    app.controller('VendorAssessmentCtrl', VendorAssessmentController);
    function VendorAssessmentController($rootScope, $scope, $state, VendorService, Utils, ExcelFactory, $timeout, $filter) {
        $scope.mainTitle = $state.current.title;
        var asId = $state.params.id;
        var vrId = $state.params.vendorId;
        $rootScope.app.Mask = true;

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

        $scope.goBack = function () {
            $state.go('app.vendorrisk.stinfo.update',{id: asId});
        };

        $scope.Vendor = {};
        var d = new Date();
        $scope.assessmentId = d.getTime();
        VendorService.GetRimById(asId).then(function(data){
            $scope.VM = data;
            return VendorService.GetVendorById(vrId);
        }).then(function (data) {
            $scope.Vendor = data;
            return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);
        }).then(function (data) {
            $scope.Grid1.Data = data;
            console.log(data);
            $rootScope.app.Mask = false;
        });
    }

})();
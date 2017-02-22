(function () {
    'use strict';
    VendorAssessmentReportController.$inject = ['$rootScope','$scope', '$state', 'VendorService', 'Utils', 'ExcelFactory', '$timeout', '$filter'];
    app.controller('VendorAssessmentReportCtrl', VendorAssessmentReportController);
    function VendorAssessmentReportController($rootScope, $scope, $state, VendorService, Utils, ExcelFactory, $filter) {
        $rootScope.app.layout.isNavbarFixed = false;
        $scope.mainTitle = $state.current.title;

        var asId = $state.params.assessmentId;
        var vrId = $state.params.vendorId;

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
/*

        $scope.$watch('Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });
*/

        $scope.VM = {};
        VendorService.GetRimById(asId).then(function(data){
            $scope.VM = data;
            return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);
        }).then(function (data) {
            $scope.Grid1.Data = data;
            console.log(data);
        });
/*
        VendorService.GetRimById(asId).then(function(data){
            //$rootScope.app.Mask = true;
            $scope.VM = data;
            data.approvedDate = new Date(data.approvedDate);
            $scope.VM.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.VM.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            VendorService.GetVendor()
                .then(function(data){
                    var selectedVendor = data.filter(function(a){
                        return a.vendorName == $scope.VM.vendorName;
                    });

                    $scope.vendor = selectedVendor[0];
                    return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);
                })
                .then(function(data){
                    $scope.vrStinfoCT = data;
                    $rootScope.app.Mask = false;
                })
        });

        $scope.vendorResponseVal =  function(para, ele, event){
            if($(event.target).prop('checked') == true){
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        };


        $scope.saveVendorData = function() {
            var date = new Date();
            var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var current_user = $('.dropdown.current-user .username').text();
            for(var i in $scope.vrStinfoCT){
                var vendor_response = "NA";
                if($scope.vrStinfoCT[i].responseN == false && $scope.vrStinfoCT[i].responseY == false){
                    vendor_response = "NA";
                }
                if($scope.vrStinfoCT[i].responseN == true){
                    $scope.vrStinfoCT[i].responseY = false;
                    vendor_response = "N";
                }
                if($scope.vrStinfoCT[i].responseY == true){
                    $scope.vrStinfoCT[i].responseN = false;
                    vendor_response = "Y";
                }
                var vendor_comment = angular.isDefined($scope.vrStinfoCT[i].comments) ? $scope.vrStinfoCT[i].comments : "";
                var vendor_Findings = angular.isDefined($scope.vrStinfoCT[i].findings) ? $scope.vrStinfoCT[i].findings : 0;
                var vendor_Category = angular.isDefined($scope.vrStinfoCT[i].category) ? $scope.vrStinfoCT[i].category : "";
                var post_data = {
                    comments: vendor_comment + "",
                    control_Category: vendor_Category + "",
                    docType: $scope.VM.docType + "",
                    finding: vendor_Findings,
                    response: vendor_response + "",
                    riskScore: $scope.VM.riskScore * 1,
                    riskType: $scope.VM.vendorRiskType + "",
                    vendor: {
                        id: $scope.vendor.id + "",
                        primaryContact: $scope.vendor.primaryContact + "",
                        vendorName: $scope.vendor.vendorName + ""
                    }
                };

                VendorService.PostVendorData(post_data).then(function () {
                    $rootScope.app.Mask = false;
                })
            }
        }*/
    }

})();
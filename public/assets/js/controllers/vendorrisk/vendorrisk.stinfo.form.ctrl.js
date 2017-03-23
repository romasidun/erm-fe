(function () {
    'use strict';
    VendorriskStinfoFormController.$inject = ['$scope', '$rootScope', '$state', 'VendorService', 'Utils', '$filter', 'UniqueID'];
    app.controller('VendorriskStinfoFormCtrl', VendorriskStinfoFormController);
    function VendorriskStinfoFormController($scope, $rootScope, $state, VendorService, Utils, $filter, UniqueID) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Manage VendorRisk Form";
        $rootScope.app.Mask = true;
        $scope.currPage = 'insert';

        $scope.VM = {
            title: "",
            approval: "",
            assessmentBy: "",
            approver: "",
            approvedDate: "",
            assessmentsDate: "",
            riskScore: 0,
            vendorRiskType: "",
            docType: "",
            period: "",
            vendors: []
        };

        $scope.Grid1 = {
            Column: 'vendorName',
            Filter: '',
            IsAsc: true,
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

        /*var vendor = {
         address: "",
         assessmentIds: [],
         email: "",
         id: "",
         primaryContact: "",
         statusMsg: "",
         vendorId: "",
         vendorName: "",
         vendorStatus: ""
         }*/

        $scope.submitAction = function () {
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.assessmentsDate);
            var d2 = moment($scope.VM.approvedDate);
            $scope.VM.assessmentsDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.approvedDate = (d2.isValid()) ? d2.format(dtype) : '';

            var selectedVendors = $filter('filter')($scope.Grid1.Data, {checked: true});
            if (selectedVendors.length < 1 || selectedVendors == null) {
                alert("Please select at least one vendor");
                return false;
            }

            angular.forEach(selectedVendors, function (item, ind) {
                delete item.checked;
                item.vendorId = $scope.generateUuid();
                item.statusMsg = "Create Assessment";
            });

            if ($scope.Form.VendorRisk.$pristine || $scope.Form.VendorRisk.$invalid) return false;

            $scope.VM.vendors = selectedVendors;
            VendorService.AddRim($scope.VM).then(function (res) {
                if (res.status === 200) {
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.VendorRisk.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.vendorrisk.stinfo.main');
                });
                return false;
            }
            $state.go('app.vendorrisk.stinfo.main');
        };

        $scope.generateUuid = function () {
            var uid = UniqueID.new();
            return uid;
        };

        VendorService.GerUserList().then(function (user) {
            $scope.userList = user;
            return VendorService.GetRiskType();
        }).then(function (risktype) {
            $scope.riskTypeList = risktype;
            return VendorService.GetVendor();
        }).then(function (vendor) {
            $scope.Grid1.Data = vendor;
            $rootScope.app.Mask = false;
        });
    }

})();
(function () {
    VendorStinfoUpdateController.inject = ['$scope', '$rootScope', '$state', 'VendorService', 'Utils'];
    app.controller('VendorStinfoUpdateCtrl', VendorStinfoUpdateController);
    function VendorStinfoUpdateController($scope, $rootScope, $state, VendorService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR UPDATE PAGE";
        $scope.showExcelButton = true;

        $scope.cancelAction = function () {
            if ($scope.Form.VendorRisk.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.vendorrisk.stinfo.main');
                });
                return false;
            }
            $state.go('app.vendorrisk.stinfo.main');
        };

        $scope.submitAction = function () {
            if ($scope.Form.VendorRisk.$invalid) return false;
            VendorService.UpdateRam($state.params.id, $scope.VM).then(function (res) {
                if (res.status === 200) {
                    $rootScope.app.Mask = false;
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };
        $scope.createAssessmentAction = function () {
            $state.go('app.vendorrisk.assessment', {id: $state.params.id});
        };

        VendorService.GetRimById($state.params.id).then(function (data) {
            data.approvedDate = new Date(data.approvedDate);
            $scope.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            $scope.VM = data;
            $rootScope.app.Mask = false;
        });

        VendorService.GetRiskType().then(function (risktype) {
            $scope.riskTypeList = risktype;
        });

        $scope.Grid1 = {
            Column: 'vendorName',
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
        VendorService.GetVendor().then(function (vendor) {
            $scope.Grid1.Data = vendor;
            $scope.vendor = vendor;
        });

        $scope.sendMail = function () {
            
        }
    }

})();


(function () {
    'use strict';
    VendorriskStinfoFormController.$inject = ['$scope','$rootScope', '$state', 'VendorService','Utils'];
    app.controller('VendorriskStinfoFormCtrl', VendorriskStinfoFormController);
    function VendorriskStinfoFormController($scope, $rootScope, $state, VendorService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Manage VendorRisk Form";
        $rootScope.app.Mask = false;
        $scope.showExcelButton = false;

        $scope.VM = {
            actualName: "",
            aggregatedRiskScore: "",
            approval: "",
            approvalStatus: "",
            approvedDate: "",
            approvedDtStr: "",
            approver: "",
            asmntType: "",
            asmntTypeName: "",
            asmntType_name: "",
            assessDesc: "",
            // assessId: 0,
            assessName: "",
            assessmentBy: "",
            assessmentDtStr: "",
            assessmentsDate: "",
            business: "",
            createdBy: "",
            createdOn: "",
            docType: "",
            dueDtStr: "",
            due_date: "",
            emailOrLink: "",
            filemodel: [],
            filename: "",
            frequency: "",
            // id: "",
            modifiedBy: "",
            modifiedOn: "",
            overallRiskScore: "",
            period: "",
            priority: "",
            region: "",
            resPerson: "",
            status: {},
            title: "",
            vendorContact: "",
            vendorName: "",
            vendorRiskType: "",
            version: ""
        };


        $scope.cancelAction = function(){
            if($scope.Form.VendorRisk.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.vendorrisk.stinfo.main');
                });
                return false;
            }
            $state.go('app.vendorrisk.stinfo.main');
        };

        $scope.submitAction = function () {
            if ($scope.Form.VendorRisk.$pristine || $scope.Form.VendorRisk.$invalid) return false;
            VendorService.AddRim($scope.VM).then(function (res) {
                if (res.status === 200) {
                    $state.go('app.vendorrisk.stinfo.main');
                }
            });
        };

        VendorService.GerUserList().then(function(user){
            $scope.userList = user;
        });

        VendorService.GetRiskType().then(function(risktype){
            $scope.riskTypeList = risktype;
        });

        VendorService.GetVendor().then(function(vendor){
            $scope.vendor = vendor;
        });

    }

})();
(function () {

    "use strict";

    SOXRCMFormController.$inject = ['$scope', '$rootScope', '$state', 'ComplianceService', 'Utils'];
    app.controller('SOXRCMFormCtrl', SOXRCMFormController);


    function SOXRCMFormController($scope, $rootScope, $state, ComplianceService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload a Risk Control Matrix Assessment";

        $scope.Form = {};

        $scope.VM = {
            actualName: "",
            approval: "",
            asmntType: "ACM012",
            asmntTypeName: "SOXRCM",
            asmntType_name: "",
            assessDesc: "",
            assessId: 0,
            assessName: "",
            business: "",
            createdBy: "",
            createdOn: "",
            due_date: moment().format("YYYY-MM-DD"),
            filemodel: [],
            filename: "",
            frequency: "",
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function () {
            if ($scope.Form.SoxRcm.$invalid) return false;

            $scope.VM.assessId = moment().format('X');
            ComplianceService.PostSOXRCMAssessment($scope.VM).then(function (res) {
                if (res.status === 200) $state.go('app.compliance.soxrcm.main');
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.SoxRcm.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.compliance.soxrcm.main');
                });
                return false;
            }
            $state.go('app.compliance.soxrcm.main');
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }

            console.log($scope.RiskCategories.SelCount);
        };

        $rootScope.app.Mask = false;
    }
})();
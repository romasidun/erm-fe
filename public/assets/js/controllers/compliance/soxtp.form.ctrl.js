(function () {

    "use strict";

    SOXTestPlanFormController.$inject = ['$scope', '$rootScope', '$state', 'SoxTpService', 'Utils'];
    app.controller('SOXTPFormCtrl', SOXTestPlanFormController);


    function SOXTestPlanFormController($scope, $rootScope, $state, SoxTpService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload a Sox Test Plan Assessment";

        $scope.Form = {};

        $scope.VM = {
            actualName: "",
            approval: "",
            asmntType: "",
            asmntTypeName: "",
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
            id: "",
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function () {
            if ($scope.Form.Rcsa.$invalid) return false;
            $scope.VM.assessId = moment().format('X');
            SoxTpService.PostAssessment($scope.VM).then(function (res) {
                if (res.status === 200) $state.go('app.compliance.soxtp.main');
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.Rcsa.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.compliance.soxtp.main');
                });
            }
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
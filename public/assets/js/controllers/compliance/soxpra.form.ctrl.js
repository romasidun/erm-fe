(function () {

    "use strict";

    SOXPRAFormController.$inject = ['$scope', '$rootScope', '$state', 'ComplianceService', 'Utils'];
    app.controller('SOXPRAFormCtrl', SOXPRAFormController);


    function SOXPRAFormController($scope, $rootScope, $state, ComplianceService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload a SOX Process Risk Assessment";

        $scope.Form = {};

        $scope.VM = {
            actualName: "",
            approval: "",
            asmntType: "ACM013",
            asmntTypeName: "SOXPRA",
            asmntType_name: "",
            assessDesc: "",
            assessId: 0,
            assessName: "",
            business: "",
            createdBy: "",
            createdOn: "",
            due_date: moment().format("MM-DD-YYYY"),
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
            if ($scope.Form.SoxPra.$invalid) return false;

            $scope.VM.assessId = moment().format('X');
            ComplianceService.PostSOXPRAAssessment($scope.VM).then(function (res) {
                if (res.status === 200) {
                    var fileModel = $scope.VM.filemodel;
                    ComplianceService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    }).finally(function () {
                        $state.go('app.compliance.soxpra.main');
                    });
                }
            });
        };
        
        $scope.cancelAction = function(){
            if($scope.Form.SoxPra.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.compliance.soxpra.main');
                });
                return false;
            }
            $state.go('app.compliance.soxpra.main');
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
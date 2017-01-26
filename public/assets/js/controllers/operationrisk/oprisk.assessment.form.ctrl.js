(function(){

    "use strict";

    OprAssFormController.$inject = ['$scope','$rootScope','$state', 'OPRiskService', 'Utils'];
    app.controller('OprAssessmentFormCtrl', OprAssFormController);


    function OprAssFormController($scope, $rootScope, $state, OPRiskService, Utils){

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload an Operational Risk Assessment";

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
             due_date: "",
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

        $scope.submitAction = function(){
            if($scope.Form.Rcsa.$invalid) return false;

            OPRiskService.PostAssessment($scope.VM).then(function(res){
                if(res.status === 200) $state.go('app.oprisk.assessment.main');
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.Rcsa.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.oprisk.assessment.main'); });
            }
        };

        $scope.setOpt = function(op){
            op.Selected = !op.Selected;
            if(op.Selected){
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }

            console.log($scope.RiskCategories.SelCount);
        };

        $rootScope.app.Mask = false;
    }
})();
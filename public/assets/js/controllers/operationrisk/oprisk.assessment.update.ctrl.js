(function(){

    "use strict";

    OprAssFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'OPRiskService', 'Utils'];
    app.controller('OprAssessmentUpdateCtrl', OprAssFormController);


    function OprAssFormController($scope, $rootScope, $state, $stateParams, OPRiskService, Utils){

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload an Operational Risk Assessment";

        $scope.Form = {};

        $scope.submitAction = function(){
            if($scope.Form.Rcsa.$invalid || $scope.Form.Rcsa.$pristine) return false;

            OPRiskService.UpdateAssessment($stateParams.id, $scope.VM).then(function(res){
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

        OPRiskService.GetAssessment($stateParams.id).then(function (data) {
            $scope.VM = data;
            $rootScope.app.Mask = false;
        });


    }
})();
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
             asmntType: "AOP02",
             asmntTypeName: "",
             asmntType_name: "",
             assessDesc: "",
             assessId: 0,
             assessName: "",
             business: "",
             createdBy: "",
             createdOn: "",
             dueDtStr: "",
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

        $scope.submitAction = function(){
            if($scope.Form.Rcsa.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dueDtStr);
            $scope.VM.dueDtStr = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.due_date = $scope.VM.dueDtStr;
            OPRiskService.PostAssessment($scope.VM).then(function(res){
                if(res.status === 200) {
                    var fileModel = $scope.VM.filemodel;
                    OPRiskService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    }).finally(function () {
                        $state.go('app.oprisk.assessment.main');
                    });
                }
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.Rcsa.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.oprisk.assessment.main');
                });
                return false;
            }
            $state.go('app.oprisk.assessment.main');
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
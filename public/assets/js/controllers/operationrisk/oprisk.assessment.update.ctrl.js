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

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.due_date);
            $scope.VM.due_date = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDtStr = $scope.VM.due_date;

            var fileModel = $scope.VM.filemodel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            OPRiskService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                    OPRiskService.UpdateAssessment($stateParams.id, $scope.VM).then(function(res){
                        console.log('res',res);
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

        OPRiskService.GetAssessment($stateParams.id).then(function (data) {
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.due_date);
            $scope.VM.due_date = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDtStr = $scope.VM.due_date;
            
            $rootScope.app.Mask = false;
        });

        $scope.download = function(fileId, filePath){
            var url = 'policies/download/stream/' + fileId ;
            var baseUrl = $rootScope.app.APIPrefix;
            url = baseUrl + url;
            window.open(url, '_blank');
        };

    }
})();
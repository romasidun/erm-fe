(function(){
    ITRiskAssFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ITRiskService', 'Utils'];
    app.controller('ITRiskAssUpdateCtrl', ITRiskAssFormController);

    function ITRiskAssFormController ($scope, $rootScope, $state, $stateParams, ITRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Update IT RISK ASSESSMENTS";

        $scope.Form =  {};

        $scope.submitAction = function(){
            if($scope.Form.ITRAM.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dueDtStr);
            $scope.VM.dueDtStr = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.due_date = $scope.VM.dueDtStr;

            var fileModel = $scope.VM.filemodel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ITRiskService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                ITRiskService.UpdateRam($stateParams.id, $scope.VM).then(function(res){
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.itrisk.assessment.main');
                });
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.ITRAM.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.itrisk.assessment.main');
                });
                return false;
            }
            $state.go('app.itrisk.assessment.main');
        };

        ITRiskService.GetRamById($stateParams.id).then(function(data){
            data.due_date= Utils.createDate(data.due_date);
            $scope.dueDate = Utils.GetDPDate(data.due_date);
            $scope.VM = data;
            $rootScope.app.Mask = false;
        });
    }
})();
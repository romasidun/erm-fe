(function(){
    PolicyFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'PolicyService', 'Utils'];
    app.controller('PolicyUpdateCtrl', PolicyFormController);

    function PolicyFormController ($scope, $rootScope, $state, $stateParams, PolicyService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Policies List";

        $scope.Form = {};

        $scope.submitAction = function(){
            $scope.IsSubmitted = true;
            if($scope.Form.Policy.$pristine || $scope.Form.Policy.$invalid) return false;

            var fileModel = $scope.VM.fileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            console.log(idd);
            $scope.VM.key = idd;
            PolicyService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                    PolicyService.UpdatePolicy($stateParams.id, $scope.VM).then(function (res) {
                        console.log('res',res);
                    }).finally(function () {
                        $state.go('app.policy.main');
                    });
                }
            });
/*
            PolicyService.UpdatePolicy($stateParams.id, $scope.VM).then(function(res){
                if(res.status === 200) {
                    $state.go('app.policy.main');

                }
            });*/
        };

        $scope.download = function(fileId){
            PolicyService.FileDownload(fileId).then(function (res) {
                console.log(res.File.path);
                window.open(res.File.path, '_blank');
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.Policy.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.policy.main');
                });
                return false;
            }
            $state.go('app.policy.main');
        };

        PolicyService.GetPolicy($stateParams.id).then(function(data){
            $scope.VM = data;
            console.log($scope.VM.assessmentType);
            $rootScope.app.Mask = false;
        });
    }
})();
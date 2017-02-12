(function(){
    PolicyFormController.$inject = ['$scope','$rootScope','$state', 'PolicyService', 'Utils'];
    app.controller('PolicyFormCtrl', PolicyFormController);

    function PolicyFormController ($scope, $rootScope, $state, PolicyService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Policies List";

        $scope.Form = {};

        $scope.VM = {
            assessmentType: [{  asTypeCode: '', asTypeDesc: '' }],
            createdBy:  null,
            createdOn:  null,
            docDesc:    '',
            docName:    '',
            fileModel:  [],
            modifiedBy: null,
            modifiedOn: null
        };

        $scope.submitAction = function(){
            $scope.IsSubmitted = true;
            if($scope.Form.Policy.$pristine || $scope.Form.Policy.$invalid) return false;

            PolicyService.multiFileUpload($scope.VM).then(function (res) {
                console.log(res);
            });

            /*PolicyService.AddPolicy($scope.VM).then(function(res){
                if(res.status === 200) {
                    var fileModel = $scope.VM.fileModel;
                    PolicyService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    }).finally(function () {
                        $state.go('app.policy.main');
                    });
                }
            });*/
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

        $rootScope.app.Mask = false;
    }
})();
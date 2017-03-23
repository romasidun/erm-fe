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

            var fileModel = $scope.VM.fileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            // console.log('idd', idd);
            // console.log('idd', fileModel);
            PolicyService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                PolicyService.AddPolicy($scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.policy.main');
                });
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.Policy.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
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
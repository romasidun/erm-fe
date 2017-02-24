(function(){
    TempMgmtFormController.$inject = ['$scope', '$rootScope', '$state', 'Utils', 'TmpmgmtService'];
    app.controller('tmpUpldsFormCtrl', TempMgmtFormController);
    function TempMgmtFormController($scope, $rootScope, $state, Utils, TmpmgmtService){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Template Detail";

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
            if($scope.Form.TemplateUpload.$pristine || $scope.Form.TemplateUpload.$invalid) return false;

            var fileModel = $scope.VM.fileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;

            console.log($scope.VM);
            TmpmgmtService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                TmpmgmtService.AddTemplate($scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.admin.tmpUplds.main');
                });
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.TemplateUpload.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.admin.tmpUplds.main');
                });
                return false;
            }
            $state.go('app.admin.tmpUplds.main');
        };

        $rootScope.app.Mask = false;
    }
})();
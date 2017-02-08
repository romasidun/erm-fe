(function(){
    ITRiskAssFormController.$inject = ['$scope','$rootScope','$state', 'ITRiskService', 'Utils'];
    app.controller('ITRiskAssFormCtrl', ITRiskAssFormController);

    function ITRiskAssFormController ($scope, $rootScope, $state, ITRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.Form =  {};

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
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function(){
            if($scope.Form.ITRAM.$invalid) return false;

            ITRiskService.AddRam($scope.VM).then(function(res){
                if(res.status === 200) {
                    var fileModel = $scope.VM.filemodel;
                    ITRiskService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    });

                    $state.go('app.itrisk.assessment.main');
                }
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

        ITRiskService.GetUsers().then(function(data){
           $scope.Responsibles = data;
           $rootScope.app.Mask = false;
        });
    }
})();
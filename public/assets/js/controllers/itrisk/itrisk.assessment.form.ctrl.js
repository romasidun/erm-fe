(function () {
    ITRiskAssFormController.$inject = ['$scope', '$rootScope', '$state', 'ITRiskService', 'Utils'];
    app.controller('ITRiskAssFormCtrl', ITRiskAssFormController);

    function ITRiskAssFormController($scope, $rootScope, $state, ITRiskService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

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
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function () {
            if ($scope.Form.ITRAM.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dueDtStr);
            $scope.VM.dueDtStr = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.due_date = $scope.VM.dueDtStr;

            var fileModel = $scope.VM.filemodel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ITRiskService.FileUpload(idd, fileModel)
                .then(function (res) {
                    if (res.status === 200) {
                        for (var i in fileModel) {
                            fileModel[i].id = res.data.fileId;
                            fileModel[i].filePath = res.data.path;
                        }
                    }
                })
                .finally(function () {
                    ITRiskService.AddRam($scope.VM).then(function (res) {

                    }).finally(function () {
                        $state.go('app.itrisk.assessment.main');
                    });
                });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.ITRAM.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.itrisk.assessment.main');
                });
                return false;
            }
            $state.go('app.itrisk.assessment.main');
        };

        ITRiskService.GetUsers().then(function (data) {
            $scope.Responsibles = data;
            $rootScope.app.Mask = false;
        });
    }
})();
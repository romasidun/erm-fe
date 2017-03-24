(function () {

    "use strict";

    ITRiskActionFormCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'ITRiskService', 'Utils'];
    app.controller('ITRiskActionFormCtrl', ITRiskActionFormCtrl);

    function ITRiskActionFormCtrl($scope, $rootScope, $state, $stateParams, $window, ITRiskService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Actions";
        $rootScope.app.Mask = true;

        $scope.VM = {
            actionStatus: "",
            actionfileModel: [],
            actionsDesc: "",
            actionsName: "",
            createdBy: "",
            createdOn: "",
            dueDate: "",
            modifiedBy: "",
            modifiedOn: "",
            riskId: $stateParams.pid,
            riskType: "",
            userName: ""
        };

        $scope.Form = {};

        $scope.dpOptions = {
            format: 'MM-DD-YYYY',
            autoclose: true
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function () {
            if ($scope.Form.ITAction.$invalid || $scope.Form.ITAction.pristine) return false;
            $rootScope.app.Mask = true;
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dueDate);
            $scope.VM.dueDate = (d1.isValid()) ? d1.format(dtype) : '';
            // $scope.VM.dueDateStr = $scope.VM.identifiedDate;

            var fileModel = $scope.VM.actionfileModel;
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
                    ITRiskService.PostAction($scope.VM).then(function (res) {
                        if (res.status === 200)
                            $window.history.back();
                    }).finally(function () {
                        $window.history.back();
                    });
                });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.OpAction.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $window.history.back();
                });
                return false;
            }
            $window.history.back();
        };

        $rootScope.app.Mask = false;
    }
})();
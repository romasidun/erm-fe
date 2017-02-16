(function () {

    "use strict";

    OprActionFormController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'OPRiskService', 'Utils'];
    app.controller('OprActionFormCtrl', OprActionFormController);


    function OprActionFormController($scope, $rootScope, $state, $stateParams, $window, OPRiskService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Actions";


        $scope.VM = {
            actionStatus: "",
            actionfileModel: [],
            actionsDesc: "",
            actionsName: "",
            auditId: "",
            createdBy: "",
            createdOn: "",
            deptId: "",
            dueDate: "",
            findingId: "",
            id: "",
            modifiedBy: "",
            modifiedOn: "",
            rcsaId: '',
            riskId: $stateParams.pid,
            riskType: "",
            topicid: "",
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
            if ($scope.Form.OpAction.$invalid || $scope.Form.OpAction.pristine) return false;

            /*var fileModel = $scope.VM.actionfileModel;
             OPRiskService.FileUpload($stateParams.id, fileModel).then(function (res) {
             console.log(res);
             });*/

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.dueDate);
            $scope.VM.dueDate = (d1.isValid()) ? d1.format(dtype) : '';
            // $scope.VM.dueDateStr = $scope.VM.identifiedDate;

            var fileModel = $scope.VM.actionfileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            OPRiskService.FileUpload(idd, fileModel)
                .then(function (res) {
                    if (res.status === 200) {
                        for (var i in fileModel) {
                            fileModel[i].id = res.data.fileId;
                            fileModel[i].filePath = res.data.path;
                        }
                    }
                })
                .finally(function () {
                    OPRiskService.PostAction($scope.VM).then(function (res) {
                        if (res.status === 200)
                            $window.history.back();
                    }).finally(function () {
                        $window.history.back();
                    });
                });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.OpAction.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
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
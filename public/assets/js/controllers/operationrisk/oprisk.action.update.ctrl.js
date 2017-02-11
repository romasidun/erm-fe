(function () {

    "use strict";

    OprIncFormController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'OPRiskService', 'Utils'];
    app.controller('OprIncidentUpdateCtrl', OprIncFormController);


    function OprIncFormController($scope, $rootScope, $state, $stateParams, OPRiskService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Actions";

        $scope.Form = {};
        $scope.RiskCategories = {List: [], SelCount: 0};

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
            $scope.VM.dueDateStr = $scope.VM.identifiedDate;

            OPRiskService.PutAction($stateParams.id, $scope.VM).then(function (res) {
                if (res.status === 200)
                    $state.go('app.oprisk.incident.main');
            });
        };

        OPRiskService.GetOneAction($stateParams.id).then(function (data) {
            //console.log(data);
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.dueDate);
            $scope.VM.dueDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDateStr = $scope.VM.identifiedDate;

            $rootScope.app.Mask = false;
        });
    }
})();
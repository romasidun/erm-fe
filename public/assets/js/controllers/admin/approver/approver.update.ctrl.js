(function () {
    ApproverUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'ApproverService', 'Utils'];
    app.controller('ApproverUpdateCtrl', ApproverUpdateController);

    function ApproverUpdateController($scope, $rootScope, $state, $uibModal, $filter, ApproverService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Approver Hierarchy";
        var aprId = $state.params.aprId;

        $rootScope.app.Mask = false;

        ApproverService.GetOne(aprId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.ApproverForm.$invalid) return false;

            ApproverService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.approver.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.ApproverForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.approver.main');
                });
                return false;
            }
            $state.go('app.admin.approver.main');
        };
    }
})();
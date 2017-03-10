(function () {
    RolesUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'RolesService', 'Utils'];
    app.controller('RolesUpdateCtrl', RolesUpdateController);

    function RolesUpdateController($scope, $rootScope, $state, $uibModal, $filter, RolesService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Role";
        var roleId = $state.params.roleId;

        $rootScope.app.Mask = false;

        RolesService.GetOne(roleId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.RolesForm.$invalid) return false;

            RolesService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.roles.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.RolesForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.roles.main');
                });
                return false;
            }
            $state.go('app.admin.roles.main');
        };
    }
})();
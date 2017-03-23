(function () {
    RolesUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'RolesService', 'Utils'];
    app.controller('RolesUpdateCtrl', RolesUpdateController);

    function RolesUpdateController($scope, $rootScope, $state, $uibModal, $filter, RolesService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Role";
        var roleId = $state.params.id;

        $rootScope.app.Mask = false;

        RolesService.GetOne(roleId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.RolesForm.$invalid) return false;

            RolesService.Put(roleId, vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.roles.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.RolesForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.roles.main');
                });
                return false;
            }
            $state.go('app.admin.roles.main');
        };
    }
})();
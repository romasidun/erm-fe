(function () {
    UsersUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'UsersService', 'Utils'];
    app.controller('UsersUpdateCtrl', UsersUpdateController);

    function UsersUpdateController($scope, $rootScope, $state, $uibModal, $filter, UsersService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update User";
        var userId = $state.params.userId;

        $rootScope.app.Mask = false;

        UsersService.GetOne(userId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.UsersForm.$invalid) return false;

            UsersService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.users.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.UsersForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.users.main');
                });
                return false;
            }
            $state.go('app.admin.users.main');
        };
    }
})();
(function () {
    UsersAddController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'UsersService', 'Utils'];
    app.controller('UsersAddCtrl', UsersAddController);

    function UsersAddController($scope, $rootScope, $state, $uibModal, $filter, UsersService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Users";

        vm.formdata = {
            userCode: "",
            userDesc: ""
        };

        $rootScope.app.Mask = false;

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
(function () {
    "use strict";

    UsersMainCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'UsersService', 'Utils'];
    app.controller('UsersMainCtrl', UsersMainCtrl);

    function UsersMainCtrl($scope, $rootScope, $state, $filter, $uibModal, UsersService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Role Management";

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'roleCode',
            IsAsc: true,
            Filter: "",
            Total: 1,
            Data: [],
            SortMe: function (col) {
                if (vm.Grid1.Column === col)
                    vm.Grid1.IsAsc = !vm.Grid1.IsAsc;
                else
                    vm.Grid1.Column = col;
            },
            GetIco: function (col) {
                if (vm.Grid1.Column === col) {
                    return vm.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('vm.Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')(vm.Grid1.Data, vm.Grid1.Filter);
            vm.Grid1.Total = searchedData.length;
        });

        UsersService.Get().then(function (data) {
            vm.Grid1.Total = data.length;
            vm.Grid1.Data = data;

            $rootScope.app.Mask = false;
        });

        vm.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                UsersService.Delete(r.id).then(function (data) {
                    if (data.status === 200){

                    }
                });
            });
        };
    }
})();

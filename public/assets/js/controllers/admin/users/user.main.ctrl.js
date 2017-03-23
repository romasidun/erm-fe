(function () {
    "use strict";

    UsersMainCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'UsersService', 'Utils'];
    app.controller('UsersMainCtrl', UsersMainCtrl);

    function UsersMainCtrl($scope, $rootScope, $state, $filter, $uibModal, UsersService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "User Management";

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'username',
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
            vm.Grid1.Data = [];
            angular.forEach(data, function (obj, key) {
                vm.Grid1.Data.push({
                    id: obj.id,
                    username: obj.username,
                    email: obj.email,
                    department: obj.department[0].deptName,
                    role: obj.role[0].roleDesc
                });
            });

            $rootScope.app.Mask = false;
        });

        vm.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                var rowId = r.id;
                UsersService.Delete(rowId).then(function (data) {
                    if (data.status === 200){
                        vm.Grid1.Total--;
                        for(var i in vm.Grid1.Data){
                            if(vm.Grid1.Data[i].id === rowId){
                                delete vm.Grid1.Data[i];
                            }
                        }
                        $rootScope.app.Mask = false;
                    }
                });
            });
        };
    }
})();
